import { useCallback, useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";

export type ProductRecord = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  category_id?: string | null;
  image_url?: string | null;
  is_available: boolean;
  is_featured?: boolean | null;
  is_bestseller?: boolean | null;
  badge?: string | null;
  categories?: unknown;
  created_at?: string;
  [key: string]: unknown;
};

export type ProductInput = {
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  category_id?: string | null;
  image_url?: string | null;
  is_available?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  badge?: string | null;
};

export type ProductUpdates = Partial<ProductInput>;

export function useAdminProducts() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const nextProducts = (data ?? []) as ProductRecord[];
      setProducts(nextProducts);
      return nextProducts;
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError : new Error("Failed to fetch products.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts().catch((error) => {
      console.error("Failed to fetch products:", error);
    });
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: ProductInput) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("products")
        .insert({
          name: productData.name,
          description: productData.description ?? null,
          price: productData.price,
          original_price: productData.original_price ?? null,
          category_id: productData.category_id ?? null,
          image_url: productData.image_url ?? null,
          is_available: productData.is_available ?? true,
          is_featured: productData.is_featured ?? false,
          is_bestseller: productData.is_bestseller ?? false,
          badge: productData.badge ?? null,
        })
        .select("*, categories(*)")
        .single();

      if (insertError) throw insertError;

      const createdProduct = data as ProductRecord;
      setProducts((currentProducts) => [createdProduct, ...currentProducts]);
      return createdProduct;
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError : new Error("Failed to add product.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: ProductUpdates) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select("*, categories(*)")
        .single();

      if (updateError) throw updateError;

      const updatedProduct = data as ProductRecord;
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === id ? updatedProduct : product)),
      );
      return updatedProduct;
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError : new Error("Failed to update product.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
      if (deleteError) throw deleteError;

      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError : new Error("Failed to delete product.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(
    async (id: string, currentStatus: boolean) => {
      return updateProduct(id, { is_available: !currentStatus });
    },
    [updateProduct],
  );

  const uploadProductImage = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const filePath = `products/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError : new Error("Failed to upload image.");
      setError(nextError);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
    uploadProductImage,
  };
}
