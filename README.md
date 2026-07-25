# Velvet Room

Catálogo premium orientado a ventas por WhatsApp, construido con Next.js 15, React 19, TypeScript y Tailwind CSS.

## Inicio

1. Copiá `.env.example` como `.env.local` y completá el número de WhatsApp.
2. Ejecutá `npm install`.
3. Ejecutá `npm run dev`.

## Supabase

1. Creá un proyecto en Supabase.
2. Ejecutá [`supabase/schema.sql`](./supabase/schema.sql) en el editor SQL.
3. Completá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Reemplazá `YOUR_EMAIL` en la política comentada por el correo del único administrador.

La interfaz de administración se encuentra en `/admin`. La maqueta ya contempla productos, stock e importación ZIP; el siguiente paso de integración es conectar sus acciones a las tablas y al bucket `product-images`.

## Personalización rápida

- Productos iniciales: `src/lib/products.ts`
- Número de WhatsApp: `.env.local`
- Identidad visual: `src/app/globals.css` y `tailwind.config.ts`
