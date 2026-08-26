import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import {
  footerCompanyHrefs,
  footerServiceHrefs,
  footerSolutionKeys,
  site,
} from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tMeta = await getTranslations("Meta");

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-deep text-[#d6dde8]">
      <div
        className="pointer-events-none absolute inset-y-0 start-[12%] w-px bg-white/10"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl min-w-0 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2 sm:gap-3">
            <LogoMark size="md" />
            <span className="brand-monument truncate text-sm text-white sm:text-lg">
              Axyno<span className="text-accent-bright">AI</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/55">{t("blurb")}</p>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {t("services")}
          </h3>
          <ul className="space-y-2.5">
            {footerServiceHrefs.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {t(`serviceLabels.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {t("solutions")}
          </h3>
          <ul className="mb-6 space-y-2.5">
            {footerSolutionKeys.map((key) => (
              <li key={key}>
                <Link
                  href="/solutions"
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {t(`solutionLabels.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {t("company")}
          </h3>
          <ul className="space-y-2.5">
            {footerCompanyHrefs.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {t("contact")}
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-accent-bright"
                dir="ltr"
              >
                <Phone className="size-4" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-accent-bright"
                dir="ltr"
              >
                <Mail className="size-4" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center font-mono-signal text-[9px] tracking-wider break-words text-white/35 sm:px-6 sm:text-[10px] lg:px-8">
          © {site.name} · {t("rights")} · {tMeta("nameFa")}
        </p>
      </div>
    </footer>
  );
}
