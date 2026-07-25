import type { Category, Product } from "@/types/product";

type Seed = [string, Category, number, string];

const inventory: Seed[] = [
  ["Gel lubricante", "Lubricantes", 200, "PB414"], ["Gel excitante", "Lubricantes", 100, "PB537"], ["Púrpura Rose", "Plugs", 0, "VR-003"], ["Mordaza", "BDSM", 290, "MBF113"],
  ["Juego del placer", "Juegos", 70, "VR-005"], ["Esposas de peluche", "BDSM", 450, "KPP40"], ["Esposas para manos y pies", "BDSM", 690, "AMPBF"], ["Collar con correa", "BDSM", 350, "CGR03"],
  ["Plug anal de bolas", "Plugs", 490, "EL006"], ["Separador de pies", "BDSM", 550, "2683"], ["Cápsula vibradora", "Vibradores", 190, "5162"], ["Plug dorado", "Plugs", 0, "269"],
  ["Varita vibradora", "Varitas", 950, "7166"], ["Plug Rojo", "Plugs", 0, "VR-014"], ["Esposas metálicas", "BDSM", 120, "6179"], ["Plug anal talla G", "Plugs", 350, "5847"],
  ["Velas de corazón", "Accesorios", 220, "VL02"], ["Pétalos perfumados", "Accesorios", 590, "HZ394"], ["Vibrador recargable", "Vibradores", 0, "VR-019"], ["Varita mini", "Varitas", 0, "8316"],
  ["Gel íntimo", "Lubricantes", 200, "VR-021"], ["Mielcita", "Lubricantes", 150, "11899"], ["Excitante femenino", "Lubricantes", 230, "4760"], ["Power Shock", "Lubricantes", 290, "6146"],
  ["Colgante vaginal", "Accesorios", 300, "MT040"], ["Energizante Touro", "Accesorios", 90, "5241"], ["Estimulador Rosa", "Vibradores", 790, "7288"], ["Estimulador Delfín", "Vibradores", 150, "5712"],
  ["Masturbador masculino", "Masturbadores", 0, "PK007"], ["Anillo peniano doble", "Accesorios", 120, "AN006"], ["Anillo peniano vibrador", "Accesorios", 80, "AN020"], ["Ducha higiénica", "Cuidado íntimo", 0, "5478"],
  ["Máscara antifaz", "BDSM", 50, "MTP16"], ["Antifaces", "BDSM", 50, "VR-034"], ["Masturbador vaginal", "Masturbadores", 0, "PK006"], ["Gotas de pasión", "Lubricantes", 200, "430"],
  ["Vibrador para parejas", "Vibradores", 0, "VR-037"], ["Barra de succión", "BDSM", 0, "VR-038"], ["Vibrador para parejas", "Vibradores", 0, "VR-039"], ["Gel comestible", "Lubricantes", 120, "PB218"],
  ["Energizante Vaca", "Accesorios", 90, "5239"], ["Separador de pies", "BDSM", 550, "VR-042"], ["Masturbador con textura", "Masturbadores", 0, "PK100-CIR"], ["Dildo realista", "Dildos", 1700, "9375"],
  ["Dildo vibrador", "Dildos", 9450, "PC026"], ["Dildo vibrador con base", "Dildos", 0, "VR-046"], ["Dildo eyaculador", "Dildos", 790, "ADA023E"], ["Dildo sin vibración", "Dildos", 590, "PA016"],
  ["Dildo con base", "Dildos", 0, "VR-049"], ["Bragas vibratorias", "Lencería", 0, "941"], ["Bragas vibratorias", "Lencería", 0, "6554"], ["Mariposa vibradora", "Vibradores", 80, "AN020"],
];

export const products: Product[] = inventory.map(([name, category, price, code], index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `import-${number}`,
    slug: `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${number}`,
    name,
    description: `Una pieza de nuestra selección Velvet Room. Consultanos por WhatsApp para conocer más detalles y disponibilidad.`,
    price,
    category,
    images: [`/products/producto-${number}.${index >= 49 ? "jpeg" : "png"}`],
    stock: 1,
    code,
    isNew: index < 4,
    featured: [2, 10, 12, 18, 26, 43].includes(index),
  };
});

export const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
