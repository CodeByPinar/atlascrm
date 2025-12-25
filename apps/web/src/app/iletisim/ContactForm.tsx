"use client";

import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

import {
  submitContactAction,
  type ContactActionState,
} from "@/server/actions/contact";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Gönderiliyor…" : "Mesajı gönder"}
    </button>
  );
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "";
  const topic = searchParams.get("topic") ?? "";
  const source = searchParams.get("source") ?? "";
  const mode = searchParams.get("mode") ?? "";

  const isDemoRequest = mode.toLowerCase() === "demo";

  const isAccessRequest =
    source.toLowerCase() === "dashboard" ||
    topic.toLowerCase().includes("yetki") ||
    topic.toLowerCase().includes("erişim") ||
    topic.toLowerCase().includes("modül");

  const suggestedMessage = isAccessRequest
    ? [
        "Merhaba,",
        "",
        "AtlasCRM'de yetki / modül aktivasyonu talep ediyorum.",
        "",
        `Konu: ${topic || "(yetki talebi)"}`,
        "",
        "Talep:",
        "- İstenen rol: (ADMIN / MANAGER)",
        "- Aktive edilecek modüller: (Müşteriler / Görevler / Raporlar)",
        "- Gerekçe: (kısa) ",
        "",
        "Onay için uygun olduğunuz zaman dilimi:",
        "- (örn. 14:00-17:00)",
      ].join("\n")
    : "";

  const suggestedDemoMessage = isDemoRequest
    ? [
        "Merhaba,",
        "",
        "AtlasCRM demo aktivasyonu talep ediyorum.",
        "",
        "Kısa ihtiyaç özeti:",
        "- (örn. satış pipeline, görev takibi, müşteri yönetimi)",
        "",
        "Notlar:",
        "- Demo süresi / kapsamı için bilgi rica ederim.",
      ].join("\n")
    : "";

  const [state, action] = useFormState<ContactActionState, FormData>(
    submitContactAction,
    { status: "idle" },
  );

  if (state.status === "success") {
    const hasActivationCode = Boolean(state.activationCode);

    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-system-success/10 px-3 py-1 text-xs font-medium text-atlas-blue">
          <span className="size-1.5 rounded-full bg-system-success" />
          {hasActivationCode ? "Demo hazır" : "Mesaj alındı"}
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Teşekkürler!</h2>
        <p className="mt-3 text-sm leading-7 text-atlas-steel">
          {hasActivationCode
            ? "Demo aktivasyon kodunuz oluşturuldu. Aşağıdan kopyalayıp giriş ekranında kullanabilirsiniz."
            : "Mesajınızı aldık. En kısa sürede dönüş yapacağız."}
        </p>

        {hasActivationCode ? (
          <div className="mt-5 rounded-2xl border border-black/10 bg-atlas-cloud p-5">
            <div className="text-xs font-medium text-atlas-steel">Aktivasyon kodu</div>
            <div className="mt-2 select-all rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-lg font-semibold tracking-wider text-atlas-blue">
              {state.activationCode}
            </div>
            {state.activationExpiresAt ? (
              <div className="mt-2 text-xs text-atlas-steel">
                Süre: {new Date(state.activationExpiresAt).toLocaleString("tr-TR")} tarihine kadar
              </div>
            ) : null}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={`/login?demoCode=${encodeURIComponent(state.activationCode ?? "")}`}
                className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white"
              >
                Kodu kullan (giriş)
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm"
              >
                Ana sayfaya dön
              </a>
            </div>
          </div>
        ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm"
          >
            Ana sayfaya dön
          </a>
          <a
            href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
            className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white"
          >
            Demo iste
          </a>
        </div>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-black/10 bg-white p-8">
      <h2 className="text-xl font-semibold">Bize yazın</h2>
      <p className="mt-2 text-sm leading-7 text-atlas-steel">
        İhtiyacınızı kısaca anlatın; doğru ekip hızlıca dönüş yapsın.
      </p>

      {isDemoRequest ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-linear-to-br from-system-info/10 via-white to-atlas-teal/10 p-5">
          <div className="text-sm font-semibold text-atlas-blue">Demo Talebi • Aşamalar</div>
          <ol className="mt-3 grid gap-2 text-sm text-atlas-steel">
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">1)</span> Organizasyon + kullanıcı sayısı
            </li>
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">2)</span> Şartlar & KVKK onayı
            </li>
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">3)</span> Kod üretimi → Giriş ekranında kodu kullan
            </li>
          </ol>
          <div className="mt-3 text-xs text-atlas-steel">
            Not: Kod tek kullanımlı ve sınırlı süre geçerlidir.
          </div>
        </div>
      ) : null}

      {isAccessRequest ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-linear-to-br from-system-warning/10 via-white to-atlas-teal/10 p-5">
          <div className="text-sm font-semibold text-atlas-blue">Yetki Talebi • Aşamalar</div>
          <ol className="mt-3 grid gap-2 text-sm text-atlas-steel">
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">1)</span> Rol + modül ihtiyacını netleştir
            </li>
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">2)</span> Kısa gerekçe + kullanım senaryosu ekle
            </li>
            <li className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <span className="font-semibold text-atlas-blue">3)</span> Onay & aktivasyon sonrası panelde butonlar açılır
            </li>
          </ol>
          <div className="mt-3 text-xs text-atlas-steel">
            Bu form dashboard’dan geldiği için alanları otomatik doldurduk; istersen düzenleyebilirsin.
          </div>
        </div>
      ) : null}

      {plan ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-atlas-cloud px-3 py-1 text-xs text-atlas-steel">
          <span className="size-1.5 rounded-full bg-atlas-teal" />
          Seçilen plan: <span className="font-medium text-atlas-blue">{plan}</span>
        </div>
      ) : null}

      {topic ? (
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-atlas-cloud px-3 py-1 text-xs text-atlas-steel">
          <span className="size-1.5 rounded-full bg-atlas-blue" />
          Konu: <span className="font-medium text-atlas-blue">{topic}</span>
        </div>
      ) : null}

      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="topic" value={topic} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="mode" value={mode} />

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="mt-6 grid gap-4">
        {isDemoRequest ? (
          <>
            <div className="grid gap-2">
              <label htmlFor="organizationName" className="text-sm font-medium">
                Organizasyon
              </label>
              <input
                id="organizationName"
                name="organizationName"
                required
                minLength={2}
                maxLength={160}
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
                placeholder="Örn: AtlasCRM Demo"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="userCount" className="text-sm font-medium">
                Kullanıcı sayısı
              </label>
              <input
                id="userCount"
                name="userCount"
                inputMode="numeric"
                required
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
                placeholder="Örn: 5"
              />
            </div>

            <div className="rounded-2xl border border-black/10 bg-atlas-cloud p-4">
              <label className="flex items-start gap-3 text-sm text-atlas-steel">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  required
                  className="mt-1 h-4 w-4 rounded border-black/20 accent-atlas-teal"
                />
                <span>
                  Kullanım şartlarını okudum ve kabul ediyorum.
                </span>
              </label>
              <label className="mt-3 flex items-start gap-3 text-sm text-atlas-steel">
                <input
                  type="checkbox"
                  name="acceptKvkk"
                  required
                  className="mt-1 h-4 w-4 rounded border-black/20 accent-atlas-teal"
                />
                <span>
                  KVKK aydınlatma metnini okudum ve kabul ediyorum.
                </span>
              </label>
            </div>
          </>
        ) : null}

        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Ad Soyad
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
            placeholder="ornek@firma.com"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="company" className="text-sm font-medium">
            Şirket (opsiyonel)
          </label>
          <input
            id="company"
            name="company"
            maxLength={160}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
            placeholder="Şirket adı"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">
            Mesaj
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            className="w-full resize-none rounded-md border border-black/10 bg-white px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-atlas-teal/60"
            placeholder="Kısa bir özet: kaç kullanıcı, hangi süreçler, beklentileriniz…"
            defaultValue={(isDemoRequest ? suggestedDemoMessage : suggestedMessage) || undefined}
          />
        </div>

        {state.status === "error" ? (
          <div
            role="status"
            className="rounded-xl border border-black/10 bg-system-warning/10 px-4 py-3 text-sm text-atlas-blue"
          >
            {state.message}
          </div>
        ) : null}

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
