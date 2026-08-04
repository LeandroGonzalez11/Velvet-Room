// fix-images.mjs
//
// Script de UNA SOLA VEZ para subir las fotos correctas a cada producto, directo a Supabase.
// No usa el panel ni ningun ZIP dentro de la web. Corre en tu compu con Node.
//
// ----------------------------------------------------------------------------------
// PASO 1: Conseguir las credenciales (2 minutos)
//   1. Entra a supabase.com -> tu proyecto -> Settings (icono de tuerca) -> API
//   2. Copia "Project URL"                    -> pegalo abajo en SUPABASE_URL
//   3. Copia "service_role" key (la secreta,   -> pegalo abajo en SUPABASE_SERVICE_KEY
//      NO la "anon public") - esta clave nunca se sube a GitHub, es solo para correr
//      este script una vez en tu compu.
//
// PASO 2: Poner las 52 fotos originales en una carpeta
//   Descomprimi tu ZIP original (drive-download-...zip) en una carpeta, por ejemplo:
//   C:\Users\PC\Documents\fotos-originales
//   Pegala abajo en IMAGES_FOLDER (con doble backslash \\ o barra normal /).
//
// PASO 3: Instalar la unica dependencia que hace falta (una vez)
//   npm install @supabase/supabase-js
//
// PASO 4: Correrlo
//   node fix-images.mjs
//
// Es seguro correrlo mas de una vez: si un producto ya tiene la foto correcta, la
// vuelve a poner sin romper nada (solo reemplaza la imagen de ESE producto).
// ----------------------------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const SUPABASE_URL = "https://jwhvihcdfkwxhmbaxsld.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3aHZpaGNkZmt3eGhtYmF4c2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTAwMTg4NiwiZXhwIjoyMTAwNTc3ODg2fQ.PTTlxCEZ8WOdc02G0m-ktkhj70aRDqfFiw_98W64YBY";
const IMAGES_FOLDER = "C:\\Users\\PC\\Desktop\\Productos tienda";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// namePrefix: el comienzo del nombre tal cual esta en tu base (uso ILIKE 'prefijo%'
// asi no importa si el nombre completo tiene algo mas despues).
// file: el nombre del archivo de foto dentro de tu carpeta IMAGES_FOLDER.
// occurrence: si hay 2 productos con el mismo nombre, 1 = el mas viejo (primero creado), 2 = el mas nuevo.
const plan = [
  { namePrefix: "Gel lubricante 50g", file: "0998ede1-0812-4569-8ab2-1c19eb4dbcee.png", occurrence: 1 },
  { namePrefix: "Gel lubricante 50g", file: "0998ede1-0812-4569-8ab2-1c19eb4dbcee.png", occurrence: 2 },
  { namePrefix: "Gel lubricante 18g", file: "0998ede1-0812-4569-8ab2-1c19eb4dbcee.png", occurrence: 1 },
  { namePrefix: "Gel excitante 18g", file: "0fe082fa-c783-41f3-ac75-342a294f4b6a.png", occurrence: 1 },
  { namePrefix: "Mordaza tipo bast", file: "1ab3f020-bfef-4f9e-8a27-ca3f57267962.png", occurrence: 1 },
  { namePrefix: "Gel t\u00e9rmico comestible 15ml", file: "1ba1efaf-465f-439a-b2d4-b522cf891bfd.png", occurrence: 1 },
  { namePrefix: "Kit esposas y antifaz de peluche", file: "29988a55-adeb-42dc-824b-f8596f49075b.png", occurrence: 1 },
  { namePrefix: "Esposas para manos y pies", file: "2d04b664-c183-4b14-8a9f-b1ca38fd6128.png", occurrence: 1 },
  { namePrefix: "Collar con correa", file: "3c512b36-5d45-43a8-88e1-9caf45855b51.png", occurrence: 1 },
  { namePrefix: "Plug anal con piedra decorativa", file: "13016f34-5888-4d07-96c8-78060d38bb1a.png", occurrence: 1 },
  { namePrefix: "Estimulador de cl\u00edtoris recargable", file: "ChatGPT Image 19 jul 2026, 22_07_09.png", occurrence: 1 },
  { namePrefix: "Vibradror con 7 modos", file: "ChatGPT Image 19 jul 2026, 22_07_09.png", occurrence: 1 },
  { namePrefix: "Plug Talle M", file: "722cfd6c-4565-4b8b-9266-6d5e76a3f0c3.png", occurrence: 1 },
  { namePrefix: "Plug anal dorado con colgante", file: "722cfd6c-4565-4b8b-9266-6d5e76a3f0c3.png", occurrence: 1 },
  { namePrefix: "Plug anal talla P", file: "9e2f6901-7005-4f69-bdfe-3b24454212d5.png", occurrence: 1 },
  { namePrefix: "Plug anal talla G", file: "c0017d24-02e8-438b-a180-cd7c70574cfa.png", occurrence: 1 },
  { namePrefix: "Esposas met\u00e1licas", file: "b10b15f9-a5f6-4353-88c8-ff05d639b2b1.png", occurrence: 1 },
  { namePrefix: "Varita vibradora recargable", file: "84d1e84c-dba9-44fc-887a-f1172ca4fe42.png", occurrence: 1 },
  { namePrefix: "Mini c\u00e1psula vibradora", file: "4cfe5679-7f50-498a-b6f9-bad14eb7e853.png", occurrence: 1 },
  { namePrefix: "M\u00e1scara de mujer gato", file: "d13cda76-b1dc-40ea-80d7-b89f41a94bed.png", occurrence: 1 },
  { namePrefix: "M\u00e1scara antifaz", file: "d2011a56-b62f-4a4b-9f37-999cccca72e7.png", occurrence: 1 },
  { namePrefix: "Vibrador punto G forma delf", file: "ChatGPT Image 9 jul 2026, 15_17_19.png", occurrence: 1 },
  { namePrefix: "Estimulador de cl\u00edtoris en forma de rosa", file: "ChatGPT Image 9 jul 2026, 15_09_53.png", occurrence: 1 },
  { namePrefix: "Excitante femenino", file: "ChatGPT Image 7 jul 2026, 22_31_09.png", occurrence: 1 },
  { namePrefix: "Gel vibrador l\u00edquido", file: "ChatGPT Image 9 jul 2026, 01_21_33.png", occurrence: 1 },
  { namePrefix: "Miel estimulante", file: "ChatGPT Image 7 jul 2026, 22_26_30.png", occurrence: 1 },
  { namePrefix: "Gotas afrodis", file: "dd2dcdda-2051-4985-8bf8-5fcb61436e46.png", occurrence: 1 },
  { namePrefix: "Ducha higi\u00e9nica unisex 89ml", file: "ChatGPT Image 9 jul 2026, 15_56_32.png", occurrence: 1 },
  { namePrefix: "Ducha higi\u00e9nica 230ml", file: "ChatGPT Image 9 jul 2026, 15_56_32.png", occurrence: 1 },
  { namePrefix: "Calz\u00f3n vibrador con 10 velocidades", file: "WhatsApp Image 2026-07-07 at 01.25.56 (1).jpeg", occurrence: 1 },
  { namePrefix: "Calz\u00f3n vibrador con 10 modos", file: "WhatsApp Image 2026-07-07 at 01.25.56.jpeg", occurrence: 1 },
  { namePrefix: "Calz\u00f3n vibrador", file: "e01bc5bb-d2ae-4c6b-8f23-a8a047cdea39.png", occurrence: 1 },
  { namePrefix: "Dildo eyaculador con ventosa", file: "Screenshot_5.png", occurrence: 1 },
  { namePrefix: "Dildo aromatizado sin vibraci", file: "Screenshot_7.png", occurrence: 1 },
  { namePrefix: "Dildo realista flexible con vibraci", file: "Screenshot_3.png", occurrence: 1 },
  { namePrefix: "Dildo sin vibraci", file: "Screenshot_2.png", occurrence: 1 },
  { namePrefix: "Dildo realista de doble capa", file: "Screenshot_6.png", occurrence: 1 },
  { namePrefix: "Dildo vibrador con escroto", file: "Screenshot_4.png", occurrence: 1 },
  { namePrefix: "Anillo peniano vibrador doble", file: "ChatGPT Image 9 jul 2026, 15_48_43.png", occurrence: 1 },
  { namePrefix: "Anillo peniano vibrador forma mariposa", file: "ChatGPT Image 9 jul 2026, 15_43_54.png", occurrence: 1 },
  { namePrefix: "Estimulador de cl\u00edtoris mariposa", file: "WhatsApp Image 2026-07-07 at 16.13.26.jpeg", occurrence: 1 },
  { namePrefix: "Mini varita vibradora", file: "ChatGPT Image 7 jul 2026, 21_55_10.png", occurrence: 1 },
  { namePrefix: "Gel comestible con brillo", file: "eada6f8d-ad1d-455c-b272-509b5cb0b0ce.png", occurrence: 1 },
  { namePrefix: "Masturbador masculino con forma de v", file: "Screenshot_1.png", occurrence: 1 },
  { namePrefix: "Masturbador masculino con forma de v", file: "d517079b-cc9a-438c-afa3-ce2a4bad7fff.png", occurrence: 2 },
  { namePrefix: "Masturbador masculino con forma de a", file: "ChatGPT Image 9 jul 2026, 15_36_50.png", occurrence: 1 },
];

