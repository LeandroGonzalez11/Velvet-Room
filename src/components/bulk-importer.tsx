"use client";

import { useState } from "react";
import JSZip from "jszip";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ImagePlan = { name: string; file: string; occurrence: number };

// Reescrito desde cero: matchea por NOMBRE de producto (occurrence = 1ra, 2da... aparicion
// de ese nombre, ordenadas por fecha de creacion) en vez de por "code". El campo "code"
// quedo en null para todos los productos por un bug de la version anterior de esta
// herramienta, asi que ya no se usa para nada en este archivo.
const imageMatchPlan: ImagePlan[] = [
  { name: "Gel lubricante", file: "0998ede1-0812-4569-8ab2-1c19eb4dbcee.png", occurrence: 1 },
  { name: "Gel excitante", file: "0fe082fa-c783-41f3-ac75-342a294f4b6a.png", occurrence: 1 },
  { name: "Púrpura Rose", file: "13016f34-5888-4d07-96c8-78060d38bb1a.png", occurrence: 1 },
  { name: "Mordaza", file: "1ab3f020-bfef-4f9e-8a27-ca3f57267962.png", occurrence: 1 },
  { name: "Juego del placer", file: "1ba1efaf-465f-439a-b2d4-b522cf891bfd.png", occurrence: 1 },
  { name: "Esposas de peluche", file: "29988a55-adeb-42dc-824b-f8596f49075b.png", occurrence: 1 },
  { name: "Esposas para manos y pies", file: "2d04b664-c183-4b14-8a9f-b1ca38fd6128.png", occurrence: 1 },
  { name: "Collar con correa", file: "3c512b36-5d45-43a8-88e1-9caf45855b51.png", occurrence: 1 },
  { name: "Plug anal de bolas", file: "44fe0d43-7ac5-470f-aa5c-4fcf1159febe.png", occurrence: 1 },
  { name: "Separador de pies", file: "4c209a1f-0511-43d7-893c-a7a9b3e216fb.png", occurrence: 1 },
  { name: "Cápsula vibradora", file: "4cfe5679-7f50-498a-b6f9-bad14eb7e853.png", occurrence: 1 },
  { name: "Plug dorado", file: "722cfd6c-4565-4b8b-9266-6d5e76a3f0c3.png", occurrence: 1 },
  { name: "Varita vibradora", file: "84d1e84c-dba9-44fc-887a-f1172ca4fe42.png", occurrence: 1 },
  { name: "Plug Rojo", file: "9e2f6901-7005-4f69-bdfe-3b24454212d5.png", occurrence: 1 },
  { name: "Esposas metálicas", file: "b10b15f9-a5f6-4353-88c8-ff05d639b2b1.png", occurrence: 1 },
  { name: "Plug anal talla G", file: "c0017d24-02e8-438b-a180-cd7c70574cfa.png", occurrence: 1 },
  { name: "Velas de corazón", file: "ChatGPT Image 19 jul 2026, 21_46_05.png", occurrence: 1 },
  { name: "Pétalos perfumados", file: "ChatGPT Image 19 jul 2026, 21_49_27.png", occurrence: 1 },
  { name: "Vibrador recargable", file: "ChatGPT Image 19 jul 2026, 22_07_09.png", occurrence: 1 },
  { name: "Varita mini", file: "ChatGPT Image 7 jul 2026, 21_55_10.png", occurrence: 1 },
  { name: "Gel íntimo", file: "ChatGPT Image 7 jul 2026, 22_19_34.png", occurrence: 1 },
  { name: "Mielcita", file: "ChatGPT Image 7 jul 2026, 22_26_30.png", occurrence: 1 },
  { name: "Excitante femenino", file: "ChatGPT Image 7 jul 2026, 22_31_09.png", occurrence: 1 },
  { name: "Power Shock", file: "ChatGPT Image 9 jul 2026, 01_21_33.png", occurrence: 1 },
  { name: "Colgante vaginal", file: "ChatGPT Image 9 jul 2026, 01_29_49.png", occurrence: 1 },
  { name: "Energizante Touro", file: "ChatGPT Image 9 jul 2026, 01_41_46.png", occurrence: 1 },
  { name: "Estimulador Rosa", file: "ChatGPT Image 9 jul 2026, 15_09_53.png", occurrence: 1 },
  { name: "Estimulador Delfín", file: "ChatGPT Image 9 jul 2026, 15_17_19.png", occurrence: 1 },
  { name: "Masturbador masculino", file: "ChatGPT Image 9 jul 2026, 15_36_50.png", occurrence: 1 },
  { name: "Anillo peniano doble", file: "ChatGPT Image 9 jul 2026, 15_43_54.png", occurrence: 1 },
  { name: "Anillo peniano vibrador", file: "ChatGPT Image 9 jul 2026, 15_48_43.png", occurrence: 1 },
  { name: "Ducha higiénica", file: "ChatGPT Image 9 jul 2026, 15_56_32.png", occurrence: 1 },
  { name: "Máscara antifaz", file: "d13cda76-b1dc-40ea-80d7-b89f41a94bed.png", occurrence: 1 },
  { name: "Antifaces", file: "d2011a56-b62f-4a4b-9f37-999cccca72e7.png", occurrence: 1 },
  { name: "Masturbador vaginal", file: "d517079b-cc9a-438c-afa3-ce2a4bad7fff.png", occurrence: 1 },
  { name: "Gotas de pasión", file: "dd2dcdda-2051-4985-8bf8-5fcb61436e46.png", occurrence: 1 },
  { name: "Vibrador para parejas", file: "e01bc5bb-d2ae-4c6b-8f23-a8a047cdea39.png", occurrence: 1 },
  { name: "Barra de succión", file: "e540e7f1-dea8-4dfb-aac3-ad6dc9fc4da9.png", occurrence: 1 },
  { name: "Vibrador para parejas", file: "e89f303f-c3ef-4994-a339-39771c45122a.png", occurrence: 2 },
  { name: "Gel comestible", file: "eada6f8d-ad1d-455c-b272-509b5cb0b0ce.png", occurrence: 1 },
  { name: "Energizante Vaca", file: "file_00000000c048720e8aa2225f67fd145e.png", occurrence: 1 },
  { name: "Separador de pies", file: "file_00000000c8ec720e907c6b610cff5479.png", occurrence: 2 },
  { name: "Masturbador con textura", file: "Screenshot_1.png", occurrence: 1 },
  { name: "Dildo realista", file: "Screenshot_2.png", occurrence: 1 },
  { name: "Dildo vibrador", file: "Screenshot_3.png", occurrence: 1 },
  { name: "Dildo vibrador con base", file: "Screenshot_4.png", occurrence: 1 },
  { name: "Dildo eyaculador", file: "Screenshot_5.png", occurrence: 1 },
  { name: "Dildo sin vibración", file: "Screenshot_6.png", occurrence: 1 },
  { name: "Dildo con base", file: "Screenshot_7.png", occurrence: 1 },
  { name: "Bragas vibratorias", file: "WhatsApp Image 2026-07-07 at 01.25.56 (1).jpeg", occurrence: 1 },
  { name: "Bragas vibratorias", file: "WhatsApp Image 2026-07-07 at 01.25.56.jpeg", occurrence: 2 },
  { name: "Mariposa vibradora", file: "WhatsApp Image 2026-07-07 at 16.13.26.jpeg", occurrence: 1 },
];

