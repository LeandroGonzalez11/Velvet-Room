import { Package, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Package, text: "Envíos discretos a todo Uruguay" },
  { icon: Sparkles, text: "Tu intimidad, nuestra prioridad" },
  { icon: ShieldCheck, text: "Empaque neutro y sin referencias" },
];

export function AnnouncementBar() {
  return (
    <div className="hidden border-b border-white/10 bg-black md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-5 py-2 text-[11px] tracking-wide text-white/55">
        {items.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-2">
            <Icon size={12} className="text-gold" /> {text}
          </span>
        ))}
      </div>
    </div>
  );
}
