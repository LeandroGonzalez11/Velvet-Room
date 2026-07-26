"use client";

import { useState } from "react";
import JSZip from "jszip";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ImagePlan = { code: string; file: string; needle?: string };

// This is a one-time repair map for the supplier ZIP. It is not catalogue data:
// products, names and prices continue to come exclusively from Supabase.
const initialImageRepairPlan: ImagePlan[] = [
  ["PB414","0998ede1-0812-4569-8ab2-1c19eb4dbcee.png"],["PB537","0fe082fa-c783-41f3-ac75-342a294f4b6a.png"],["VR-003","13016f34-5888-4d07-96c8-78060d38bb1a.png"],["MBF113","1ab3f020-bfef-4f9e-8a27-ca3f57267962.png"],["VR-005","1ba1efaf-465f-439a-b2d4-b522cf891bfd.png"],["KPP40","29988a55-adeb-42dc-824b-f8596f49075b.png"],["AMPBF","2d04b664-c183-4b14-8a9f-b1ca38fd6128.png"],["CGR03","3c512b36-5d45-43e8-88e1-9caf45855b51.png"],["EL006","44fe0d43-7ac5-470f-aa5c-4fcf1159febe.png"],["2683","4c209a1f-0511-43d7-893c-a7a9b3e216fb.png"],["5162","4cfe5679-7f50-498a-b6f9-bad14eb7e853.png"],["269","722cfd6c-4565-4b8b-9266-6d5e76a3f0c3.png"],["7166","84d1e84c-dba9-44fc-887a-f1172ca4fe42.png"],["VR-014","9e2f6901-7005-4f69-bdfe-3b24454212d5.png"],["6179","b10b15f9-a5f6-4353-88c8-ff05d639b2b1.png"],["5847","c0017d24-02e8-438b-a180-cd7c70574cfa.png"],["VL02","ChatGPT Image 19 jul 2026, 21_46_05.png"],["HZ394","ChatGPT Image 19 jul 2026, 21_49_27.png"],["VR-019","ChatGPT Image 19 jul 2026, 22_07_09.png"],["8316","ChatGPT Image 7 jul 2026, 21_55_10.png"],["VR-021","ChatGPT Image 7 jul 2026, 22_19_34.png"],["11899","ChatGPT Image 7 jul 2026, 22_26_30.png"],["4760","ChatGPT Image 7 jul 2026, 22_31_09.png"],["6146","ChatGPT Image 9 jul 2026, 01_21_33.png"],["MT040","ChatGPT Image 9 jul 2026, 01_29_49.png"],["5241","ChatGPT Image 9 jul 2026, 01_41_46.png"],["7288","ChatGPT Image 9 jul 2026, 15_09_53.png"],["5712","ChatGPT Image 9 jul 2026, 15_17_19.png"],["PK007","ChatGPT Image 9 jul 2026, 15_36_50.png"],["AN006","ChatGPT Image 9 jul 2026, 15_43_54.png"],["AN020","ChatGPT Image 9 jul 2026, 15_48_43.png","anillo"],["5478","ChatGPT Image 9 jul 2026, 15_56_32.png"],["MTP16","d13cda76-b1dc-40ea-80d7-b89f41a94bed.png"],["VR-034","d2011a56-b62f-4a4b-9f37-999cccca72e7.png"],["PK006","d517079b-cc9a-438c-afa3-ce2a4bad7fff.png"],["430","dd2dcdda-2051-4985-8bf8-5fcb61436e46.png"],["VR-037","e01bc5bb-d2ae-4c6b-8f23-a8a047cdea39.png"],["VR-038","e540e7f1-dea8-4dfb-aac3-ad6dc9fc4da9.png"],["VR-039","e89f303f-c3ef-4994-a339-39771c45122a.png"],["PB218","eada6f8d-ad1d-455c-b272-509b5cb0b0ce.png"],["5239","file_00000000c048720e8aa2225f67fd145e.png"],["VR-042","file_00000000c8ec720e907c6b610cff5479.png"],["PK100-CIR","Screenshot_1.png"],["9375","Screenshot_2.png"],["PC026","Screenshot_3.png"],["VR-046","Screenshot_4.png"],["ADA023E","Screenshot_5.png"],["PA016","Screenshot_6.png"],["VR-049","Screenshot_7.png"],["941","WhatsApp Image 2026-07-07 at 01.25.56 (1).jpeg"],["6554","WhatsApp Image 2026-07-07 at 01.25.56.jpeg"],["AN020","WhatsApp Image 2026-07-07 at 16.13.26.jpeg","mariposa"],
].map(([code, file, needle]) => ({ code, file, needle })).map((entry) => entry.code === "CGR03" ? { ...entry, file: "3c512b36-5d45-43a8-88e1-9caf45855b51.png" } : entry);

