import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-4 pt-28 pb-20">
      <p className="font-mono-signal mb-3 text-[10px] tracking-[0.22em] text-accent">
        ERR · 404
      </p>
      <h1 className="font-display text-3xl font-extrabold">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("subtitle")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">{t("home")}</Button>
        <Button href="/contact" variant="secondary">
          {t("contact")}
        </Button>
      </div>
    </div>
  );
}
