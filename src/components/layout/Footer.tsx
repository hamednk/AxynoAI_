import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import {
  footerCompanyHrefs,
  footerServiceHrefs,
  footerSolutionKeys,
  site,
} from "@/lib/site";

const linkClass =
  "inline-flex min-h-8 items-center text-sm text-white/55 transition hover:text-accent-bright";
const headingClass =
  "font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tMeta = await getTranslations("Meta");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-deep text-[#d6dde8]">
      <div className="aurora opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3">
            <LogoMark size="md" />
            <span className="brand-monument truncate text-lg text-white sm:text-2xl">
              Axyno<span className="text-accent-bright">AI</span>
            </span>
          </Link>
          <Link
            href="/contact"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-accent-bright hover:bg-white/5"
          >
            {tNav("consultFull")}
            <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:gap-10">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <p className="max-w-xs text-sm leading-7 text-white/55">{t("blurb")}</p>
            <ul className="space-y-2">
              <li>
                <a href={`tel:${site.phone}`} className={`${linkClass} gap-2`} dir="ltr">
                  <Phone className="size-4" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={`${linkClass} gap-2`} dir="ltr">
                  <Mail className="size-4" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>{t("services")}</h3>
            <ul className="space-y-1.5">
              {footerServiceHrefs.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {t(`serviceLabels.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>{t("solutions")}</h3>
            <ul className="space-y-1.5">
              {footerSolutionKeys.map((key) => (
                <li key={key}>
                  <Link href="/solutions" className={linkClass}>
                    {t(`solutionLabels.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>{t("company")}</h3>
            <ul className="space-y-1.5">
              {footerCompanyHrefs.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="brand-monument pointer-events-none select-none overflow-hidden text-center text-[clamp(3rem,15vw,11rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
          aria-hidden
        >
          AXYNOAI
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 pb-24 text-center font-mono-signal text-[10px] tracking-wider break-words text-white/35 sm:px-6 sm:pb-5 lg:px-8">
          © {year} {site.name} · {t("rights")} · {tMeta("nameFa")}
        </p>
      </div>
    </footer>
  );
}
