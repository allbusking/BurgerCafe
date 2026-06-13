export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-black";
    case "confirmed":
      return "bg-blue-500 text-white";
    case "preparing":
      return "bg-orange-500 text-white";
    case "ready":
      return "bg-green-500 text-white";
    case "delivered":
      return "bg-gray-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Order Received";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Being Prepared";
    case "ready":
      return "Ready for Pickup/Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

type OrderItem = {
  price: number;
  quantity?: number;
  qty?: number;
};

function roundToTwo(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateOrderTotals(items: OrderItem[]) {
  const subtotal = roundToTwo(
    items.reduce((sum, item) => sum + item.price * (item.quantity ?? item.qty ?? 1), 0),
  );
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const tax = roundToTwo(subtotal * 0.05);
  const total = roundToTwo(subtotal + deliveryFee + tax);

  return {
    subtotal,
    deliveryFee,
    tax,
    total,
  };
}
