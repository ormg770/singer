import copy from "@/public/pixel-perfect/copy.json";
export type Language = "en" | "es";
export { copy };
export function resolveLanguage(value: string | null | undefined): Language {
  return value?.toLowerCase().startsWith("es") ? "es" : "en";
}
export function acceptedLanguage(value: string | null): Language {
  const choices = (value || "en")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag, index, q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((v) => v.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { tag } of choices) {
    if (/^es(?:-|$)/i.test(tag)) return "es";
    if (/^en(?:-|$)/i.test(tag)) return "en";
  }
  return "en";
}
