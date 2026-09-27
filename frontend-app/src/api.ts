const BASE_URL = import.meta.env.VITE_API_URL ||"http://localhost:3000";

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error("تعذر تحميل المنتجات");
  }
  return response.json();
}

export async function createOrder(orderData: {
  name: string;
  email: string;
  product: string;
  quantity: number;
}) {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error("تعذر إرسال الطلب");
  }
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("بيانات الدخول غير صحيحة");
  }
  return response.json();
}