// Estos productos NO tenian ninguna foto entre las 51 que me pasaste (nunca se genero
// esa card). El script los deja sin tocar - subilos vos a mano desde el panel cuando
// tengas la foto.
const sinFoto = [
  "L\u00e1tigo 50 sombras",
  "Masturbador tipo huevo",
  "Lubricante en sachet 8g",
  "Plug anal escalonado",
  "Plug anal de bolas (6 esferas)",
  "Higienizador de juguetes er\u00f3ticos",
];

async function run() {
  if (SUPABASE_URL.startsWith("PEGA_ACA") || SUPABASE_SERVICE_KEY.startsWith("PEGA_ACA")) {
    console.error("Falta completar SUPABASE_URL y SUPABASE_SERVICE_KEY arriba en el archivo.");
    process.exit(1);
  }

  let ok = 0;
  let fail = 0;

  for (const item of plan) {
    const filePath = path.join(IMAGES_FOLDER, item.file);
    if (!fs.existsSync(filePath)) {
      console.log(`SIN ARCHIVO: no encontre "${item.file}" en la carpeta. Salteando "${item.namePrefix}".`);
      fail++;
      continue;
    }

    const { data: matches, error: findError } = await supabase
      .from("products")
      .select("id, name, created_at")
      .ilike("name", `${item.namePrefix}%`)
      .order("created_at", { ascending: true });

    if (findError) {
      console.log(`ERROR buscando "${item.namePrefix}": ${findError.message}`);
      fail++;
      continue;
    }
    const product = matches?.[item.occurrence - 1];
    if (!product) {
      console.log(`NO ENCONTRADO en la base: "${item.namePrefix}" (ocurrencia ${item.occurrence})`);
      fail++;
      continue;
    }

    const { data: currentImages } = await supabase
      .from("product_images")
      .select("id, storage_path")
      .eq("product_id", product.id);
    if (currentImages?.length) {
      await supabase.from("product_images").delete().eq("product_id", product.id);
      await supabase.storage.from("product-images").remove(currentImages.map((i) => i.storage_path));
    }

    const buffer = fs.readFileSync(filePath);
    const ext = item.file.split(".").pop();
    const storagePath = `${product.id}/principal-${Date.now()}.${ext}`;
    const contentType = ext.toLowerCase() === "png" ? "image/png" : "image/jpeg";

    const upload = await supabase.storage.from("product-images").upload(storagePath, buffer, { contentType, upsert: false });
    if (upload.error) {
      console.log(`ERROR subiendo foto de "${product.name}": ${upload.error.message}`);
      fail++;
      continue;
    }

    const { error: insertError } = await supabase
      .from("product_images")
      .insert({ product_id: product.id, storage_path: storagePath, sort_order: 0 });
    if (insertError) {
      console.log(`ERROR guardando referencia de "${product.name}": ${insertError.message}`);
      fail++;
      continue;
    }

    console.log(`OK: "${product.name}" <- ${item.file}`);
    ok++;
  }

  console.log("\n----------------------------------------");
  console.log(`Listo. ${ok} imagenes subidas, ${fail} con problema.`);
  console.log("\nEstos productos NO tenian foto disponible (subilos a mano en el panel):");
  for (const n of sinFoto) console.log(` - ${n}`);
}

run();
