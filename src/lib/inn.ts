/** ИНН — для страницы реквизитов и подвала (требования ЮKassa). Только сервер. */
export function getInn(): string | undefined {
  const v = process.env.INN?.trim();
  return v || undefined;
}
