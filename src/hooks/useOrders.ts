import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabaseClient";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | string;

export type OrderRecord = {
  id: string;
  order_number?: string | null;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: string;
  delivery_address?: string | null;
  special_instructions?: string | null;
  items: unknown;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total_amount: number;
  payment_status: string;
  status: OrderStatus;
  created_at?: string;
  [key: string]: unknown;
};

type PlaceOrderData = {
  name: string;
  email: string;
  phone: string;
  deliveryType: string;
  address?: string | null;
  instructions?: string | null;
  items: unknown;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  userId: string | null;
};

export function usePlaceOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (orderData: PlaceOrderData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: orderData.userId,
          customer_name: orderData.name,
          customer_email: orderData.email,
          customer_phone: orderData.phone,
          delivery_type: orderData.deliveryType,
          delivery_address: orderData.address,
          special_instructions: orderData.instructions,
          items: orderData.items,
          subtotal: orderData.subtotal,
          delivery_fee: orderData.deliveryFee,
          tax: orderData.tax,
          total_amount: orderData.grandTotal,
          payment_status: "unpaid",
          status: "pending",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return data as OrderRecord;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Failed to place order.";
      setError(message);
      throw caughtError;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
}

export function useMyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders((data ?? []) as OrderRecord[]);
      setLoading(false);
    };

    fetchOrders();

    if (!user) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel(`my-orders-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setOrders((currentOrders) => [payload.new as OrderRecord, ...currentOrders]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as OrderRecord;
          setOrders((currentOrders) =>
            currentOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
          );
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { orders, loading };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async (showLoading = true) => {
      if (showLoading) setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setOrders([]);
        if (showLoading) setLoading(false);
        return;
      }

      setOrders((data ?? []) as OrderRecord[]);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as OrderRecord;
          setOrders((currentOrders) => [
            newOrder,
            ...currentOrders.filter((order) => order.id !== newOrder.id),
          ]);
          fetchOrders(false);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updatedOrder = payload.new as OrderRecord;
          setOrders((currentOrders) =>
            currentOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
          );
          fetchOrders(false);
        },
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "orders" }, () => {
        fetchOrders(false);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          fetchOrders(false);
        }
      });

    const fallbackRefresh = window.setInterval(() => {
      fetchOrders(false);
    }, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(fallbackRefresh);
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) throw error;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  return { orders, loading, updateOrderStatus };
}
