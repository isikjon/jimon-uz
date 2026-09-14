import type { Locale } from "@/i18n/config";

export type ElementId = "wood" | "fire" | "earth" | "metal" | "water";

export interface WuXingElement {
  id: ElementId;
  hanzi: string;
  color: string;
  glow: string;
  name: Record<Locale, string>;
  season: Record<Locale, string>;
  quality: Record<Locale, string>;
  organ: Record<Locale, string>;
  text: Record<Locale, string>;
  direction: Record<Locale, string>;
  products: string[];
}

export const elements: WuXingElement[] = [
  {
    id: "wood",
    hanzi: "木",
    color: "#3E8C6E",
    glow: "#63C79B",
    name: { ru: "Дерево", uz: "Daraxt" },
    season: { ru: "Весна", uz: "Bahor" },
    quality: { ru: "Рост · Обновление · Движение", uz: "O‘sish · Yangilanish · Harakat" },
    organ: { ru: "В ТКМ связано с печенью и желчным пузырём", uz: "TKMda jigar va o‘t pufagi bilan bog‘liq" },
    text: {
      ru: "Дерево — начало цикла: всё, что тянется вверх, очищается и обновляется. Гибкость тела и лёгкость после еды в ТКМ относят именно сюда.",
      uz: "Daraxt — siklning boshlanishi: yuqoriga intiladigan, tozalanadigan va yangilanadigan hamma narsa. Tananing egiluvchanligi va ovqatdan keyingi yengillik TKMda aynan shu unsurga tegishli.",
    },
    direction: { ru: "Очищение и лёгкость", uz: "Tozalash va yengillik" },
    products: ["birunkang", "figura-a"],
  },
  {
    id: "fire",
    hanzi: "火",
    color: "#B3352C",
    glow: "#F07A5A",
    name: { ru: "Огонь", uz: "Olov" },
    season: { ru: "Лето", uz: "Yoz" },
    quality: { ru: "Тепло · Циркуляция · Радость", uz: "Issiqlik · Aylanish · Quvonch" },
    organ: { ru: "В ТКМ связано с сердцем и сосудами", uz: "TKMda yurak va tomirlar bilan bog‘liq" },
    text: {
      ru: "Огонь отвечает за тепло, кровообращение и ясность духа. Когда огонь в балансе — есть энергия и ровное настроение.",
      uz: "Olov issiqlik, qon aylanishi va ruh ravshanligi uchun javob beradi. Olov muvozanatda bo‘lsa — energiya va bir tekis kayfiyat bo‘ladi.",
    },
    direction: { ru: "Сердце, сосуды и тепло", uz: "Yurak, tomirlar va issiqlik" },
    products: ["xuelanduo", "keleshu"],
  },
  {
    id: "earth",
    hanzi: "土",
    color: "#C9A24A",
    glow: "#E9CB78",
    name: { ru: "Земля", uz: "Tuproq" },
    season: { ru: "Позднее лето", uz: "Kech yoz" },
    quality: { ru: "Питание · Усвоение · Опора", uz: "Ozuqa · So‘rilish · Tayanch" },
    organ: { ru: "В ТКМ связано с селезёнкой и желудком", uz: "TKMda taloq va oshqozon bilan bog‘liq" },
    text: {
      ru: "Земля — центр, который питает всё остальное: пищеварение, усвоение и превращение пищи в силу. Здесь рождаются сытость и устойчивость.",
      uz: "Tuproq — qolgan hamma narsani oziqlantiruvchi markaz: hazm, so‘rilish va ovqatning kuchga aylanishi. To‘yinganlik va barqarorlik shu yerda tug‘iladi.",
    },
    direction: { ru: "Пищеварение и питание тканей", uz: "Hazm va to‘qimalar ozuqasi" },
    products: ["shanlineng-flax", "xianyunyou", "chicory", "shanlineng-bone-collagen"],
  },
  {
    id: "metal",
    hanzi: "金",
    color: "#D9D4C7",
    glow: "#F3EEE2",
    name: { ru: "Металл", uz: "Metall" },
    season: { ru: "Осень", uz: "Kuz" },
    quality: { ru: "Ясность · Дыхание · Защита", uz: "Ravshanlik · Nafas · Himoya" },
    organ: { ru: "В ТКМ связано с лёгкими и кожей", uz: "TKMda o‘pka va teri bilan bog‘liq" },
    text: {
      ru: "Металл — граница между внутренним и внешним: дыхание, кожа, защита. Чистота и структура — его качества.",
      uz: "Metall — ichki va tashqi o‘rtasidagi chegara: nafas, teri, himoya. Tozalik va tuzilma — uning sifatlari.",
    },
    direction: { ru: "Дыхание, кожа и защита", uz: "Nafas, teri va himoya" },
    products: ["tianrancui", "oq-orxideya", "yuanyun"],
  },
  {
    id: "water",
    hanzi: "水",
    color: "#2F5B8A",
    glow: "#6FA3D8",
    name: { ru: "Вода", uz: "Suv" },
    season: { ru: "Зима", uz: "Qish" },
    quality: { ru: "Глубина · Резерв · Восстановление", uz: "Chuqurlik · Zaxira · Tiklanish" },
    organ: { ru: "В ТКМ связано с почками и костями", uz: "TKMda buyraklar va suyaklar bilan bog‘liq" },
    text: {
      ru: "Вода хранит глубинный ресурс организма. В восточной медицине почки считают источником жизненной энергии — отсюда выносливость, кости и восстановление.",
      uz: "Suv organizmning chuqur zaxirasini saqlaydi. Sharq tibbiyotida buyraklar hayotiy energiya manbai hisoblanadi — chidamlilik, suyaklar va tiklanish shundan.",
    },
    direction: { ru: "Энергия, кости и восстановление", uz: "Energiya, suyaklar va tiklanish" },
    products: ["mayou-ginseng", "tongyuan", "shanlineng-joint", "figura-b"],
  },
];
