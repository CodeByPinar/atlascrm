import { LandingHeader } from "@/app/_components/LandingHeader";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-atlas-cloud text-atlas-blue">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-atlas-teal/20 blur-3xl" />
          <div className="absolute -top-24 right-[-140px] h-[420px] w-[420px] rounded-full bg-atlas-blue/25 blur-3xl" />
        </div>

        <LandingHeader />

        <section className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-atlas-steel">
                <span className="size-1.5 rounded-full bg-system-success" />
                Kurumsal görev + CRM çalışma alanı
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                Ekipleri, müşterileri ve icrayı tek yerde birleştirin.
              </h1>
              <p className="mt-5 text-base leading-7 text-atlas-steel">
                AtlasCRM; görev yönetimi, müşteri hunileri ve aktivite takibini
                güvenli ve rol-bilinçli bir çalışma alanında bir araya getirir.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  { label: "Oturum tabanlı giriş", tone: "bg-atlas-blue/10 text-atlas-blue" },
                  { label: "Rol bazlı yetki", tone: "bg-atlas-teal/10 text-atlas-blue" },
                  { label: "Denetime uygun temel", tone: "bg-white text-atlas-blue border border-black/10" },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${pill.tone}`}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
                  className="inline-flex items-center justify-center rounded-md bg-atlas-teal px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
                >
                  Demo planla
                </a>
                <a
                  href="#preview"
                  className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm hover:bg-atlas-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal focus-visible:ring-offset-2"
                >
                  Panel önizlemesini gör
                </a>
              </div>
            </div>

            <div
              id="preview"
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-atlas-teal" />
                  <div className="text-sm font-semibold">Panel önizlemesi</div>
                </div>
                <div className="rounded-full bg-atlas-cloud px-2.5 py-1 text-xs text-atlas-steel">
                  Statik taslak
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-xl border border-black/10 bg-atlas-cloud p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-atlas-steel">Bugün</div>
                    <div className="text-xs text-atlas-steel">Operasyon özeti</div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {[
                      {
                        label: "Yenileme takibi: Global Expansion",
                        status: "Devam ediyor",
                        tone: "bg-system-info/10 text-atlas-blue",
                      },
                      {
                        label: "Onboarding işleri: Northwind",
                        status: "Riskli",
                        tone: "bg-system-warning/10 text-atlas-blue",
                      },
                      {
                        label: "Çeyrek değerlendirmesi: Contoso",
                        status: "Tamamlandı",
                        tone: "bg-system-success/10 text-atlas-blue",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
                      >
                        <div className="text-sm text-atlas-blue">
                          {item.label}
                        </div>
                        <div
                          className={`rounded-full px-2 py-0.5 text-xs ${item.tone}`}
                        >
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Aktif hesap", v: "128", accent: "bg-atlas-teal" },
                    { k: "Açık görev", v: "42", accent: "bg-system-info" },
                    { k: "Riskli", v: "6", accent: "bg-system-warning" },
                  ].map((stat) => (
                    <div
                      key={stat.k}
                      className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-4"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`} />
                      <div className="pl-2">
                        <div className="text-xs text-atlas-steel">{stat.k}</div>
                        <div className="mt-2 text-xl font-semibold text-atlas-blue">
                          {stat.v}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main id="content">
        <section id="overview" className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center rounded-full bg-atlas-teal/10 px-3 py-1 text-xs font-medium text-atlas-blue">
                  İcra
                </div>
                <h2 className="mt-4 text-2xl font-semibold">Görev yönetimi</h2>
                <p className="mt-3 text-sm text-atlas-steel">
                  Net durum, öncelik ve sahiplik ile işleri uçtan uca yönetin.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    "Operasyonel akışlara uygun durum ve öncelik modeli",
                    "Departmanlar arası sahiplik ve iş birliği",
                    "Müşteriye ve sonuca bağlı aktivite görünürlüğü",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 size-2 rounded-full bg-atlas-teal" />
                      <span className="text-atlas-blue">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Öncelik", v: "Net" },
                    { k: "Sahiplik", v: "Açık" },
                    { k: "Durum", v: "Tutarlı" },
                  ].map((pill) => (
                    <div
                      key={pill.k}
                      className="rounded-xl border border-black/10 bg-white p-4"
                    >
                      <div className="text-xs text-atlas-steel">{pill.k}</div>
                      <div className="mt-2 text-sm font-semibold text-atlas-blue">
                        {pill.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="inline-flex items-center rounded-full bg-atlas-blue/10 px-3 py-1 text-xs font-medium text-atlas-blue">
                  İlişkiler
                </div>
                <h2 className="mt-4 text-2xl font-semibold">CRM hunileri</h2>
                <p className="mt-3 text-sm text-atlas-steel">
                  Hesapları ve fırsatları, denetlenebilir ve tutarlı bir müşteri
                  görünümüyle takip edin.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  {[
                    "Aday",
                    "Nitelikli",
                    "Müzakere",
                    "Aktif",
                  ].map((stage) => (
                    <div
                      key={stage}
                      className="rounded-xl border border-black/10 bg-atlas-cloud p-4"
                    >
                      <div className="text-sm font-medium">{stage}</div>
                      <div className="mt-2 text-xs text-atlas-steel">
                        Huni aşaması
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-black/10 bg-gradient-to-br from-atlas-blue to-atlas-teal p-[1px]">
                  <div className="rounded-2xl bg-white p-6">
                    <div className="text-sm font-semibold">Müşteri bağlamı</div>
                    <p className="mt-2 text-sm text-atlas-steel">
                      Görevleri, aktiviteleri ve huni aşamalarını aynı hesap
                      kaydıyla ilişkilendirerek ekiplerin bağlamı kaybetmesini
                      engelleyin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Rol bazlı deneyim</h2>
          <p className="mt-3 max-w-2xl text-sm text-atlas-steel">
            AtlasCRM; en az ayrıcalık prensibi ve rol bazlı iş akışlarıyla
            tasarlanmıştır.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Yönetici",
                body: "Kurum kurulumu, erişim kontrolü, güvenlik duruşu ve faturalandırma yönetimi.",
                accent: "bg-atlas-blue",
              },
              {
                title: "Yönetici (Manager)",
                body: "Takım görünürlüğü, iş yükü dengeleme, KPI uyumlu takip ve raporlama.",
                accent: "bg-atlas-teal",
              },
              {
                title: "Kullanıcı",
                body: "Net atamalar, müşteri bağlamı ve hafif ama güçlü aktivite takibi.",
                accent: "bg-atlas-steel",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6"
              >
                <div className={`absolute left-0 top-0 h-full w-1.5 ${card.accent}`} />
                <div className="text-sm font-semibold text-atlas-blue">
                  {card.title}
                </div>
                <p className="mt-2 text-sm text-atlas-steel">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold">Güvenlik ve kurumsal hazırlık</h2>
            <p className="mt-3 max-w-2xl text-sm text-atlas-steel">
              Oturum tabanlı kimlik doğrulama, merkezi veri erişimi ve
              production seviyesinde hata yönetimi ile güvenli çalışır.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Oturum tabanlı kimlik doğrulama",
                  body: "HttpOnly oturum çerezi, sunucu tarafı doğrulama ve süre sonu.",
                  tone: "bg-atlas-teal/10",
                },
                {
                  title: "Rol bazlı yetkilendirme",
                  body: "Admin/Manager/User sorumluluklarının net ayrımı.",
                  tone: "bg-atlas-blue/10",
                },
                {
                  title: "Merkezi veritabanı erişimi",
                  body: "Tutarlı sorgu sınırlarıyla Prisma istemcisi (singleton) yaklaşımı.",
                  tone: "bg-atlas-cloud",
                },
                {
                  title: "Denetime uygun temel",
                  body: "Gelecekte denetim logları ve raporlama için hazır şema ve iş akışları.",
                  tone: "bg-atlas-cloud",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border border-black/10 p-6 ${item.tone}`}
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <p className="mt-2 text-sm text-atlas-steel">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Fiyatlandırma (Stripe uyumlu)</h2>
              <p className="mt-3 max-w-2xl text-sm text-atlas-steel">
                Abonelik altyapısı; plan yönetimi, faturalama ve özellik kısıtları için Stripe
                entegrasyonuna hazırdır.
              </p>
            </div>
            <a
              href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Fiyatlandırma%20Talebi"
              className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm hover:bg-atlas-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60"
            >
              Teklif iste
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Takım",
                description: "Büyüyen ekipler için görev yönetimi ve CRM temelleri.",
                accent: "bg-atlas-cloud",
                featured: false,
                cta: {
                  label: "Demo iste",
                  href: "mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi",
                },
                bullets: [
                  "Görevler + müşteri bağlamı",
                  "Standart roller ve görünürlük",
                  "Temel güvenlik ve oturum yönetimi",
                ],
              },
              {
                title: "İşletme",
                description: "İzin duyarlı görünümler ve raporlama odaklı yapı.",
                accent: "bg-gradient-to-b from-atlas-teal/10 to-white",
                featured: true,
                cta: {
                  label: "Satış ile görüş",
                  href: "mailto:demo@atlascrm.com?subject=AtlasCRM%20Fiyatlandırma%20Talebi",
                },
                bullets: [
                  "Gelişmiş raporlama kurgusu",
                  "Daha yüksek limitler ve büyüme alanı",
                  "Operasyonel süreçlere uygun takip",
                ],
              },
              {
                title: "Kurumsal",
                description: "Özel güvenlik, onboarding ve destek ihtiyaçları için.",
                accent: "bg-atlas-cloud",
                featured: false,
                cta: {
                  label: "İletişime geç",
                  href: "/iletisim",
                },
                bullets: [
                  "Özel güvenlik gereksinimleri",
                  "Onboarding ve süreç uyarlama",
                  "Öncelikli destek ve operasyon eşliği",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 ${
                  plan.featured ? "border-atlas-teal/40" : ""
                } transform-gpu transition-transform duration-200 [transform:perspective(1100px)] hover:[transform:perspective(1100px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)] hover:shadow-lg focus-within:[transform:perspective(1100px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)] focus-within:shadow-lg`}
              >
                <div className={`absolute inset-0 ${plan.accent}`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-atlas-blue">{plan.title}</div>
                    {plan.featured ? (
                      <span className="rounded-full bg-atlas-teal px-2.5 py-1 text-xs font-medium text-white">
                        Önerilen
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-atlas-steel">{plan.description}</p>

                  <div className="mt-5 rounded-xl border border-black/10 bg-white/80 p-4">
                    <div className="text-xs font-medium text-atlas-steel">Dahil olanlar</div>
                    <ul className="mt-3 space-y-2 text-sm">
                      {plan.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-atlas-teal" />
                          <span className="text-atlas-blue">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    {plan.cta.href.startsWith("/") ? (
                      <Link
                        href={plan.cta.href}
                        className={`inline-flex rounded-md px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60 ${
                          plan.featured
                            ? "bg-atlas-blue text-white"
                            : "border border-black/10 bg-white"
                        }`}
                      >
                        {plan.cta.label}
                      </Link>
                    ) : (
                      <a
                        href={plan.cta.href}
                        className={`inline-flex rounded-md px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60 ${
                          plan.featured
                            ? "bg-atlas-blue text-white"
                            : "border border-black/10 bg-white"
                        }`}
                      >
                        {plan.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  k: "Stripe hazır",
                  v: "Plan/özellik kurgusu için entegrasyon zemini.",
                },
                {
                  k: "Kurumsal uyum",
                  v: "Rol bazlı deneyim ve denetlenebilir veri modeli.",
                },
                {
                  k: "Hızlı başlangıç",
                  v: "Demo + onboarding ile süreçlerinize oturtun.",
                },
              ].map((row) => (
                <div key={row.k} className="rounded-xl bg-atlas-cloud p-4">
                  <div className="text-sm font-semibold text-atlas-blue">{row.k}</div>
                  <div className="mt-2 text-sm text-atlas-steel">{row.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">Plan seçtikten sonra ne olur?</h3>
                <p className="mt-2 max-w-2xl text-sm text-atlas-steel">
                  Kurumsal satın alma akışını netleştirdik: doğru planı seçin, ihtiyaçları netleştirelim,
                  pilotla doğrulayalım ve canlıya geçirelim.
                </p>
              </div>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm hover:bg-atlas-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-teal/60"
              >
                Süreci birlikte planlayalım
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                {
                  n: "01",
                  t: "Plan seçimi",
                  d: "Takım/İşletme/Kurumsal hedefinizi ve kapsamı netleştiririz.",
                },
                {
                  n: "02",
                  t: "İhtiyaç analizi",
                  d: "Roller, süreçler, raporlama ve entegrasyon ihtiyaçlarını toplarız.",
                },
                {
                  n: "03",
                  t: "Pilot / doğrulama",
                  d: "Kısa bir pilot ile akışları test eder, kriterleri doğrularız.",
                },
                {
                  n: "04",
                  t: "Onboarding + canlıya geçiş",
                  d: "Eğitim, veri hazırlığı ve go‑live planıyla devreye alırız.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-black/10 bg-atlas-cloud p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-atlas-steel">
                    <span className="size-1.5 rounded-full bg-atlas-teal" />
                    {step.n}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-atlas-blue">{step.t}</div>
                  <p className="mt-2 text-sm leading-7 text-atlas-steel">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-2xl bg-gradient-to-br from-atlas-blue to-atlas-teal p-8 text-white md:p-10">
              <h2 className="text-2xl font-semibold">AtlasCRM’i canlı görün</h2>
              <p className="mt-3 max-w-2xl text-sm text-white/80">
                İş akışınıza, rollerinize ve raporlama ihtiyaçlarınıza uygun bir
                demo planlayalım.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
                  className="inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-medium text-atlas-blue hover:bg-atlas-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-atlas-blue"
                >
                  Demo talep et
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-atlas-cloud">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="text-sm font-semibold text-atlas-blue">AtlasCRM</div>
              <p className="mt-3 max-w-md text-sm leading-7 text-atlas-steel">
                Görev, müşteri ve aktivite yönetimini; güvenli, rol-bilinçli ve kurumsal
                bir çalışma alanında birleştirir.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="mailto:demo@atlascrm.com?subject=AtlasCRM%20Demo%20Talebi"
                  className="inline-flex rounded-md bg-atlas-teal px-4 py-2 text-sm font-medium text-white hover:opacity-95"
                >
                  Demo iste
                </a>
                <Link
                  href="/iletisim"
                  className="inline-flex rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-atlas-cloud"
                >
                  İletişim
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-atlas-steel">Ürün</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a className="text-atlas-blue hover:underline" href="/#overview">
                    Genel Bakış
                  </a>
                </li>
                <li>
                  <a className="text-atlas-blue hover:underline" href="/#roles">
                    Roller
                  </a>
                </li>
                <li>
                  <a className="text-atlas-blue hover:underline" href="/#security">
                    Güvenlik
                  </a>
                </li>
                <li>
                  <a className="text-atlas-blue hover:underline" href="/#pricing">
                    Fiyatlandırma
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-medium text-atlas-steel">Şirket</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link className="text-atlas-blue hover:underline" href="/hakkimizda">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link className="text-atlas-blue hover:underline" href="/iletisim">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link className="text-atlas-blue hover:underline" href="/app">
                    Uygulama
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-medium text-atlas-steel">Erişim</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link className="text-atlas-blue hover:underline" href="/login">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <a
                    className="text-atlas-blue hover:underline"
                    href="mailto:support@atlascrm.com?subject=AtlasCRM%20Destek"
                  >
                    Destek
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-atlas-steel md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} AtlasCRM. Tüm hakları saklıdır.</div>
            <div className="text-xs">Kurumsal kullanım için tasarlanmıştır.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