type ProductRow = { id: string; name: string; created_at: string };

export function BulkImporter() {
  const [zip, setZip] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function repairImages() {
    if (!zip || busy) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    setLog([]);
    setStatus("Preparando las imágenes correctas…");
    try {
      const archive = await JSZip.loadAsync(zip);
      const files = new Map(
        Object.values(archive.files)
          .filter((file) => !file.dir)
          .map((file) => [file.name.split("/").pop() as string, file])
      );

      // Traemos TODOS los productos ordenados por fecha de creacion: esto nos permite
      // resolver nombres duplicados (ej. "Bragas vibratorias" x2) tomando siempre el
      // mismo orden en el que fueron creados originalmente.
      const { data: productsRaw, error } = await supabase
        .from("products")
        .select("id, name, created_at")
        .order("created_at", { ascending: true });
      if (error || !productsRaw) throw new Error("No fue posible leer los productos.");
      const products = productsRaw as ProductRow[];

      // Agrupamos productos por nombre exacto, en orden de creacion.
      const byName = new Map<string, ProductRow[]>();
      for (const p of products) {
        const arr = byName.get(p.name) ?? [];
        arr.push(p);
        byName.set(p.name, arr);
      }

      let repaired = 0;
      const skipped: string[] = [];
      const newLog: string[] = [];

      for (const [index, plan] of imageMatchPlan.entries()) {
        setStatus(`Procesando ${index + 1}/${imageMatchPlan.length}…`);
        const group = byName.get(plan.name);
        const product = group ? group[plan.occurrence - 1] : undefined;
        const source = files.get(plan.file);

        if (!product) {
          skipped.push(plan.name);
          newLog.push(`✗ No se encontró en la base: "${plan.name}" (ocurrencia ${plan.occurrence})`);
          continue;
        }
        if (!source) {
          skipped.push(plan.name);
          newLog.push(`✗ No se encontró la foto "${plan.file}" dentro del ZIP para "${plan.name}"`);
          continue;
        }

        const { data: currentImages } = await supabase
          .from("product_images")
          .select("id, storage_path")
          .eq("product_id", product.id);
        if (currentImages?.length) {
          await supabase.from("product_images").delete().eq("product_id", product.id);
          await supabase.storage.from("product-images").remove(currentImages.map((image) => image.storage_path));
        }

        const blob = await source.async("blob");
        const extension = plan.file.split(".").pop() || "png";
        const storagePath = `${product.id}/principal-${Date.now()}.${extension}`;
        const upload = await supabase.storage
          .from("product-images")
          .upload(storagePath, blob, { contentType: blob.type, upsert: false });
        if (upload.error) {
          skipped.push(plan.name);
          newLog.push(`✗ Error subiendo imagen para "${plan.name}": ${upload.error.message}`);
          continue;
        }
        const { error: imageError } = await supabase
          .from("product_images")
          .insert({ product_id: product.id, storage_path: storagePath, sort_order: 0 });
        if (imageError) {
          skipped.push(plan.name);
          newLog.push(`✗ Error guardando referencia para "${plan.name}": ${imageError.message}`);
          continue;
        }
        repaired++;
      }

      setLog(newLog);
      setStatus(
        skipped.length
          ? `${repaired} imágenes corregidas de ${imageMatchPlan.length}. ${skipped.length} requieren revisión manual (ver detalle abajo).`
          : `${repaired} imágenes corregidas. El catálogo ya está actualizado.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudieron corregir las imágenes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl border-b border-white/10 px-5 py-6 text-white md:px-10">
      <p className="eyebrow">Corrección de catálogo</p>
      <h2 className="mt-1 font-serif text-2xl">Reparar imágenes del ZIP</h2>
      <p className="mt-1 max-w-2xl text-sm text-white/60">
        Reemplaza solamente las fotos equivocadas, matcheando por nombre de producto. Los nombres,
        precios, stock y productos ya publicados no se modifican. Subí el ZIP ORIGINAL del
        proveedor (el de las fotos, no el que arma la web para Netlify).
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input type="file" accept=".zip" onChange={(event) => setZip(event.target.files?.[0] || null)} />
        <button
          disabled={!zip || busy}
          onClick={repairImages}
          className="rounded-full bg-rose px-4 py-2 text-sm disabled:opacity-40"
        >
          {busy ? "Corrigiendo…" : "Corregir imágenes con ZIP"}
        </button>
        <span className="text-sm text-gold">{status}</span>
      </div>
      {log.length > 0 && (
        <ul className="mt-4 max-h-64 overflow-y-auto rounded border border-white/10 p-3 text-xs text-white/70">
          {log.map((line, i) => (
            <li key={i} className="py-0.5">{line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}