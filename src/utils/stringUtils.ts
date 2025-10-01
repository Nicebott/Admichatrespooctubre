export function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return removeDiacritics(text.toLowerCase().trim());
}