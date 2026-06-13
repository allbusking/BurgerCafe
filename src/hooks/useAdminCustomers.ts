import { useEffect, useMemo, useState } from "react";

import { supabase } from "../lib/supabaseClient";

type ProfileRow = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  name?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

type CustomerOrderRow = {
  user_id?: string | null;
  customer_email?: string | null;
  total_amount?: number | null;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
};

function getProfileName(profile: ProfileRow) {
  return profile.full_name || profile.name || profile.email?.split("@")[0] || "Customer";
}

export function useAdminCustomers() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [orders, setOrders] = useState<CustomerOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCustomers = async () => {
      setLoading(true);
      const [profilesResult, ordersResult] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id, customer_email, total_amount"),
      ]);

      if (!isMounted) return;

      if (profilesResult.error) {
        console.error("Failed to fetch profiles:", profilesResult.error);
      } else {
        setProfiles((profilesResult.data ?? []) as ProfileRow[]);
      }

      if (ordersResult.error) {
        console.error("Failed to fetch customer orders:", ordersResult.error);
      } else {
        setOrders((ordersResult.data ?? []) as CustomerOrderRow[]);
      }

      setLoading(false);
    };

    fetchCustomers();

    const profilesChannel = supabase
      .channel("admin-profiles-inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          setProfiles((current) => [payload.new as ProfileRow, ...current]);
        },
      )
      .subscribe();

    const ordersChannel = supabase
      .channel("admin-customer-orders-inserts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const order = payload.new as CustomerOrderRow;
        setOrders((current) => [order, ...current]);
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const customers = useMemo<AdminCustomer[]>(() => {
    return profiles.map((profile) => {
      const email = profile.email ?? "";
      const customerOrders = orders.filter(
        (order) => order.user_id === profile.id || (!!email && order.customer_email === email),
      );
      const spent = customerOrders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);

      return {
        id: profile.id,
        name: getProfileName(profile),
        email,
        orders: customerOrders.length,
        spent,
      };
    });
  }, [orders, profiles]);

  return { customers, loading };
}
