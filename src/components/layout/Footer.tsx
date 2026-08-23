import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  footerCompany,
  footerServices,
  footerSolutions,
  site,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-deep text-[#d6dde8]">
      <div
        className="pointer-events-none absolute inset-y-0 start-[12%] w-px bg-white/10"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src={site.logo}
              alt={site.name}
              width={36}
              height={36}
              className="size-9 object-cover"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
              }}
            />
            <span className="brand-monument text-lg text-white">
              Axyno<span className="text-accent-bright">AI</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/55">
            طراحی و پیاده‌سازی راهکارهای هوش مصنوعی روی محور واقعی کسب‌وکار شما.
          </p>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Services
          </h3>
          <ul className="space-y-2.5">
            {footerServices.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Solutions
          </h3>
          <ul className="mb-6 space-y-2.5">
            {footerSolutions.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Company
          </h3>
          <ul className="space-y-2.5">
            {footerCompany.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition hover:text-accent-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono-signal mb-4 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Contact
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
        <p className="mx-auto max-w-7xl px-4 py-5 text-center font-mono-signal text-[10px] tracking-wider text-white/35 sm:px-6 lg:px-8">
          © {site.name} · ALL RIGHTS RESERVED · {site.nameFa}
        </p>
      </div>
    </footer>
  );
}