const normal = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function BulkImporter() {
  const [zip, setZip] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function repairImages() {
    if (!zip || busy) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    setStatus("Preparando las imágenes correctas…");
    try {
      const archive = await JSZip.loadAsync(zip);
      const files = new Map(Object.values(archive.files).filter((file) => !file.dir).map((file) => [file.name.split("/").pop(), file]));
      const { data: products, error } = await supabase.from("products").select("id, code, name");
      if (error || !products) throw new Error("No fue posible leer los productos.");

      let repaired = 0;
      const skipped: string[] = [];
      for (const [index, plan] of initialImageRepairPlan.entries()) {
        const candidates = products.filter((product) => product.code?.includes(plan.code));
        const product = plan.needle ? candidates.find((candidate) => normal(candidate.name).includes(plan.needle!)) : candidates[0];
        const source = files.get(plan.file);
        if (!product || !source) { skipped.push(plan.code); continue; }

        setStatus(`Corrigiendo ${index + 1}/${initialImageRepairPlan.length}…`);
        const { data: currentImages } = await supabase.from("product_images").select("id, storage_path").eq("product_id", product.id);
        if (currentImages?.length) {
          await supabase.from("product_images").delete().eq("product_id", product.id);
          await supabase.storage.from("product-images").remove(currentImages.map((image) => image.storage_path));
        }

        const blob = await source.async("blob");
        const extension = plan.file.split(".").pop() || "png";
        const storagePath = `${product.id}/principal-${Date.now()}.${extension}`;
        const upload = await supabase.storage.from("product-images").upload(storagePath, blob, { contentType: blob.type, upsert: false });
        if (upload.error) { skipped.push(plan.code); continue; }
        const { error: imageError } = await supabase.from("product_images").insert({ product_id: product.id, storage_path: storagePath, sort_order: 0 });
        if (imageError) { skipped.push(plan.code); continue; }
        repaired++;
      }
      await supabase.from("products").update({ code: null }).not("id", "is", null);
      setStatus(skipped.length ? `${repaired} imágenes corregidas. Algunas fotos requieren revisión manual.` : `${repaired} imágenes corregidas. El catálogo ya está actualizado.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudieron corregir las imágenes.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="mx-auto max-w-7xl border-b border-white/10 px-5 py-6 text-white md:px-10"><p className="eyebrow">Corrección de catálogo</p><h2 className="mt-1 font-serif text-2xl">Reparar imágenes del ZIP</h2><p className="mt-1 max-w-2xl text-sm text-white/60">Reemplaza solamente las fotos equivocadas. Los nombres, precios, stock y productos ya publicados no se modifican.</p><div className="mt-3 flex flex-wrap items-center gap-3"><input type="file" accept=".zip" onChange={(event) => setZip(event.target.files?.[0] || null)} /><button disabled={!zip || busy} onClick={repairImages} className="rounded-full bg-rose px-4 py-2 text-sm disabled:opacity-40">{busy ? "Corrigiendo…" : "Corregir imágenes con ZIP"}</button><span className="text-sm text-gold">{status}</span></div></section>;
}
