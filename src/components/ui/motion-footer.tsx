import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/base/logo";
import { RevealMask } from "@/components/pages/landing/reveal-mask";

const FOOTER_LINKS = [
  {
    title: "المنصة",
    links: [
      { label: "كيف تعمل المنصة", href: "#how-it-works" },
      { label: "المميزات", href: "#features" },
      { label: "لمن جود؟", href: "#audience" },
    ],
  },
  {
    title: "الحساب",
    links: [
      { label: "تسجيل الدخول", href: "/login" },
      { label: "تسجيل منظمة جديدة", href: "/register" },
    ],
  },
] as const;

const TICKER_ITEMS = [
  "ابدأ رحلة العطاء",
  "سجّل منظمتك اليوم",
  "شفافية كاملة",
  "تابع أثر تبرعك",
] as const;

function FooterLink({ href, label }: { readonly href: string; readonly label: string }) {
  return (
    <Link
      href={href}
      className="group/link relative inline-block text-sm text-white/70 transition-colors hover:text-white"
    >
      {label}
      <span className="absolute -bottom-0.5 end-0 h-px w-0 bg-white transition-all duration-300 group-hover/link:w-full" />
    </Link>
  );
}

export function CinematicFooter() {
  const currentYear = new Date().getFullYear();
  const tickerUnit = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];
  const tickerLoop = [...tickerUnit, ...tickerUnit];

  return (
    <footer className="sticky bottom-0 z-0 -mt-6 overflow-hidden bg-primary pt-20 text-primary-foreground sm:-mt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.12)_0%,transparent_60%)]" />

      <div className="group relative overflow-hidden border-y border-white/15 bg-white/10 py-3">
        <div
          style={{ animationDuration: "26s" }}
          className="animate-marquee-left flex w-max gap-8 group-hover:[animation-play-state:paused]"
        >
          {tickerLoop.map((text, index) => (
            <span
              key={`${text}-${index}`}
              className="flex items-center gap-3 text-xs font-semibold text-white/85"
            >
              {text}
              <span className="size-1 rounded-full bg-white/40" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[2fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="size-10" imageClassName="size-10" />
            <span className="text-lg font-bold text-white">جود</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">
            منصة جود لدعم المبادرات الإنسانية والمجتمعية — تربط الجمعيات والمؤسسات
            الخيرية بالمتبرعين بشفافية وثقة كاملة.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold text-white">{group.title}</h4>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold text-white">تواصل معنا</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-white/80" />
              <span dir="ltr">support@joud.org</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-white/80" />
              <span dir="ltr">+966 XX XXX XXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-white/80" />
              <span>المملكة العربية السعودية</span>
            </li>
          </ul>
        </div>
      </div>

      <RevealMask className="relative h-[10vw] max-h-32 sm:max-h-40">
        <span className="block bg-gradient-to-b from-white/25 to-transparent bg-clip-text text-center text-[22vw] leading-none font-extrabold text-transparent select-none sm:text-[16vw]">
          جود
        </span>
      </RevealMask>

      <div className="relative border-t border-white/15 py-6">
        <p className="text-center text-xs text-white/60">
          © {currentYear} منصة جود. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
