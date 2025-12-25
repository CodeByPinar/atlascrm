"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const items = useMemo<NavItem[]>(
    () => [
      { label: "Ana Sayfa", href: "/" },
      { label: "Genel Bakış", href: "/#overview" },
      { label: "Önizleme", href: "/#preview" },
      { label: "Roller", href: "/#roles" },
      { label: "Güvenlik", href: "/#security" },
      { label: "Fiyatlandırma", href: "/#pricing" },
      { label: "Uygulama", href: "/app" },
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {!logoFailed ? (
            <div className="relative h-8 w-36">
              <Image
                src="/atlascrm-logo.svg"
                alt="AtlasCRM"
                fill
                priority
                className="object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-atlas-blue text-sm font-semibold text-white">
                A
              </div>
              <div className="text-sm font-semibold text-atlas-blue">AtlasCRM</div>
            </div>
          )}
        </Link>

        <nav aria-label="Birincil" className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 text-sm text-atlas-steel hover:bg-atlas-cloud hover:text-atlas-blue focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm md:inline-flex"
          >
            Giriş Yap
          </Link>
          <a
            href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
            className="hidden rounded-md bg-atlas-teal px-3 py-1.5 text-sm font-medium text-white md:inline-flex"
          >
            Demo İste
          </a>

          <button
            type="button"
            className="inline-flex items-center rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Menü
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/10 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="grid gap-2">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-atlas-blue hover:bg-atlas-cloud focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-center text-sm"
                  onClick={() => setOpen(false)}
                >
                  Giriş Yap
                </Link>
                <a
                  href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
                  className="flex-1 rounded-md bg-atlas-teal px-3 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setOpen(false)}
                >
                  Demo İste
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
