import type { Locale } from "@/i18n/config";

export type L<T = string> = Record<Locale, T>;

export type CategoryId = "complex" | "tablets" | "powders" | "care" | "special";

export interface Category {
  id: CategoryId;
  name: L;
  lead: L;
}

export interface Component {
  name: string;
  desc: string;
}

export interface Product {
  id: string;
  category: CategoryId;
  /** Studio photo (ivory background). */
  image: string;
  /** Catalog page number (1-based) used for the "catalog page" preview. */
  catalogPage: number;
  cn?: string;
  latin?: string;
  name: L;
  tagline: L;
  short: L;
  purpose: L<string[]>;
  components: L<Component[]>;
  usage: L;
  form: L;
  volume: string;
  count?: L;
  course?: L;
  standard?: string;
  insured?: boolean;
  caution?: L;
  /** Five-element association used by the Wu Xing scene. */
  element: "wood" | "fire" | "earth" | "metal" | "water";
}

export const categories: Category[] = [
  {
    id: "complex",
    name: { ru: "Комплексные программы", uz: "Kompleks dasturlar" },
    lead: {
      ru: "Готовые наборы из нескольких продуктов, которые работают как система.",
      uz: "Bir necha mahsulotdan iborat, tizim sifatida ishlaydigan tayyor to‘plamlar.",
    },
  },
  {
    id: "tablets",
    name: { ru: "Жевательные таблетки", uz: "Chaynaladigan tabletkalar" },
    lead: {
      ru: "Прессованные растительные формулы по традиционным рецептурам.",
      uz: "An’anaviy retsepturalar asosidagi presslangan o‘simlik formulalari.",
    },
  },
  {
    id: "powders",
    name: { ru: "Порошки и напитки", uz: "Kukunlar va ichimliklar" },
    lead: {
      ru: "Коллагеновые пептиды и растительные напитки в удобных стиках.",
      uz: "Qulay stiklardagi kollagen peptidlari va o‘simlik ichimliklari.",
    },
  },
  {
    id: "care",
    name: { ru: "Уход за кожей и телом", uz: "Teri va tana parvarishi" },
    lead: {
      ru: "Косметические формулы с пептидами и растительными экстрактами.",
      uz: "Peptidlar va o‘simlik ekstraktlari bilan kosmetik formulalar.",
    },
  },
  {
    id: "special",
    name: { ru: "Специальный уход", uz: "Maxsus parvarish" },
    lead: {
      ru: "Деликатные средства для глаз и интимной гигиены.",
      uz: "Ko‘z va intim gigiyena uchun nozik vositalar.",
    },
  },
];

