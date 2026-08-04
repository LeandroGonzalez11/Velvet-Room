"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ImageOff, LoaderCircle, Package, Pencil, Plus, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type KitRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  storage_path: string | null;
  active: boolean;
  kit_products: { product_id: string }[];
};

type ProductOption = { id: string; name: string; price: number };

const blank = { name: "", price: "", compareAtPrice: "", description: "", active: true };

export function KitsAdmin({ products }: { products: ProductOption[] }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [kits, setKits] = useState<KitRow[]>([]);
  const [selected, setSelected] = useState<KitRow | null>(null);
  const [form, setForm] = useState(blank);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [productFilter, setProductFilter] = useState("");

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("kits")
      .select("id,name,slug,description,price,compare_at_price,storage_path,active,kit_products(product_id)")
      .order("created_at", { ascending: false });
    setKits((data || []) as KitRow[]);
  }

  useEffect(() => { load(); }, [supabase]);

  function imageUrl(path: string) {
    return supabase!.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  function startEdit(kit?: KitRow) {
    setSelected(kit || null);
    setForm(
      kit
        ? {
            name: kit.name,
            price: String(kit.price),
            compareAtPrice: kit.compare_at_price ? String(kit.compare_at_price) : "",
            description: kit.description || "",
            active: kit.active,
          }
        : blank
    );
    setSelectedProductIds(kit ? kit.kit_products.map(item => item.product_id) : []);
    setFile(null);
    setPreview(kit?.storage_path ? imageUrl(kit.storage_path) : null);
    setMessage("");
    setProductFilter("");
  }

  function onFileChange(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : selected?.storage_path ? imageUrl(selected.storage_path) : null);
  }

  function toggleProduct(id: string) {
    setSelectedProductIds(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setMessage("");
    const slug = form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const record = {
      name: form.name,
      ...(selected ? {} : { slug: `${slug}-${Date.now().toString().slice(-5)}` }),
      description: form.description || null,
      price: Number(form.price),
      compare_at_price: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      active: form.active,
    };

    const result = selected
      ? await supabase.from("kits").update(record).eq("id", selected.id).select().single()
      : await supabase.from("kits").insert(record).select().single();

    if (result.error || !result.data) {
      setSaving(false);
      return setMessage(result.error?.message || "No se pudo guardar el kit.");
    }
    const kitId = result.data.id as string;

    if (file) {
      if (selected?.storage_path) {
        await supabase.storage.from("product-images").remove([selected.storage_path]);
      }
      const ext = file.name.split(".").pop();
      const path = `kits/${kitId}/${Date.now()}.${ext}`;
      const uploaded = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (uploaded.error) {
        setSaving(false);
        return setMessage(`Kit guardado, pero la imagen no se pudo subir: ${uploaded.error.message}`);
      }
      await supabase.from("kits").update({ storage_path: path }).eq("id", kitId);
    }

    await supabase.from("kit_products").delete().eq("kit_id", kitId);
    if (selectedProductIds.length) {
      await supabase.from("kit_products").insert(selectedProductIds.map(product_id => ({ kit_id: kitId, product_id })));
    }

    setSaving(false);
    setMessage("Kit publicado correctamente.");
    startEdit();
    load();
  }

  async function remove(kit: KitRow) {
    if (!supabase || !confirm(`¿Eliminar el kit “${kit.name}”?`)) return;
    if (kit.storage_path) await supabase.storage.from("product-images").remove([kit.storage_path]);
    const { error } = await supabase.from("kits").delete().eq("id", kit.id);
    if (error) return setMessage(error.message);
    if (selected?.id === kit.id) startEdit();
    load();
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productFilter.toLowerCase()));
  const sumSelected = products.filter(p => selectedProductIds.includes(p.id)).reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Combos</p>
            <h2 className="mt-2 font-display text-4xl">Kits</h2>
            <p className="mt-1 text-sm text-white/45">Combiná productos existentes en un pack con precio especial.</p>
          </div>
          <button onClick={() => startEdit()} className="flex items-center gap-2 rounded-full bg-rose px-4 py-2.5 text-sm">
            <Plus size={16} /> Nuevo kit
          </button>
        </div>

        <div className="mt-6 overflow-x-auto border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="w-16 p-4"></th>
                <th>Kit</th>
                <th>Incluye</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {kits.map(kit => (
                <tr className="border-b border-white/5" key={kit.id}>
                  <td className="p-3">
                    {kit.storage_path ? (
                      <img src={imageUrl(kit.storage_path)} alt="" className="h-12 w-12 rounded-md border border-white/10 object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-white/20 text-white/25">
                        <ImageOff size={16} />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    {kit.name}
                    {!kit.active && <span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">oculto</span>}
                  </td>
                  <td className="text-white/50">{kit.kit_products.length} producto{kit.kit_products.length !== 1 ? "s" : ""}</td>
                  <td>
                    $ {Number(kit.price).toLocaleString("es-UY")}
                    {kit.compare_at_price && <span className="ml-1 text-xs text-white/35 line-through">$ {Number(kit.compare_at_price).toLocaleString("es-UY")}</span>}
                  </td>
                  <td className="flex gap-3 py-4">
                    <button onClick={() => startEdit(kit)} className="text-gold"><Pencil size={16} /></button>
                    <button onClick={() => remove(kit)} className="text-rose"><X size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!kits.length && <p className="p-10 text-center text-sm text-white/45">Todavía no armaste ningún kit.</p>}
        </div>
      </section>

      <aside className="rounded-2xl border border-gold/25 bg-[#171717] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">{selected ? "Editar kit" : "Nuevo kit"}</p>
            <h2 className="mt-1 font-display text-3xl">{selected ? selected.name : "Combo"}</h2>
          </div>
          {selected && <button onClick={() => startEdit()}><X size={18} /></button>}
        </div>

        <div className="mt-5">
          {preview ? (
            <img src={preview} alt="" className="aspect-square w-full rounded-xl border border-white/10 object-cover" />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-white/30">
              <Package size={28} />
              <span className="text-xs">Sin foto del kit todavía</span>
            </div>
          )}
          <label className="mt-2 block text-xs text-white/55">
            Foto del kit (el collage o la que prefieras)
            <input type="file" accept="image/*" onChange={e => onFileChange(e.target.files?.[0] || null)} className="mt-1 block w-full text-xs" />
          </label>
        </div>

        <form onSubmit={save} className="mt-5 space-y-4">
          <label className="block text-sm text-white/75">
            Nombre del kit
            <input value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm outline-none" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-white/75">
              Precio del kit
              <input type="number" min="0" value={form.price} required onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="block text-sm text-white/75">
              Precio tachado (opcional)
              <input type="number" min="0" value={form.compareAtPrice} onChange={e => setForm({ ...form, compareAtPrice: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>
          {selectedProductIds.length > 0 && (
            <p className="text-xs text-white/40">Suma de los productos elegidos: $ {sumSelected.toLocaleString("es-UY")}</p>
          )}
          <label className="block text-sm text-white/75">
            Descripción (opcional)
            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm outline-none" />
          </label>

          <div>
            <p className="text-sm text-white/75">Productos incluidos ({selectedProductIds.length} elegidos)</p>
            <input
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              placeholder="Buscar producto…"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs outline-none"
            />
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-2">
              {filteredProducts.map(product => (
                <label key={product.id} className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs hover:bg-white/5">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={() => toggleProduct(product.id)} />
                    {product.name}
                  </span>
                  <span className="text-white/40">$ {product.price.toLocaleString("es-UY")}</span>
                </label>
              ))}
              {!filteredProducts.length && <p className="p-2 text-center text-xs text-white/35">Sin resultados</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Publicar en la tienda
          </label>

          {message && (
            <p className={`flex gap-2 text-sm ${message.includes("correctamente") ? "text-gold" : "text-rose"}`}>
              {message.includes("correctamente") ? <Check size={16} /> : <AlertCircle size={16} />}
              {message}
            </p>
          )}

          <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-5 py-3 text-sm font-semibold disabled:opacity-50">
            {saving ? <LoaderCircle className="animate-spin" size={17} /> : "Guardar kit"}
          </button>
        </form>
      </aside>
    </div>
  );
}
