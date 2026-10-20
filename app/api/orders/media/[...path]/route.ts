import { NextResponse } from "next/server";
import { getOrderArt } from "@/lib/order-art-store";

type Props = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Props) {
  const { path } = await params;
  const objectPath = path.join("/");
  const file = await getOrderArt(objectPath);
  if (!file) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