export const products: Product[] = [
  {
    id: "figura-a",
    category: "complex",
    image: "/images/products/product-31.webp",
    catalogPage: 4,
    element: "wood",
    name: { ru: "Комплекс «Фигура A»", uz: "«Figura A» kompleksi" },
    tagline: {
      ru: "Женьшень и дудник · 5 компонентов",
      uz: "Jenshen va dudnik · 5 komponent",
    },
    short: {
      ru: "Программа для тех, кто хочет работать над фигурой комплексно: мягкое очищение, поддержка обмена веществ, контроль аппетита, питание суставов и общий тонус.",
      uz: "Figura ustida kompleks ishlashni istaganlar uchun dastur: yumshoq tozalash, moddalar almashinuvini qo‘llab-quvvatlash, ishtahani nazorat qilish, bo‘g‘imlar ozuqasi va umumiy tonus.",
    },
    purpose: {
      ru: [
        "Снижение объёмов без жёстких диет",
        "Меньше тяжести и отёчности",
        "Питание суставов и кожи",
        "Контроль аппетита и тяги к перееданию",
        "Энергия и внутренний ресурс",
      ],
      uz: [
        "Qattiq dietalarsiz hajmlarni kamaytirish",
        "Og‘irlik va shishlarni kamaytirish",
        "Bo‘g‘imlar va teri ozuqasi",
        "Ishtaha va ko‘p yeyishga moyillikni nazorat qilish",
        "Energiya va ichki resurs",
      ],
    },
    components: {
      ru: [
        { name: "Birun Kang", desc: "мягкий детокс и снижение нагрузки на ЖКТ" },
        { name: "Xian Yun You", desc: "контроль веса, аппетита и объёма пищи" },
        { name: "Льняной коллагеновый пептид", desc: "кожа, волосы и чувство сытости" },
        { name: "Костный коллаген", desc: "суставы, кости и связки при изменении нагрузки" },
        { name: "Почечный комплекс с женьшенем", desc: "тонус и водно-солевой баланс" },
      ],
      uz: [
        { name: "Birun Kang", desc: "yumshoq detoks va oshqozon-ichak yuklamasini kamaytirish" },
        { name: "Xian Yun You", desc: "vazn, ishtaha va ovqat hajmini nazorat qilish" },
        { name: "Zig‘ir kollagen peptidi", desc: "teri, soch va to‘yinganlik hissi" },
        { name: "Suyak kollageni", desc: "yuklama o‘zgarganda bo‘g‘im, suyak va bog‘lamlar" },
        { name: "Jenshenli buyrak kompleksi", desc: "tonus va suv-tuz muvozanati" },
      ],
    },
    usage: {
      ru: "Рекомендуемый курс — 30–90 дней. Оптимальный устойчивый результат по ощущениям и фигуре — 60–90 дней.",
      uz: "Tavsiya etiladigan kurs — 30–90 kun. Barqaror natija uchun optimal muddat — 60–90 kun.",
    },
    form: { ru: "Набор из 5 продуктов", uz: "5 mahsulotdan iborat to‘plam" },
    volume: "5 × 1",
    course: { ru: "30–90 дней", uz: "30–90 kun" },
    insured: true,
  },
  {
    id: "figura-b",
    category: "complex",
    image: "/images/products/product-32.webp",
    catalogPage: 5,
    element: "water",
    name: { ru: "Комплекс «Фигура B»", uz: "«Figura B» kompleksi" },
    tagline: {
      ru: "Версия Snow Lan Duo · 5 компонентов",
      uz: "Snow Lan Duo versiyasi · 5 komponent",
    },
    short: {
      ru: "Версия для тех, кто склонен к отёкам и скоплению жидкости в области живота и бёдер. Акцент на дренаж, лёгкое очищение и более плотный, «собранный» контур тела.",
      uz: "Shish va qorin-son sohasida suyuqlik to‘planishiga moyil bo‘lganlar uchun versiya. Asosiy urg‘u — drenaj, yengil tozalash va tananing yanada zich, «yig‘ilgan» ko‘rinishi.",
    },
    purpose: {
      ru: [
        "Уменьшение отёчности и тяжести",
        "Более чёткие контуры тела",
        "Поддержка суставов и тканей",
        "Дренаж и вывод лишней жидкости",
        "Контроль аппетита и тяги к сладкому",
      ],
      uz: [
        "Shish va og‘irlikni kamaytirish",
        "Tana konturlarini yanada zichlash",
        "Bo‘g‘imlar va to‘qimalarni qo‘llab-quvvatlash",
        "Drenaj va ortiqcha suyuqlikni chiqarish",
        "Ishtaha va shirinlikka moyillikni nazorat qilish",
      ],
    },
    components: {
      ru: [
        { name: "Детокс-компонент", desc: "очищение кишечника и снижение нагрузки на ЖКТ" },
        { name: "Snow Lan Duo", desc: "дренаж и поддержка обмена веществ — ключевой элемент версии B" },
        { name: "Xian Yun You", desc: "контроль веса и аппетита" },
        { name: "Коллаген / суставной комплекс", desc: "кожа, связки и суставы" },
        { name: "Энергетический комплекс", desc: "тонус тела и восстановление" },
      ],
      uz: [
        { name: "Detoks-komponent", desc: "ichaklarni tozalash va oshqozon-ichak yuklamasini kamaytirish" },
        { name: "Snow Lan Duo", desc: "drenaj va moddalar almashinuvi — B versiyasining asosiy elementi" },
        { name: "Xian Yun You", desc: "vazn va ishtahani nazorat qilish" },
        { name: "Kollagen / bo‘g‘im kompleksi", desc: "teri, bog‘lamlar va bo‘g‘imlar" },
        { name: "Energetik kompleks", desc: "tana tonusi va tiklanish" },
      ],
    },
    usage: {
      ru: "Рекомендуемый курс — 30–90 дней. Особенность версии B — внимание к выводу лишней жидкости, поэтому визуальное уменьшение объёмов заметно быстрее.",
      uz: "Tavsiya etiladigan kurs — 30–90 kun. B versiyasining o‘ziga xosligi — ortiqcha suyuqlikni chiqarishga e’tibor, shu bois hajmlarning vizual kamayishi tezroq seziladi.",
    },
    form: { ru: "Набор из 5 продуктов", uz: "5 mahsulotdan iborat to‘plam" },
    volume: "5 × 1",
    course: { ru: "30–90 дней", uz: "30–90 kun" },
    insured: true,
  },
  {
    id: "birunkang",
    category: "tablets",
    image: "/images/products/product-10.webp",
    catalogPage: 16,
    element: "wood",
    cn: "碧润康 · 荷叶山楂压片糖果",
    latin: "Birunkang",
    name: { ru: "Birunkang «Лотос и боярышник»", uz: "Birunkang «Lotus va do‘lana»" },
    tagline: { ru: "Пищеварение · Лёгкость · 6 трав ТКМ", uz: "Hazm · Yengillik · TKMning 6 giyohi" },
    short: {
      ru: "Натуральные жевательные таблетки на основе листа лотоса, боярышника, пории и других трав традиционной китайской медицины. Помогают легче переносить тяжесть после еды и поддерживают лёгкость и чистоту изнутри.",
      uz: "Lotus bargi, do‘lana, poriya va boshqa an’anaviy xitoy giyohlari asosidagi tabiiy chaynaladigan tabletkalar. Ovqatdan keyingi og‘irlikni yengillashtiradi, ichki yengillik va tozalikni qo‘llab-quvvatlaydi.",
    },
    purpose: {
      ru: [
        "Комфортное пищеварение после плотной еды",
        "Мягкое очищение кишечника",
        "Свежесть во рту и меньше налёта на языке",
        "Поддержка обмена веществ и контроля веса",
        "Тонус сосудов и микроциркуляции",
      ],
      uz: [
        "To‘yimli ovqatdan keyin qulay hazm",
        "Ichaklarni yumshoq tozalash",
        "Og‘izda tozalik va tildagi qoplamaning kamayishi",
        "Moddalar almashinuvi va vazn nazoratini qo‘llab-quvvatlash",
        "Tomirlar tonusi va mikroqon aylanishi",
      ],
    },
    components: {
      ru: [
        { name: "Лист лотоса", desc: "поддерживает пищеварение и выведение лишней жидкости" },
        { name: "Боярышник", desc: "облегчает усвоение тяжёлой и жирной пищи" },
        { name: "Пория", desc: "поддерживает работу селезёнки, помогает выводить лишнюю влагу" },
        { name: "Семена кассии", desc: "мягкое очищение кишечника" },
        { name: "Ягоды годжи", desc: "поддержка печени и почек, питание организма" },
        { name: "Семена коикса", desc: "меньше отёков, здоровье кожи" },
      ],
      uz: [
        { name: "Lotus bargi", desc: "hazmni qo‘llab-quvvatlaydi, ortiqcha suyuqlikni chiqaradi" },
        { name: "Do‘lana", desc: "og‘ir va yog‘li ovqatni hazm qilishni yengillashtiradi" },
        { name: "Poriya", desc: "taloq faoliyatini qo‘llab-quvvatlaydi, ortiqcha namlikni chiqaradi" },
        { name: "Kassiya urug‘i", desc: "ichaklarni yumshoq tozalash" },
        { name: "Goji mevalari", desc: "jigar va buyraklarni qo‘llab-quvvatlaydi, organizmni oziqlantiradi" },
        { name: "Koiks urug‘i", desc: "shishlarni kamaytiradi, teri salomatligi" },
      ],
    },
    usage: {
      ru: "Утром 2–3 таблетки, запивая тёплой водой. Для более выраженного эффекта — 1–2 упаковки подряд; для ежедневной профилактики — регулярный приём.",
      uz: "Ertalab 2–3 tabletka iliq suv bilan. Kuchliroq ta’sir uchun — 1–2 quti ketma-ket; kundalik profilaktika uchun — muntazam qabul.",
    },
    form: { ru: "Жевательные таблетки", uz: "Chaynaladigan tabletkalar" },
    volume: "21 г",
    count: { ru: "30 таблеток × 0,7 г", uz: "30 tabletka × 0,7 g" },
    standard: "SB/T 10347",
    insured: true,
  },
  {
    id: "xianyunyou",
    category: "tablets",
    image: "/images/products/product-11.webp",
    catalogPage: 17,
    element: "earth",
    cn: "纤韵悠 · 果蔬粉压片糖果",
    latin: "Xian Yun You",
    name: { ru: "«Сянь Юнь Ю» — фруктово-овощные таблетки", uz: "«Syan Yun Yu» — meva-sabzavotli tabletkalar" },
    tagline: { ru: "Контроль веса · Иммунитет · 10+ экстрактов", uz: "Vazn nazorati · Immunitet · 10+ ekstrakt" },
    short: {
      ru: "Жевательные таблетки из более чем десяти натуральных фруктовых и овощных экстрактов. Низкая калорийность и насыщенный состав: помогают наладить чувство сытости, замедлить усвоение быстрых углеводов и поддержать иммунитет.",
      uz: "O‘ndan ortiq tabiiy meva va sabzavot ekstraktlaridan tayyorlangan chaynaladigan tabletkalar. Kaloriyasi past, tarkibi boy: to‘yinganlik hissini tartibga soladi, tez uglevodlar so‘rilishini sekinlashtiradi va immunitetni qo‘llab-quvvatlaydi.",
    },
    purpose: {
      ru: [
        "Контроль веса без жёстких диет",
        "Меньше тяги к перекусам",
        "Полноценное усвоение питательных веществ",
        "Мягкое очищение кишечника",
        "Ежедневная поддержка иммунитета",
      ],
      uz: [
        "Qattiq dietasiz vazn nazorati",
        "Ovqatlanish oralig‘ida kamroq ishtaha",
        "Ozuqa moddalarining to‘liq so‘rilishi",
        "Ichaklarni yumshoq tozalash",
        "Immunitetni har kuni qo‘llab-quvvatlash",
      ],
    },
    components: {
      ru: [
        { name: "Клубника + черника", desc: "антиоксиданты, витамины и флавоноиды" },
        { name: "Белая фасоль", desc: "замедляет расщепление крахмала и усвоение лишних калорий" },
        { name: "Зелёный кофе", desc: "хлорогеновая кислота — поддержка обмена веществ" },
        { name: "Грибы + чеснок", desc: "бета-глюканы для иммунитета кишечника" },
        { name: "Женьшень + кудзу + инулин + кассия", desc: "тонус, очищение, пребиотики, долгое чувство сытости" },
      ],
      uz: [
        { name: "Qulupnay + chernika", desc: "antioksidantlar, vitaminlar va flavonoidlar" },
        { name: "Oq loviya", desc: "kraxmal parchalanishi va ortiqcha kaloriya so‘rilishini sekinlashtiradi" },
        { name: "Yashil qahva", desc: "xlorogen kislotasi — moddalar almashinuvini qo‘llab-quvvatlash" },
        { name: "Qo‘ziqorin + sarimsoq", desc: "ichak immuniteti uchun beta-glyukanlar" },
        { name: "Jenshen + kudzu + inulin + kassiya", desc: "tonus, tozalash, prebiotiklar, uzoq to‘yinganlik" },
      ],
    },
    usage: {
      ru: "По 1–2 таблетки после еды. Хранить в прохладном сухом месте.",
      uz: "Ovqatdan keyin 1–2 tabletka. Salqin va quruq joyda saqlang.",
    },
    caution: {
      ru: "Не рекомендуется детям до 14 лет, беременным и кормящим женщинам.",
      uz: "14 yoshgacha bolalarga, homilador va emizikli ayollarga tavsiya etilmaydi.",
    },
    form: { ru: "Жевательные таблетки", uz: "Chaynaladigan tabletkalar" },
    volume: "30 г",
    count: { ru: "30 таблеток × 1 г", uz: "30 tabletka × 1 g" },
    insured: true,
  },
  {
    id: "xuelanduo",
    category: "tablets",
    image: "/images/products/product-12.webp",
    catalogPage: 15,
    element: "fire",
    cn: "雪蓝朵 · 明日叶纳豆压片糖果",
    latin: "Xue Lan Duo",
    name: { ru: "«Сюэ Лань До» — ашитаба и натто", uz: "«Syue Lan Do» — ashitaba va natto" },
    tagline: { ru: "Сердце и сосуды · Натто · Лумброкиназа", uz: "Yurak va tomirlar · Natto · Lumbrokinaza" },
    short: {
      ru: "Жевательные таблетки на основе ангелики кейске (ашитаба) и натто для поддержки сердца, сосудов и кровообращения. Формула дополнена лумброкиназой, кукурузными рыльцами и растительными экстрактами.",
      uz: "Yurak, tomirlar va qon aylanishini qo‘llab-quvvatlash uchun angelika keyske (ashitaba) va natto asosidagi chaynaladigan tabletkalar. Formula lumbrokinaza, makkajo‘xori popugi va o‘simlik ekstraktlari bilan boyitilgan.",
    },
    purpose: {
      ru: [
        "Поддержка сердца и сосудов",
        "Кровообращение и микроциркуляция",
        "Антиоксидантная защита клеток",
        "Лимфодренаж и лёгкий детокс",
        "Здоровый обмен веществ и иммунитет",
      ],
      uz: [
        "Yurak va tomirlarni qo‘llab-quvvatlash",
        "Qon aylanishi va mikrosirkulyatsiya",
        "Hujayralarning antioksidant himoyasi",
        "Limfa drenaji va yengil detoks",
        "Sog‘lom moddalar almashinuvi va immunitet",
      ],
    },
    components: {
      ru: [
        { name: "Ангелика кейске (ашитаба)", desc: "мощный антиоксидант, поддерживает сосуды и иммунитет" },
        { name: "Натто", desc: "поддерживает нормальную вязкость крови и микроциркуляцию, источник витамина K2" },
        { name: "Лумброкиназа", desc: "фермент, поддерживающий кровообращение" },
        { name: "Кукурузные рыльца + инулин", desc: "лимфодренаж, вывод лишней жидкости, микрофлора кишечника" },
        { name: "Томат · миндаль · кассия · гардения", desc: "комплекс антиоксидантов для зрения, давления и очищения" },
      ],
      uz: [
        { name: "Angelika keyske (ashitaba)", desc: "kuchli antioksidant, tomirlar va immunitetni qo‘llab-quvvatlaydi" },
        { name: "Natto", desc: "qonning me’yoriy quyuqligi va mikrosirkulyatsiya, K2 vitamini manbai" },
        { name: "Lumbrokinaza", desc: "qon aylanishini qo‘llab-quvvatlovchi ferment" },
        { name: "Makkajo‘xori popugi + inulin", desc: "limfa drenaji, ortiqcha suyuqlikni chiqarish, ichak mikroflorasi" },
        { name: "Pomidor · bodom · kassiya · gardeniya", desc: "ko‘rish, bosim va tozalash uchun antioksidantlar majmuasi" },
      ],
    },
    usage: {
      ru: "Разжёвывать или рассасывать по 1–2 таблетки 2 раза в день — утром и вечером.",
      uz: "Kuniga 2 marta — ertalab va kechqurun 1–2 tabletkadan chaynab yoki so‘rib qabul qiling.",
    },
    caution: {
      ru: "Не рекомендуется детям, беременным и кормящим женщинам.",
      uz: "Bolalar, homilador va emizikli ayollarga tavsiya etilmaydi.",
    },
    form: { ru: "Жевательные таблетки", uz: "Chaynaladigan tabletkalar" },
    volume: "42 г",
    count: { ru: "60 таблеток × 0,7 г", uz: "60 tabletka × 0,7 g" },
    standard: "SB/T 10347",
    insured: true,
  },
  {
    id: "mayou-ginseng",
    category: "tablets",
    image: "/images/products/product-16.webp",
    catalogPage: 14,
    element: "water",
    cn: "人参黄精压片糖果",
    latin: "MAYOU Ginseng & Polygonatum",
    name: { ru: "MAYOU «Женьшень и хуанцзин»", uz: "MAYOU «Jenshen va xuanszin»" },
    tagline: { ru: "Внутреннее тепло. Внешняя сила.", uz: "Ichki issiqlik. Tashqi kuch." },
    short: {
      ru: "Улучшенная формула с женьшенем, хуанцзином (полигонатум), годжи и эвкоммией. В восточной медицине почки считают источником жизненной энергии — формула создана для поддержки выносливости, тонуса и иммунитета у мужчин и женщин.",
      uz: "Jenshen, xuanszin (poligonatum), goji va evkommiya bilan takomillashtirilgan formula. Sharq tibbiyotida buyraklar hayotiy energiya manbai hisoblanadi — formula erkaklar va ayollarda chidamlilik, tonus va immunitetni qo‘llab-quvvatlash uchun yaratilgan.",
    },
    purpose: {
      ru: [
        "Меньше усталости, больше мотивации",
        "Поддержка либидо и активности",
        "Замедление возрастного «износа»",
        "Иммунитет и выносливость",
        "Тепло, крепкие суставы и кости",
      ],
      uz: [
        "Kamroq charchoq, ko‘proq motivatsiya",
        "Libido va faollikni qo‘llab-quvvatlash",
        "Yoshga bog‘liq «yemirilish»ni sekinlashtirish",
        "Immunitet va chidamlilik",
        "Ichki issiqlik, mustahkam bo‘g‘im va suyaklar",
      ],
    },
    components: {
      ru: [
        { name: "Женьшень", desc: "поддерживает пять ключевых органов, восстанавливает эмоциональный баланс" },
        { name: "Хуанцзин (полигонатум)", desc: "восполняет ресурсы и жизненную энергию" },
        { name: "Ягоды годжи", desc: "укрепляют сухожилия и кости, замедляют старение" },
        { name: "Эвкоммия (дучжун)", desc: "питает печень и почки, укрепляет поясницу" },
        { name: "Сорбит", desc: "натуральная сладость без резкого подъёма сахара" },
      ],
      uz: [
        { name: "Jenshen", desc: "beshta asosiy a’zoni qo‘llab-quvvatlaydi, hissiy muvozanatni tiklaydi" },
        { name: "Xuanszin (poligonatum)", desc: "resurslar va hayotiy energiyani to‘ldiradi" },
        { name: "Goji mevalari", desc: "pay va suyaklarni mustahkamlaydi, qarishni sekinlashtiradi" },
        { name: "Evkommiya (duchjun)", desc: "jigar va buyraklarni oziqlantiradi, belni mustahkamlaydi" },
        { name: "Sorbit", desc: "qondagi shakarni keskin ko‘tarmaydigan tabiiy shirinlik" },
      ],
    },
    usage: {
      ru: "По 1 таблетке 1–2 раза в день после еды. Для устойчивого результата — регулярный приём.",
      uz: "Ovqatdan keyin kuniga 1–2 marta 1 tabletkadan. Barqaror natija uchun — muntazam qabul.",
    },
    form: { ru: "Прессованные таблетки", uz: "Presslangan tabletkalar" },
    volume: "12 г",
    count: { ru: "20 таблеток × 0,6 г", uz: "20 tabletka × 0,6 g" },
    course: { ru: "1–3 месяца", uz: "1–3 oy" },
    standard: "KGMP",
  },
  {
    id: "chicory",
    category: "tablets",
    image: "/images/products/product-23.webp",
    catalogPage: 18,
    element: "earth",
    cn: "菊苣压片糖果",
    name: { ru: "Таблетки с цикорием", uz: "Sikoriyli tabletkalar" },
    tagline: { ru: "Инулин · Микробиом · Иммунитет", uz: "Inulin · Mikrobiom · Immunitet" },
    short: {
      ru: "Жевательные таблетки на основе корня цикория — растения с тысячелетней историей в медицине. До 70% инулина делает цикорий одним из самых сильных природных пребиотиков: здоровый микробиом кишечника — ключ к иммунитету.",
      uz: "Tibbiyotda ming yillik tarixga ega sikoriy ildizi asosidagi chaynaladigan tabletkalar. 70% gacha inulin sikoriyni eng kuchli tabiiy prebiotiklardan biriga aylantiradi: sog‘lom ichak mikrobiomi — immunitet kaliti.",
    },
    purpose: {
      ru: [
        "Иммунитет через микробиом кишечника",
        "Спокойная нервная система и сон",
        "Поддержка уровня сахара и холестерина",
        "Мягкое очищение кишечника",
        "Контроль веса и поддержка печени",
      ],
      uz: [
        "Ichak mikrobiomi orqali immunitet",
        "Tinch asab tizimi va uyqu",
        "Qand va xolesterin darajasini qo‘llab-quvvatlash",
        "Ichaklarni yumshoq tozalash",
        "Vazn nazorati va jigarni qo‘llab-quvvatlash",
      ],
    },
    components: {
      ru: [
        { name: "Инулин цикория (до 70%)", desc: "пребиотик №1 — питание для полезной микрофлоры" },
        { name: "Хлорогеновая кислота", desc: "антиоксидант, защита сосудов" },
        { name: "Лактуцин и лактукопикрин", desc: "горечи, стимулирующие пищеварение и работу печени" },
        { name: "Витамины C, E, группы B", desc: "иммунитет и нервная система" },
        { name: "Минеральный комплекс", desc: "калий, кальций, магний, железо, цинк, марганец" },
      ],
      uz: [
        { name: "Sikoriy inulini (70% gacha)", desc: "№1 prebiotik — foydali mikroflora uchun ozuqa" },
        { name: "Xlorogen kislotasi", desc: "antioksidant, tomirlar himoyasi" },
        { name: "Laktutsin va laktukopikrin", desc: "hazm va jigar faoliyatini rag‘batlantiruvchi achchiq moddalar" },
        { name: "C, E, B guruhi vitaminlari", desc: "immunitet va asab tizimi" },
        { name: "Minerallar majmuasi", desc: "kaliy, kalsiy, magniy, temir, rux, marganets" },
      ],
    },
    usage: {
      ru: "По 1–2 раза в день. Иммунитет — это не таблетка, а ежедневная забота о кишечнике и микробиоме.",
      uz: "Kuniga 1–2 marta. Immunitet — bu tabletka emas, balki ichak va mikrobiom haqidagi kundalik g‘amxo‘rlik.",
    },
    form: { ru: "Жевательные таблетки", uz: "Chaynaladigan tabletkalar" },
    volume: "15 г",
    count: { ru: "50 таблеток × 0,3 г", uz: "50 tabletka × 0,3 g" },
    insured: true,
  },
  {
    id: "tongyuan",
    category: "tablets",
    image: "/images/products/product-25.webp",
    catalogPage: 19,
    element: "water",
    cn: "同源琼青 · 牛骨髓肽压片糖果",
    latin: "Tong Yuan",
    name: { ru: "«Тун Юань» — пептиды костного мозга", uz: "«Tun Yuan» — suyak miyasi peptidlari" },
    tagline: { ru: "Клеточное питание · Life Maintenance", uz: "Hujayra ozuqasi · Life Maintenance" },
    short: {
      ru: "Комплекс на основе пептидов костного мозга — биологически близкого организму источника питания для клеток. Концепция «Тун Юань» (同源): питать организм компонентами, родственными его собственным.",
      uz: "Suyak miyasi peptidlari asosidagi kompleks — organizmga biologik jihatdan yaqin hujayra ozuqasi manbai. «Tun Yuan» (同源) konsepsiyasi: organizmni o‘ziga o‘xshash komponentlar bilan oziqlantirish.",
    },
    purpose: {
      ru: [
        "Обновление клеток и тканей",
        "Питание костного мозга",
        "Поддержка кроветворения",
        "Восстановление после болезней и нагрузок",
        "Крепкие кости, связки и иммунитет",
      ],
      uz: [
        "Hujayra va to‘qimalarning yangilanishi",
        "Suyak miyasini oziqlantirish",
        "Qon hosil bo‘lishini qo‘llab-quvvatlash",
        "Kasallik va yuklamalardan keyin tiklanish",
        "Mustahkam suyak, bog‘lam va immunitet",
      ],
    },
    components: {
      ru: [
        { name: "Пептиды костного мозга", desc: "факторы роста, аминокислоты и пептиды, поддерживающие кроветворную ткань" },
        { name: "Активные факторы кроветворения", desc: "поддержка выработки эритроцитов, лейкоцитов и тромбоцитов" },
        { name: "Коллагеновые пептиды", desc: "суставы, кости и соединительная ткань" },
        { name: "Органические минералы", desc: "кальций, фосфор и магний в биодоступной форме" },
      ],
      uz: [
        { name: "Suyak miyasi peptidlari", desc: "qon hosil qiluvchi to‘qimani qo‘llab-quvvatlovchi o‘sish omillari, aminokislotalar va peptidlar" },
        { name: "Faol qon hosil qiluvchi omillar", desc: "eritrotsit, leykotsit va trombotsitlar hosil bo‘lishini qo‘llab-quvvatlash" },
        { name: "Kollagen peptidlari", desc: "bo‘g‘imlar, suyaklar va biriktiruvchi to‘qima" },
        { name: "Organik minerallar", desc: "biomavjud shakldagi kalsiy, fosfor va magniy" },
      ],
    },
    usage: {
      ru: "Полный курс — 3 месяца, 2–3 курса в год.",
      uz: "To‘liq kurs — 3 oy, yiliga 2–3 kurs.",
    },
    form: { ru: "Прессованные таблетки", uz: "Presslangan tabletkalar" },
    volume: "81 г",
    count: { ru: "90 таблеток × 0,9 г", uz: "90 tabletka × 0,9 g" },
    course: { ru: "3 месяца", uz: "3 oy" },
    insured: true,
  },
  {
    id: "shanlineng-bone-collagen",
    category: "powders",
    image: "/images/products/product-14.webp",
    catalogPage: 9,
    element: "earth",
    cn: "膳力能 · 骨胶原蛋白肽粉固体饮料",
    latin: "Shan Li Neng",
    name: { ru: "«Шань Ли Нэн» — костный коллаген", uz: "«Shan Li Nen» — suyak kollageni" },
    tagline: { ru: "Коллагеновый пептид · Кокосовый вкус", uz: "Kollagen peptidi · Kokos ta’mi" },
    short: {
      ru: "Функциональный порошковый напиток с костным коллагеновым пептидом. Удобный стик 10 г — растворите в горячей воде, и тёплый напиток со вкусом кокоса готов. Около 30% коллагена в теле приходится на кости и хрящи — с возрастом его запас нужно поддерживать.",
      uz: "Suyak kollagen peptidi qo‘shilgan funksional kukunli ichimlik. Qulay 10 g stik — issiq suvda eriting, kokos ta’mli iliq ichimlik tayyor. Tanadagi kollagenning qariyb 30% suyak va tog‘aylarga to‘g‘ri keladi — yoshi ulg‘aygan sari uni to‘ldirib turish kerak.",
    },
    purpose: {
      ru: [
        "Активный образ жизни в любом возрасте",
        "Здоровье суставов, коленей и позвоночника",
        "Крепкие кости, меньше риска переломов",
        "Лёгкость и подвижность суставов",
        "Быстрое восстановление после нагрузок",
      ],
      uz: [
        "Har qanday yoshda faol hayot tarzi",
        "Bo‘g‘im, tizza va umurtqa salomatligi",
        "Mustahkam suyaklar, sinish xavfi kamroq",
        "Bo‘g‘imlarning yengilligi va harakatchanligi",
        "Yuklamadan keyin tez tiklanish",
      ],
    },
    components: {
      ru: [
        { name: "Костный коллагеновый пептид", desc: "получен ферментативным гидролизом — легко усваивается" },
        { name: "Порошок морских водорослей", desc: "кальций, магний, йод и микроэлементы" },
        { name: "Кокосовый порошок", desc: "MCT-жиры, быстрый источник энергии и мягкий вкус" },
        { name: "Кристаллическая фруктоза", desc: "натуральная сладость без резкого подъёма сахара" },
      ],
      uz: [
        { name: "Suyak kollagen peptidi", desc: "fermentativ gidroliz orqali olingan — oson so‘riladi" },
        { name: "Dengiz suvo‘tlari kukuni", desc: "kalsiy, magniy, yod va mikroelementlar" },
        { name: "Kokos kukuni", desc: "MCT-yog‘lar, tez energiya manbai va yumshoq ta’m" },
        { name: "Kristall fruktoza", desc: "qondagi shakarni keskin ko‘tarmaydigan tabiiy shirinlik" },
      ],
    },
    usage: {
      ru: "1 стик на 150 мл горячей воды, размешать и выпить тёплым. Лучшее время — утром до завтрака или между приёмами пищи.",
      uz: "1 stikni 150 ml issiq suvda eriting, aralashtiring va iliq holda iching. Eng yaxshi vaqt — ertalab nonushtadan oldin yoki ovqatlar orasida.",
    },
    form: { ru: "Порошковый напиток", uz: "Kukunli ichimlik" },
    volume: "200 г",
    count: { ru: "20 стиков × 10 г", uz: "20 stik × 10 g" },
    standard: "GB/T 29602",
  },
  {
    id: "shanlineng-joint",
    category: "powders",
    image: "/images/products/product-15.webp",
    catalogPage: 11,
    element: "water",
    cn: "膳力能 · 全关节全骨营养基粉",
    latin: "Shan Li Neng",
    name: { ru: "«Шань Ли Нэн» — комплекс для суставов и костей", uz: "«Shan Li Nen» — bo‘g‘im va suyaklar kompleksi" },
    tagline: { ru: "Формула 5-в-1 · Коллаген II типа", uz: "5-in-1 formula · II tur kollagen" },
    short: {
      ru: "Питательный порошок для всего опорно-двигательного аппарата: коллаген II типа, хондроитин, глюкозамин, гиалуроновая кислота и минералы. «Строительный материал» для суставов, хрящей и костей.",
      uz: "Butun tayanch-harakat apparati uchun ozuqa kukuni: II tur kollagen, xondroitin, glyukozamin, gialuron kislotasi va minerallar. Bo‘g‘im, tog‘ay va suyaklar uchun «qurilish materiali».",
    },
    purpose: {
      ru: [
        "Меньше дискомфорта в суставах после нагрузок",
        "Подвижность и амплитуда движений",
        "Быстрое восстановление после спорта",
        "Эластичность и «износостойкость» суставов",
        "Поддержка при лишнем весе и после 35",
      ],
      uz: [
        "Yuklamadan keyin bo‘g‘imlarda kamroq noqulaylik",
        "Harakatchanlik va harakat amplitudasi",
        "Sportdan keyin tez tiklanish",
        "Bo‘g‘imlarning elastikligi va chidamliligi",
        "Ortiqcha vazn va 35 yoshdan keyin qo‘llab-quvvatlash",
      ],
    },
    components: {
      ru: [
        { name: "Коллаген II типа", desc: "основной белок хрящей и сухожилий" },
        { name: "Хондроитин + глюкозамин", desc: "строительный материал хрящевой ткани" },
        { name: "Гиалуроновая кислота", desc: "смазка и амортизация суставов" },
        { name: "Кальций + магний", desc: "прочность костей, поддержка мышц" },
        { name: "Костные экстракты + трегалоза", desc: "состав, близкий к костной ткани" },
        { name: "Микропорошковая технология", desc: "быстрое растворение и усвоение" },
      ],
      uz: [
        { name: "II tur kollagen", desc: "tog‘ay va paylarning asosiy oqsili" },
        { name: "Xondroitin + glyukozamin", desc: "tog‘ay to‘qimasining qurilish materiali" },
        { name: "Gialuron kislotasi", desc: "bo‘g‘imlarning moylanishi va amortizatsiyasi" },
        { name: "Kalsiy + magniy", desc: "suyaklar mustahkamligi, mushaklarni qo‘llab-quvvatlash" },
        { name: "Suyak ekstraktlari + tregaloza", desc: "suyak to‘qimasiga yaqin tarkib" },
        { name: "Mikrokukun texnologiyasi", desc: "tez erish va so‘rilish" },
      ],
    },
    usage: {
      ru: "1 саше на 150 мл горячей воды, 1–2 раза в день — утром натощак или между приёмами пищи. Курс 1–3 месяца.",
      uz: "1 sashe 150 ml issiq suvga, kuniga 1–2 marta — ertalab och qoringa yoki ovqatlar orasida. Kurs 1–3 oy.",
    },
    form: { ru: "Порошок в саше", uz: "Sashedagi kukun" },
    volume: "120 г",
    count: { ru: "20 саше × 6 г", uz: "20 sashe × 6 g" },
    course: { ru: "1–3 месяца", uz: "1–3 oy" },
  },
  {
    id: "shanlineng-flax",
    category: "powders",
    image: "/images/products/product-13.webp",
    catalogPage: 12,
    element: "earth",
    cn: "膳力能 · 亚麻籽胶原蛋白肽粉",
    latin: "Shan Li Neng",
    name: { ru: "«Шань Ли Нэн» — льняной коллаген", uz: "«Shan Li Nen» — zig‘ir kollageni" },
    tagline: { ru: "Коллаген · Клетчатка · Контроль веса", uz: "Kollagen · Kletchatka · Vazn nazorati" },
    short: {
      ru: "Многофункциональный напиток на основе семян льна и костного коллагена. Три задачи в одном стике: коллаген для кожи и суставов, клетчатка для пищеварения и долгое чувство сытости.",
      uz: "Zig‘ir urug‘i va suyak kollageni asosidagi ko‘p funksiyali ichimlik. Bitta stikda uchta vazifa: teri va bo‘g‘imlar uchun kollagen, hazm uchun kletchatka va uzoq to‘yinganlik.",
    },
    purpose: {
      ru: [
        "Долгое чувство сытости",
        "Профилактика сердечно-сосудистых рисков",
        "Замена нерегулярных перекусов",
        "Поддержка обмена веществ",
        "Коллаген для кожи и суставов",
      ],
      uz: [
        "Uzoq muddatli to‘yinganlik",
        "Yurak-qon tomir xavflarining oldini olish",
        "Noto‘g‘ri ovqatlanish o‘rnini bosish",
        "Moddalar almashinuvini qo‘llab-quvvatlash",
        "Teri va bo‘g‘imlar uchun kollagen",
      ],
    },
    components: {
      ru: [
        { name: "Семена льна", desc: "омега-жирные кислоты и клетчатка" },
        { name: "Костный коллагеновый пептид", desc: "малая молекула — максимальное усвоение" },
        { name: "Белая фасоль", desc: "ингибиторы альфа-амилазы — меньше усвоенных быстрых углеводов" },
        { name: "Кальций + магний", desc: "кости и мышцы" },
        { name: "Киноа · овёс · татарская гречиха", desc: "медленные углеводы, клетчатка и растительные белки" },
        { name: "Микропомол", desc: "сохраняет активные вещества и быстро растворяется" },
      ],
      uz: [
        { name: "Zig‘ir urug‘i", desc: "omega yog‘ kislotalari va kletchatka" },
        { name: "Suyak kollagen peptidi", desc: "kichik molekula — maksimal so‘rilish" },
        { name: "Oq loviya", desc: "alfa-amilaza ingibitorlari — kamroq tez uglevod so‘riladi" },
        { name: "Kalsiy + magniy", desc: "suyak va mushaklar" },
        { name: "Kinoa · suli · tatar grechixasi", desc: "sekin uglevodlar, kletchatka va o‘simlik oqsillari" },
        { name: "Mikromaydalash", desc: "faol moddalarni saqlaydi va tez eriydi" },
      ],
    },
    usage: {
      ru: "1 стик на 150 мл горячей воды, 1–2 раза в день — утром натощак или между приёмами пищи.",
      uz: "1 stik 150 ml issiq suvga, kuniga 1–2 marta — ertalab och qoringa yoki ovqatlar orasida.",
    },
    form: { ru: "Порошковый напиток", uz: "Kukunli ichimlik" },
    volume: "300 г",
    count: { ru: "10 стиков × 30 г", uz: "10 stik × 30 g" },
    standard: "GB/T 29602",
  },
  {
    id: "tianrancui",
    category: "powders",
    image: "/images/products/product-19.webp",
    catalogPage: 13,
    element: "metal",
    cn: "添然萃 · 二氢槲皮素复合植物饮",
    latin: "Tian Ran Cui",
    name: { ru: "«Тянь Жань Цуй» — растительный напиток с DNQ", uz: "«Tyan Jan Suy» — DNQ o‘simlik ichimligi" },
    tagline: { ru: "Горло и дыхание · Дигидрокверцетин", uz: "Tomoq va nafas · Digidrokversetin" },
    short: {
      ru: "Многофункциональный напиток из 12 растительных компонентов, мёда и фруктовых концентратов. Дигидрокверцетин (DNQ) — сильный антиоксидант; в отличие от леденцов и спреев, напиток увлажняет слизистую и помогает при сухости и першении.",
      uz: "12 o‘simlik komponenti, asal va meva konsentratlaridan tayyorlangan ko‘p funksiyali ichimlik. Digidrokversetin (DNQ) — kuchli antioksidant; tomoq konfetlari va spreylardan farqli o‘laroq, ichimlik shilliq qavatni namlaydi, quruqlik va qichishishda yordam beradi.",
    },
    purpose: {
      ru: [
        "Защита слизистой при сухости воздуха",
        "Меньше дискомфорта и першения в горле",
        "Увлажнение и очищение дыхательных путей",
        "Поддержка голоса при нагрузке",
        "Антиоксидантная поддержка и микроциркуляция",
      ],
      uz: [
        "Quruq havoda shilliq qavatni himoya qilish",
        "Tomoqdagi noqulaylik va qichishishning kamayishi",
        "Nafas yo‘llarini namlash va tozalash",
        "Yuklamada ovozni qo‘llab-quvvatlash",
        "Antioksidant qo‘llab-quvvatlash va mikrosirkulyatsiya",
      ],
    },
    components: {
      ru: [
        { name: "Дигидрокверцетин (DNQ)", desc: "сильный антиоксидант, поддерживает слизистые и микроциркуляцию" },
        { name: "Дендробиум и амла", desc: "увлажнение слизистой и поддержка иммунитета" },
        { name: "Бузина, хмель, мята", desc: "смягчают горло и облегчают дыхание" },
        { name: "Фруктовые концентраты", desc: "груша, бойзенова ягода, зелёное яблоко, овёс — мягкость и приятный вкус" },
      ],
      uz: [
        { name: "Digidrokversetin (DNQ)", desc: "kuchli antioksidant, shilliq qavat va mikrosirkulyatsiyani qo‘llab-quvvatlaydi" },
        { name: "Dendrobium va amla", desc: "shilliq qavatni namlash va immunitetni qo‘llab-quvvatlash" },
        { name: "Buzina, qulmoq, yalpiz", desc: "tomoqni yumshatadi va nafas olishni yengillashtiradi" },
        { name: "Meva konsentratlari", desc: "nok, boysenberi, yashil olma, suli — yumshoqlik va yoqimli ta’m" },
      ],
    },
    usage: {
      ru: "Принимать после еды: 1 стик 1–2 раза в день. Курс 1–3 месяца.",
      uz: "Ovqatdan keyin qabul qiling: kuniga 1–2 marta 1 stik. Kurs 1–3 oy.",
    },
    form: { ru: "Жидкие стики", uz: "Suyuq stiklar" },
    volume: "300 мл",
    count: { ru: "12 стиков × 25 мл", uz: "12 stik × 25 ml" },
    course: { ru: "1–3 месяца", uz: "1–3 oy" },
  },
  {
    id: "oq-orxideya",
    category: "care",
    image: "/images/products/product-8.webp",
    catalogPage: 6,
    element: "metal",
    cn: "雪兰草",
    latin: "SulRanCho",
    name: { ru: "Спрей «Белая орхидея»", uz: "«Oq orxideya» spreyi" },
    tagline: { ru: "4 пептида · Фуллерен · Гиалуроновая кислота", uz: "4 peptid · Fulleren · Gialuron kislotasi" },
    short: {
      ru: "Многофункциональный спрей-уход для лица «5 в 1»: увлажнение, разглаживание, успокоение, плотность и сияние. Пептидная формула с фуллереном и гиалуроновой кислотой — для ежедневного ухода в любом возрасте.",
      uz: "Yuz uchun «5-in-1» ko‘p funksiyali sprey-parvarish: namlash, tekislash, tinchlantirish, zichlik va yorqinlik. Fulleren va gialuron kislotali peptid formulasi — har qanday yoshdagi kundalik parvarish uchun.",
    },
    purpose: {
      ru: [
        "Разглаживает морщины и мелкие линии",
        "Глубоко увлажняет",
        "Успокаивает кожу, снижает покраснения и раздражение",
        "Повышает эластичность и плотность",
        "Выравнивает тон и возвращает сияние",
      ],
      uz: [
        "Ajinlar va mayda chiziqlarni tekislaydi",
        "Chuqur namlaydi",
        "Terini tinchlantiradi, qizarish va ta’sirchanlikni kamaytiradi",
        "Elastiklik va zichlikni oshiradi",
        "Rangni tekislaydi va yorqinlik qaytaradi",
      ],
    },
    components: {
      ru: [
        { name: "Фуллерен", desc: "мощный антиоксидант, защита от преждевременного старения" },
        { name: "Ацетил гексапептид-8", desc: "«мягкий ботокс»: расслабляет мимические мышцы" },
        { name: "Пальмитоил пентапептид-4", desc: "стимулирует выработку собственного коллагена" },
        { name: "Гиалуроновая кислота", desc: "удерживает влагу и разглаживает" },
        { name: "Ниацинамид + витамин C", desc: "выравнивают тон, сужают поры, осветляют пигментацию" },
      ],
      uz: [
        { name: "Fulleren", desc: "kuchli antioksidant, erta qarishdan himoya" },
        { name: "Atsetil geksapeptid-8", desc: "«yumshoq botoks»: mimika mushaklarini bo‘shashtiradi" },
        { name: "Palmitoil pentapeptid-4", desc: "o‘z kollagenini ishlab chiqarishni rag‘batlantiradi" },
        { name: "Gialuron kislotasi", desc: "namlikni saqlaydi va tekislaydi" },
        { name: "Niatsinamid + C vitamini", desc: "rangni tekislaydi, teshikchalarni toraytiradi, pigmentatsiyani yoritadi" },
      ],
    },
    usage: {
      ru: "Распылять на очищенную кожу лица утром и вечером, а также в течение дня для увлажнения.",
      uz: "Tozalangan yuz terisiga ertalab va kechqurun, shuningdek kun davomida namlash uchun purkang.",
    },
    form: { ru: "Спрей-мист для лица", uz: "Yuz uchun sprey-mist" },
    volume: "120 мл",
    standard: "QB/T 2660",
  },
  {
    id: "keleshu",
    category: "care",
    image: "/images/products/product-30.webp",
    catalogPage: 10,
    element: "fire",
    name: { ru: "Массажный крем «Кэлешу»", uz: "«Keleshu» massaj kremi" },
    tagline: { ru: "8 эфирных масел · Двойное действие", uz: "8 efir moyi · Ikki yo‘nalishli ta’sir" },
    short: {
      ru: "Растительный массажный крем на основе восьми чистых эфирных масел и экстрактов китайских трав. Двойное действие: сначала снимает напряжение и дискомфорт, затем даёт глубокое тепло и расслабление, улучшая микроциркуляцию.",
      uz: "Sakkiz xil toza efir moyi va xitoy giyohlari ekstraktlari asosidagi o‘simlik massaj kremi. Ikki yo‘nalishli ta’sir: avval taranglik va noqulaylikni yengillashtiradi, so‘ng chuqur issiqlik va bo‘shashish beradi, mikroqon aylanishini yaxshilaydi.",
    },
    purpose: {
      ru: [
        "Напряжение в мышцах и суставах",
        "Шея, спина, поясница и плечи после дня за компьютером",
        "Разогрев перед тренировкой и восстановление после",
        "Микроциркуляция, отёки и усталость ног",
        "Ежедневный уход за суставами",
      ],
      uz: [
        "Mushak va bo‘g‘imlardagi taranglik",
        "Kompyuter oldidagi kundan keyin bo‘yin, orqa, bel va yelka",
        "Mashg‘ulotdan oldin isitish va keyin tiklanish",
        "Mikroqon aylanishi, shish va oyoq charchog‘i",
        "Bo‘g‘imlar uchun kundalik parvarish",
      ],
    },
    components: {
      ru: [
        { name: "8 чистых эфирных масел", desc: "натуральный комплекс с расслабляющим и разогревающим действием" },
        { name: "Экстракты китайских трав", desc: "по традиции ТКМ — «открывают меридианы» и активизируют кровообращение" },
        { name: "Растительная основа", desc: "сначала снимает дискомфорт, затем даёт глубокое тепло" },
        { name: "Лёгкая текстура", desc: "быстро впитывается, не оставляет жирного следа, подходит для массажа" },
      ],
      uz: [
        { name: "8 xil toza efir moyi", desc: "bo‘shashtiruvchi va isituvchi ta’sirli tabiiy kompleks" },
        { name: "Xitoy giyohlari ekstraktlari", desc: "TKM an’anasiga ko‘ra — «meridianlarni ochadi» va qon aylanishini faollashtiradi" },
        { name: "O‘simlik asosi", desc: "avval noqulaylikni yengillashtiradi, so‘ng chuqur issiqlik beradi" },
        { name: "Yengil tekstura", desc: "tez singadi, yog‘li iz qoldirmaydi, massaj uchun qulay" },
      ],
    },
    usage: {
      ru: "Нанести небольшое количество на нужную зону и массировать до полного впитывания. Применять 2–3 раза в день или перед и после физической нагрузки.",
      uz: "Oz miqdorda kerakli sohaga surting va to‘liq singiguncha massaj qiling. Kuniga 2–3 marta yoki jismoniy yuklamadan oldin va keyin qo‘llang.",
    },
    form: { ru: "Крем в тубе", uz: "Tubadagi krem" },
    volume: "2 × 68 г",
    insured: true,
  },
  {
    id: "yuanyun",
    category: "special",
    image: "/images/products/product-28.webp",
    catalogPage: 7,
    element: "metal",
    cn: "媛韵牌 · 苦参抑菌液",
    latin: "Yuanyun",
    name: { ru: "Карандаш для глаз «Юаньюнь»", uz: "«Yuanyun» ko‘z qalami" },
    tagline: { ru: "Софора · Ментол · Формула ТКМ", uz: "Sofora · Mentol · TKM formulasi" },
    short: {
      ru: "Компактный золотой карандаш с растительным антибактериальным раствором на основе корня софоры и ментола. Для тех, кто много времени проводит за экраном: снимает ощущение сухости и «песка», охлаждает и освежает.",
      uz: "Sofora ildizi va mentol asosidagi o‘simlik antibakterial eritmali ixcham oltin qalam. Ekran oldida ko‘p vaqt o‘tkazadiganlar uchun: quruqlik va «qum» hissini olib tashlaydi, sovutadi va yangilaydi.",
    },
    purpose: {
      ru: [
        "Усталость глаз после долгой работы за экраном",
        "Более 6 часов в день перед цифровыми устройствами",
        "Сухость и ощущение «песка» в глазах",
        "Покраснение и раздражение век",
        "Дискомфорт при ношении контактных линз",
      ],
      uz: [
        "Ekran oldida uzoq ishlashdan keyingi ko‘z charchog‘i",
        "Raqamli qurilmalar oldida kuniga 6 soatdan ortiq",
        "Ko‘zlarda quruqlik va «qum» hissi",
        "Qovoqlarning qizarishi va ta’sirlanishi",
        "Kontakt linzalardan noqulaylik",
      ],
    },
    components: {
      ru: [
        { name: "Экстракт корня софоры (苦参)", desc: "традиционный антибактериальный компонент ТКМ, снижает воспаление и зуд" },
        { name: "Ментол (薄荷)", desc: "мгновенное охлаждение, свежесть и ясность взгляда" },
        { name: "Растительные экстракты", desc: "смягчают раздражение после нагрузки и внешних факторов" },
        { name: "Увлажняющий комплекс", desc: "глубокое увлажнение нежной кожи вокруг глаз" },
      ],
      uz: [
        { name: "Sofora ildizi ekstrakti (苦参)", desc: "TKMning an’anaviy antibakterial komponenti, yallig‘lanish va qichishishni kamaytiradi" },
        { name: "Mentol (薄荷)", desc: "zudlik bilan sovutish, yangilik va nigoh ravshanligi" },
        { name: "O‘simlik ekstraktlari", desc: "yuklama va tashqi omillardan keyingi ta’sirlanishni yumshatadi" },
        { name: "Namlovchi kompleks", desc: "ko‘z atrofidagi nozik terini chuqur namlaydi" },
      ],
    },
    usage: {
      ru: "Использовать без капель и растирания — 2–3 раза в день. Ясный и чистый взгляд за секунды.",
      uz: "Tomizmasdan va ishqalamasdan — kuniga 2–3 marta. Bir necha soniyada ravshan va tiniq nigoh.",
    },
    form: { ru: "Карандаш-аппликатор", uz: "Qalam-applikator" },
    volume: "10 мл",
    insured: true,
  },
  {
    id: "yishayanmei",
    category: "special",
    image: "/images/products/product-27.webp",
    catalogPage: 8,
    element: "water",
    cn: "伊莎妍美 · 抑菌液",
    latin: "Yishayanmei",
    name: { ru: "Комплекс «Ишаянмэй»", uz: "«Ishayanmey» kompleksi" },
    tagline: { ru: "PHMB · Лактобактерии · Травы ТКМ", uz: "PHMB · Laktobakteriyalar · TKM giyohlari" },
    short: {
      ru: "Инновационные фитокапсулы для деликатной интимной гигиены. Мягкий антибактериальный комплекс в сочетании с традиционными травами ТКМ (воробейник, хризантема, клюква) поддерживает чистоту, комфорт и естественное восстановление микрофлоры. Универсально для женщин, мужчин и пар.",
      uz: "Nozik intim gigiyena uchun innovatsion fitokapsulalar. Yumshoq antibakterial kompleks an’anaviy TKM giyohlari (vorobeynik, xrizantema, klyukva) bilan birgalikda tozalik, qulaylik va mikrofloraning tabiiy tiklanishini qo‘llab-quvvatlaydi. Ayollar, erkaklar va juftliklar uchun universal.",
    },
    purpose: {
      ru: [
        "Естественное восстановление микрофлоры",
        "Мягкий уход при раздражении слизистой",
        "Ежедневная интимная гигиена премиум-уровня",
        "Комфорт и свежесть",
        "Забота о репродуктивном здоровье",
      ],
      uz: [
        "Mikrofloraning tabiiy tiklanishi",
        "Shilliq qavat ta’sirlanganda yumshoq parvarish",
        "Premium darajadagi kundalik intim gigiyena",
        "Qulaylik va tozalik",
        "Reproduktiv salomatlik haqida g‘amxo‘rlik",
      ],
    },
    components: {
      ru: [
        { name: "PHMB", desc: "современный безопасный антибактериальный компонент, не нарушает защитный барьер" },
        { name: "Лактобактерии и пребиотики", desc: "восстанавливают микрофлору" },
        { name: "Экстракт клюквы (蔓越莓)", desc: "препятствует прикреплению бактерий к слизистой" },
        { name: "Воробейник (紫草)", desc: "классика ТКМ — смягчает микроповреждения" },
        { name: "Хризантема (菊花)", desc: "снижает раздражение и ощущение «жара»" },
      ],
      uz: [
        { name: "PHMB", desc: "zamonaviy xavfsiz antibakterial komponent, himoya to‘sig‘ini buzmaydi" },
        { name: "Laktobakteriyalar va prebiotiklar", desc: "mikroflorani tiklaydi" },
        { name: "Klyukva ekstrakti (蔓越莓)", desc: "bakteriyalarning shilliq qavatga yopishishiga to‘sqinlik qiladi" },
        { name: "Vorobeynik (紫草)", desc: "TKM klassikasi — mikroshikastlanishlarni yumshatadi" },
        { name: "Xrizantema (菊花)", desc: "ta’sirlanish va «issiqlik» hissini kamaytiradi" },
      ],
    },
    usage: {
      ru: "Курс — 10 дней, по 1 капсуле в день. Подробная инструкция — в упаковке.",
      uz: "Kurs — 10 kun, kuniga 1 kapsuladan. Batafsil yo‘riqnoma — qadoqda.",
    },
    form: { ru: "Фитокапсулы", uz: "Fitokapsulalar" },
    volume: "10 × 5,5 мл",
    count: { ru: "10 капсул", uz: "10 kapsula" },
    course: { ru: "10 дней", uz: "10 kun" },
    insured: true,
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (c: CategoryId) => products.filter((p) => p.category === c);
