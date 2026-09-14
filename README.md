# Koinu Store

Ecommerce de sublimación y estampados: galería de productos, flujo de personalización, carrito y checkout.

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase · Zustand

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Sin Supabase también funciona: el catálogo y el carrito usan datos locales.

## Conectar Supabase

1. Creá un proyecto en [Supabase](https://supabase.com).
2. En el SQL Editor, ejecutá `supabase/schema.sql`.
3. Copiá `.env.example` a `.env.local` y completá:

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

4. Reiniciá `npm run dev`.

Los pedidos se guardan en `orders` y `order_items`. Si las variables no están, el checkout igual confirma en modo local.
