# Koinu Store

Ecommerce de sublimación y estampados: galería de productos, flujo de personalización, carrito y checkout.

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase · Zustand

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin Supabase también funciona: el catálogo y el carrito usan datos locales.

## Conectar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com) (región cercana, por ejemplo South America).
2. En el SQL Editor, pega y ejecuta todo `supabase/schema.sql`. Eso crea tablas, políticas y los buckets `product-images` y `order-art`.
3. Copia `.env.example` a `.env.local` y completa las tres claves de **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

4. Reinicia `npm run dev`. En `/admin` deberías ver “Base: Supabase”.

Los pedidos van a `orders` / `order_items`. Las fotos de producto y el arte para sublimar van a Storage. Sin esas variables, el checkout sigue funcionando en modo local (`data/store.json`).

## Dashboard

Abre [http://localhost:3000/admin](http://localhost:3000/admin).

En local la contraseña por defecto es `koinu`. En producción define `ADMIN_PASSWORD` en `.env.local`.

Desde el dashboard puedes:

- Ver pedidos y cambiar el estado (pendiente, pagado, en producción, enviado, completado, cancelado)
- Subir, editar y ocultar productos de la galería
- Cargar fotos de producto

Sin Supabase, pedidos y productos se guardan en `data/store.json`. Con Supabase, `SUPABASE_SERVICE_ROLE_KEY` es obligatoria para el admin (catálogo, estados y Storage). Si el proyecto ya existía, vuelve a ejecutar `supabase/schema.sql` para sumar Storage y `image_url`.
