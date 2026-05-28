type Translator = (key: string, options?: Record<string, string | number> & { defaultValue?: string }) => string;

export function categoryName(t: Translator, slug: string, fallback: string) {
  return t(`categories.${slug}.name`, { defaultValue: fallback });
}

export function categoryDescription(t: Translator, slug: string, fallback = '') {
  return t(`categories.${slug}.description`, { defaultValue: fallback });
}
