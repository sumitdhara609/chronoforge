type PremiumButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function PremiumButton({
  href,
  children,
  variant = "primary",
}: PremiumButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.18)] hover:bg-slate-200 hover:shadow-[0_0_55px_rgba(255,255,255,0.25)]"
      : "border border-white/10 bg-white/10 text-white hover:bg-white/15";

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 ${variantClass}`}
    >
      <span>{children}</span>
      <span className="transition duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}