import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-300",
    variant === "primary" &&
      "bg-accent text-btn-fg hover:bg-accent-bright [clip-path:polygon(0_0,100%_0,100%_70%,92%_100%,0_100%)]",
    variant === "secondary" &&
      "border border-card-border bg-card/80 text-foreground hover:border-accent/50 hover:text-accent",
    variant === "ghost" && "text-muted hover:text-accent",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
