import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-[80svh] flex items-center justify-center px-6 pt-24">
      <div className="text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="h-section mb-6 text-ivory">Страница не найдена · Sahifa topilmadi</h1>
        <Link href="/" className="btn btn-gold">
          На главную · Bosh sahifa
        </Link>
      </div>
    </section>
  );
}
