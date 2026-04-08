"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Показывает ИНН из серверного env в подвале после гидратации (актуально для Docker без пересборки). */
export function FooterInnLine() {
  const [inn, setInn] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/requisites/inn")
      .then((r) => r.json() as Promise<{ inn: string | null }>)
      .then((d) => setInn(d.inn))
      .catch(() => setInn(null));
  }, []);

  if (inn === undefined || inn === null) return null;

  return (
    <p className="mt-2 text-sm text-slate-600">
      ИНН: <span className="font-medium text-slate-800">{inn}</span>
      <span className="mx-1.5 text-slate-300">·</span>
      <Link href="/requisites" className="font-medium text-teal-700 hover:underline">
        страница реквизитов
      </Link>
    </p>
  );
}
