export type ServiceId = "basic" | "system" | "complex" | "custom";

export type Service = {
  id: ServiceId;
  title: string;
  short: string;
  description: string;
  /** Price in RUB; null = individual pricing */
  priceRub: number | null;
  durationHint: string;
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    id: "basic",
    title: "Базовая консультация",
    short: "Разбор задачи и план действий",
    description:
      "Короткий созвон: уточняем симптомы, проверяем настройки, даём пошаговые рекомендации и понятный план, что делать дальше.",
    priceRub: 250,
    durationHint: "до 20 минут",
    bullets: [
      "подсказки по Windows / macOS",
      "проверка типовых настроек",
      "решение простых ошибок без сложной настройки",
    ],
  },
  {
    id: "system",
    title: "Настройка системы",
    short: "Стабильная работа ПК или ноутбука",
    description:
      "Оптимизируем автозагрузку, обновления, драйверы и типовые параметры безопасности; наводим порядок в базовых службах, чтобы система откликалась быстрее.",
    priceRub: 990,
    durationHint: "до 60 минут",
    bullets: [
      "ускорение старта и работы без переустановки ОС",
      "настройка учётных записей и резервного копирования (по запросу)",
      "памятка по поддержанию результата",
    ],
  },
  {
    id: "complex",
    title: "Комплексная помощь",
    short: "Полный цикл: от диагностики до результата",
    description:
      "Глубокая удалённая диагностика, устранение типовых сбоев, установка и настройка программ, мессенджеров, почты, базовая работа с сайтом и хостингом — в рамках одного сеанса.",
    priceRub: 1990,
    durationHint: "до 2 часов",
    bullets: [
      "пошаговое сопровождение на вашем экране",
      "фиксация итогов и короткий отчёт",
      "приоритетная связь в день работ",
    ],
  },
  {
    id: "custom",
    title: "Индивидуальный тариф",
    short: "Смета после короткого описания задачи",
    description:
      "Нестандартные сценарии, обучение, регулярное сопровождение или несколько устройств. Оценим объём и стоимость до начала работ.",
    priceRub: null,
    durationHint: "по согласованию",
    bullets: [
      "персональный план и сроки",
      "прозрачная стоимость до оплаты",
      "возможность разбить работу на этапы",
    ],
  },
];

export function getService(id: ServiceId): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function formatPrice(rub: number | null): string {
  if (rub === null) return "По запросу";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(rub);
}
