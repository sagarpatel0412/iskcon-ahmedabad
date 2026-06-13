import RazorpayCheckout from "react-native-razorpay";

export const openRazorpay = async (payment: any) => {
  const options = {
    key: payment.key,
    amount: payment.amount,
    currency: payment.currency,
    order_id: payment.razorpay_order_id,

    name: "ISKCON Ahmedabad",

    description: payment.description,

    theme: {
      color: "#c8902a",
    },
  };

  const result = await RazorpayCheckout.open(options);

  return result;
};