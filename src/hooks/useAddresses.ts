import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabaseClient";

export type AddressRecord = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
  created_at?: string | null;
  [key: string]: unknown;
};

type AddressData = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
};

type AddressUpdates = Partial<AddressData>;

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setAddresses([]);
      setLoading(false);
      return [];
    }

    const nextAddresses = (data ?? []) as AddressRecord[];
    setAddresses(nextAddresses);
    setLoading(false);
    return nextAddresses;
  };

  useEffect(() => {
    refetch();
  }, [user]);

  const clearDefaultAddresses = async () => {
    if (!user) throw new Error("You must be signed in to manage addresses.");

    const { error: updateError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    if (updateError) throw updateError;
  };

  const addAddress = async (addressData: AddressData) => {
    if (!user) throw new Error("You must be signed in to add an address.");

    setError("");

    try {
      if (addressData.is_default) {
        await clearDefaultAddresses();
      }

      const { data, error: insertError } = await supabase
        .from("addresses")
        .insert({
          ...addressData,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await refetch();
      return data as AddressRecord;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Failed to add address.";
      setError(message);
      throw caughtError;
    }
  };

  const updateAddress = async (id: string, updates: AddressUpdates) => {
    if (!user) throw new Error("You must be signed in to update an address.");

    setError("");

    try {
      if (updates.is_default) {
        await clearDefaultAddresses();
      }

      const { error: updateError } = await supabase
        .from("addresses")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await refetch();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Failed to update address.";
      setError(message);
      throw caughtError;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) throw new Error("You must be signed in to delete an address.");

    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      await refetch();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Failed to delete address.";
      setError(message);
      throw caughtError;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) throw new Error("You must be signed in to set a default address.");

    setError("");

    try {
      await clearDefaultAddresses();

      const { error: updateError } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await refetch();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Failed to set default address.";
      setError(message);
      throw caughtError;
    }
  };

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
