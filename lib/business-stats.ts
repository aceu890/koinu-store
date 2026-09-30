import { listOrders } from "@/lib/admin-data";
import type { AdminOrder } from "@/lib/types";

const TZ = "America/Santiago";
const DAY = 86_400_000;

export type StatPeriod = {
  orders: number;
  revenue: number;
  ticket: number;
};

export type WeekPoint = {
  key: string;
  label: string;
  revenue: number;
  orders: number;
};

export type TopProduct = {
  name: string;
  quantity: number;
  revenue: number;
};

export type BusinessStats = {
  thisMonth: StatPeriod;
  lastMonth: StatPeriod;
  last30: StatPeriod;
  prev30: StatPeriod;
  allTime: StatPeriod;
  weeks: WeekPoint[];
  topProducts: TopProduct[];
  customQty: number;
  catalogQty: number;
  inProgress: number;
  done: number;
};

function chileDay(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const [year, month, day] = parts.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function addMonths(dayUtc: number, months: number) {
  const date = new Date(dayUtc);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1);
}

function monday(dayUtc: number) {
  const day = new Date(dayUtc).getUTCDay();
  const diff = (day + 6) % 7;
  return dayUtc - diff * DAY;
}

function periodOf(orders: AdminOrder[], from: number, to: number): StatPeriod {
  const slice = orders.filter((order) => {
    if (order.status === "cancelled") return false;
    const day = chileDay(new Date(order.createdAt));
    return day >= from && day < to;
  });
  const revenue = slice.reduce((sum, order) => sum + order.total, 0);
  return {
    orders: slice.length,
    revenue,
    ticket: slice.length ? Math.round(revenue / slice.length) : 0,
  };
}

export function percentChange(current: number, previous: number) {
  if (!previous && !current) return 0;
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getBusinessStats(): Promise<BusinessStats> {
  const orders = await listOrders();
  const active = orders.filter((order) => order.status !== "cancelled");
  const today = chileDay(new Date());
  const monthStart = Date.UTC(new Date(today).getUTCFullYear(), new Date(today).getUTCMonth(), 1);
  const nextMonth = addMonths(monthStart, 1);
  const lastMonthStart = addMonths(monthStart, -1);
  const last30 = today - 29 * DAY;
  const prev30 = last30 - 30 * DAY;
  const weekStart = monday(today);

  const weeks: WeekPoint[] = [];
  for (let i = 7; i >= 0; i -= 1) {
    const from = weekStart - i * 7 * DAY;
    const to = from + 7 * DAY;
    const stats = periodOf(orders, from, to);
    const fromDate = new Date(from);
    weeks.push({
      key: String(from),
      label: new Intl.DateTimeFormat("es-CL", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
      }).format(fromDate),
      revenue: stats.revenue,
      orders: stats.orders,
    });
  }

  const productMap = new Map<string, TopProduct>();
  let customQty = 0;
  let catalogQty = 0;
  for (const order of active) {
    for (const item of order.items) {
      const qty = item.quantity || 0;
      if (item.kind === "custom") customQty += qty;
      else catalogQty += qty;
      const current = productMap.get(item.productName) ?? {
        name: item.productName,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += qty;
      current.revenue += item.unitPrice * qty;
      productMap.set(item.productName, current);
    }
  }

  const topProducts = [...productMap.values()]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 5);

  const allTimeRevenue = active.reduce((sum, order) => sum + order.total, 0);

  return {
    thisMonth: periodOf(orders, monthStart, nextMonth),
    lastMonth: periodOf(orders, lastMonthStart, monthStart),
    last30: periodOf(orders, last30, today + DAY),
    prev30: periodOf(orders, prev30, last30),
    allTime: {
      orders: active.length,
      revenue: allTimeRevenue,
      ticket: active.length ? Math.round(allTimeRevenue / active.length) : 0,
    },
    weeks,
    topProducts,
    customQty,
    catalogQty,
    inProgress: orders.filter(
      (order) =>
        order.status === "pending" || order.status === "paid" || order.status === "in_production",
    ).length,
    done: orders.filter((order) => order.status === "shipped" || order.status === "completed").length,
  };
}
