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
    title: "Старт доступа",
    short: "Вводный созвон и готовность к подключению",
    description:
      "Короткая консультация: разбираем ваш сценарий (дом, офис, поездки), проверяем совместимость устройств и даём понятный план подключения к защищённой инфраструктуре.",
    priceRub: 250,
    durationHint: "до 20 минут",
    bullets: [
      "рекомендации по безопасной работе в сети на ваших устройствах",
      "проверка базовых настроек перед выдачей доступа",
      "ответы на вопросы по шифрованию трафика и политике сервиса",
    ],
  },
  {
    id: "system",
    title: "Стандарт",
    short: "Подключение и настройка на 1–2 устройствах",
    description:
      "Пошаговое сопровождение: установка и настройка клиента, проверка соединения с защищённой сетью, базовая диагностика типовых сбоев.",
    priceRub: 990,
    durationHint: "до 60 минут",
    bullets: [
      "настройка доступа на компьютере или смартфоне (по согласованию)",
      "проверка устойчивости канала и корректности маршрутизации",
      "краткая памятка по использованию после подключения",
    ],
  },
  {
    id: "complex",
    title: "Расширенный",
    short: "Несколько устройств и приоритетная поддержка",
    description:
      "Для семьи или небольшой команды: подключение нескольких устройств, согласование политик доступа, углублённая настройка и приоритет на день обращения.",
    priceRub: 1990,
    durationHint: "до 2 часов",
    bullets: [
      "несколько профилей / устройств в рамках одного сеанса",
      "помощь с типовыми конфликтами сети и ПО",
      "приоритетный контакт в день оказания услуги",
    ],
  },
  {
    id: "custom",
    title: "Команда и организации",
    short: "Смета после описания задачи",
    description:
      "Корпоративные сценарии, несколько локаций, нестандартные требования к доступу или сопровождение — оценим объём и стоимость до начала работ.",
    priceRub: null,
    durationHint: "по согласованию",
    bullets: [
      "персональный план подключения и сроки",
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
