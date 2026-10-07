const BASE = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

export type Bank = { slug: string; name: string; website_url: string };

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  product_count: number;
  key_risks?: string[];
};

export type FlowStep = { title: string; description: string; icon: string };

export type Product = {
  slug: string;
  name: string;
  summary: string;
  bank: Bank;
  category: { slug: string; name: string; icon: string };
  currency: string;
  min_amount: number;
  max_amount: number | null;
  min_term_days: number | null;
  max_term_days: number | null;
  risk_level: number;
  return_type: string;
  return_info: string;
  verified: boolean;
  fetched_at: string;
};

export type ProductDetail = Product & {
  fees: string | null;
  features: string[];
  flow_steps: FlowStep[];
  key_risks: string[];
  source_label: string;
  source_url: string;
  official_url: string;
};

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API hatası ${res.status}: ${path}`);
  return res.json();
}

export const getCategories = () => get<Category[]>("/api/categories");
export const getCategory = (slug: string) => get<Category>(`/api/categories/${slug}`);
export const getBanks = () => get<Bank[]>("/api/banks");
export const getProduct = (slug: string) => get<ProductDetail>(`/api/products/${slug}`);

export const getProducts = (params: Record<string, string | undefined>) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  return get<Product[]>(`/api/products?${qs.toString()}`);
};

export const getCompare = (slugs: string[]) =>
  get<ProductDetail[]>(`/api/compare?slugs=${encodeURIComponent(slugs.join(","))}`);
