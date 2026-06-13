import { useEffect, useState } from "react";

import supabase from "../lib/supabaseClient";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean | null;
  sort_order?: number | null;
  [key: string]: unknown;
};

export type ProductRecord = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  category_id?: string | null;
  image_url?: string | null;
  is_available?: boolean | null;
  is_featured?: boolean | null;
  is_bestseller?: boolean | null;
  sort_order?: number | null;
  badge?: string | null;
  created_at?: string | null;
  categories?: CategoryRecord | null;
  [key: string]: unknown;
};

export function useProducts(categorySlug: string | null = null) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

      if (categorySlug !== null) {
        query = query.eq("categories.slug", categorySlug);
      }

      const { data, error: fetchError } = await query;

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError);
        setLoading(false);
        return;
      }

      setProducts((data ?? []) as ProductRecord[]);
      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  return { products, loading, error };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error("Failed to fetch featured products:", error);
        setLoading(false);
        return;
      }

      setProducts((data ?? []) as ProductRecord[]);
      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}

export function useBestsellers() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_bestseller", true)
        .eq("is_available", true)
        .order("sort_order", { ascending: true })
        .limit(6);

      if (!isMounted) return;

      if (error) {
        console.error("Failed to fetch bestsellers:", error);
        setLoading(false);
        return;
      }

      setProducts((data ?? []) as ProductRecord[]);
      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
        return;
      }

      setCategories((data ?? []) as CategoryRecord[]);
      setLoading(false);
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading };
}
