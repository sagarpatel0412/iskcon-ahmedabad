import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import { registerForEvent } from "./eventApi";
import {
  createEventPaymentOrder,
  verifyEventPayment,
} from "../api/eventPaymentApi";

export async function registerForEventFlow({
  event,
  answers,
  navigation,
}: {
  event: any;
  answers: any;
  navigation: any;
}) {
  if (!event?.uuid) {
    throw new Error("Event not found");
  }

  if (!event.is_paid) {
    await registerForEvent(event.uuid, {
      form_answers: answers,
    });

    Alert.alert("Success", "Registered successfully 🙏");
    navigation.navigate("MyRegistrations");
    return;
  }

  const orderRes = await createEventPaymentOrder(event.uuid);
  const { key, order, payment_uuid } = orderRes.data;

  const razorpayResult = await RazorpayCheckout.open({
    key,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    name: "ISKCON Ahmedabad",
    description: event.title,
    image: "https://iskconahmedabad.com/images/logo.png",
    theme: {
      color: "#c8902a",
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
  });

  await verifyEventPayment({
    payment_uuid,
    razorpay_order_id: razorpayResult.razorpay_order_id,
    razorpay_payment_id: razorpayResult.razorpay_payment_id,
    razorpay_signature: razorpayResult.razorpay_signature,
    form_answers: answers,
  });

  Alert.alert("Success", "Payment successful. Registered successfully 🙏");
  navigation.navigate("MyRegistrations");
}