import type { Locale } from "@/i18n/config";

export interface Badge {
  id: string;
  image: string;
  title: Record<Locale, string>;
  text: Record<Locale, string>;
}

export interface Doc {
  id: string;
  image: string;
  title: Record<Locale, string>;
  meta: Record<Locale, string>;
  aspect: number;
}

export const badges: Badge[] = [
  {
    id: "gmp",
    image: "/images/badges/gmp.png",
    title: { ru: "GMP", uz: "GMP" },
    text: { ru: "Стандарт надлежащей производственной практики", uz: "Tegishli ishlab chiqarish amaliyoti standarti" },
  },
  {
    id: "halal",
    image: "/images/badges/halal.png",
    title: { ru: "Халяль", uz: "Halol" },
    text: { ru: "Сертификат №119-2025, HALAL HOLDING", uz: "№119-2025 sertifikati, HALAL HOLDING" },
  },
  {
    id: "kosher",
    image: "/images/badges/kosher.png",
    title: { ru: "Кошер", uz: "Kosher" },
    text: { ru: "Подтверждение соответствия правилам кашрута", uz: "Kashrut qoidalariga muvofiqlik tasdig‘i" },
  },
  {
    id: "picc",
    image: "/images/badges/picc.png",
    title: { ru: "PICC", uz: "PICC" },
    text: { ru: "Страхование партий продукции", uz: "Mahsulot partiyalarining sug‘urtasi" },
  },
  {
    id: "eac",
    image: "/images/badges/eaeu.png",
    title: { ru: "ЕАС", uz: "EAC" },
    text: { ru: "Декларация о соответствии ЕАЭС до 2030 года", uz: "2030 yilgacha YEOI muvofiqlik deklaratsiyasi" },
  },
];

export const docs: Doc[] = [
  {
    id: "eas",
    image: "/images/certs/cert-eas.webp",
    aspect: 848 / 1232,
    title: { ru: "Декларация о соответствии ЕАЭС", uz: "YEOI muvofiqlik deklaratsiyasi" },
    meta: {
      ru: "№ ЕАЭС N RU Д-CN.PA09.B.01635/25 · 10.10.2025 – 06.10.2030 · изготовитель Jinmu Group Co., Ltd.",
      uz: "№ ЕАЭС N RU Д-CN.PA09.B.01635/25 · 10.10.2025 – 06.10.2030 · ishlab chiqaruvchi Jinmu Group Co., Ltd.",
    },
  },
  {
    id: "halal",
    image: "/images/certs/cert-halal.webp",
    aspect: 832 / 1232,
    title: { ru: "Сертификат Халяль", uz: "Halol sertifikati" },
    meta: {
      ru: "№119-2025 · HALAL HOLDING, Алматы · действует до 17.12.2026",
      uz: "№119-2025 · HALAL HOLDING, Almati · 17.12.2026 gacha amal qiladi",
    },
  },
  {
    id: "halal-list",
    image: "/images/certs/cert-halal-list.webp",
    aspect: 848 / 1216,
    title: { ru: "Приложение к сертификату Халяль", uz: "Halol sertifikatiga ilova" },
    meta: { ru: "Перечень продукции", uz: "Mahsulotlar ro‘yxati" },
  },
  {
    id: "awards",
    image: "/images/certs/cert-awards.webp",
    aspect: 928 / 1120,
    title: { ru: "Награды и отраслевые членства", uz: "Mukofotlar va soha a’zoliklari" },
    meta: {
      ru: "Ассоциации ТКМ и фармацевтики Китая, статусы высокотехнологичного предприятия",
      uz: "Xitoy TKM va farmatsevtika assotsiatsiyalari, yuqori texnologiyali korxona maqomlari",
    },
  },
  {
    id: "registration",
    image: "/images/certs/cert-reg.webp",
    aspect: 864 / 1200,
    title: { ru: "Государственная регистрация представительства (Казахстан)", uz: "Vakolatxonaning davlat ro‘yxati (Qozog‘iston)" },
    meta: {
      ru: "ТОО «Jimon Altun Nur Daily Necessities» · БИН 250940004719 · 04.09.2025",
      uz: "«Jimon Altun Nur Daily Necessities» MChJ · BIN 250940004719 · 04.09.2025",
    },
  },
  {
    id: "quality-award",
    image: "/images/certs/quality-award.webp",
    aspect: 535 / 296,
    title: { ru: "Премия правительства провинции Хэбэй за качество", uz: "Xebey viloyati hukumatining Sifat mukofoti" },
    meta: { ru: "13-я премия · 2025", uz: "13-mukofot · 2025" },
  },
];
