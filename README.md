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

## Dashboard

Abrí [http://localhost:3000/admin](http://localhost:3000/admin).

En local la contraseña por defecto es `koinu`. En producción definí `ADMIN_PASSWORD` en `.env.local`.

Desde el dashboard podés:

- Ver pedidos y cambiar el estado (pendiente, pagado, en producción, enviado, completado, cancelado)
- Subir, editar y ocultar productos de la galería
- Cargar fotos de producto

Sin Supabase, pedidos y productos se guardan en `data/store.json`. Con Supabase, agregá también `SUPABASE_SERVICE_ROLE_KEY` para escribir en la base (estados y catálogo). Si el proyecto ya existía, ejecutá de nuevo `supabase/schema.sql` para sumar `image_url`.
