import Link from "next/link";
import { FooterInnLine } from "@/components/footer-inn-line";
import { SITE } from "@/lib/site";

const legal = [
  { href: "/requisites", label: "Реквизиты и ИНН" },
  { href: "/offer", label: "Публичная оферта" },
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/consent", label: "Согласие на обработку данных" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{SITE.name}</p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Онлайн-сервис цифрового доступа к защищённой сетевой инфраструктуре. Помогаем усилить
              безопасность соединения и защиту данных при работе в интернете.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              <a className="font-medium text-teal-700 hover:underline" href={`tel:${SITE.phone}`}>
                {SITE.phoneDisplay}
              </a>
              <span className="mx-2 text-slate-300">·</span>
              <a
                className="font-medium text-teal-700 hover:underline"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </p>
            <FooterInnLine />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Документы
            </p>
            <ul className="mt-3 space-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-teal-700 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}. Информация на сайте не является
          публичной офертой в смысле законодательства о защите прав потребителей до
          момента акцепта по правилам договора-оферты.
        </p>
      </div>
    </footer>
  );
}
