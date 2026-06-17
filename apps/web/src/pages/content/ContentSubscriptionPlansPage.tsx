// src/pages/content/ContentSubscriptionPlansPage.tsx

import { useEffect, useState } from "react";
import { Crown, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { getSubscriptionPlans } from "../../services/contentPaymentService";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
} from "../../services/contentPaymentService";
import { getMySubscription } from "../../services/contentPaymentService";
import AppLoader from "../../components/common/AppLoader";

type SubscriptionPlan = {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billing_type: "monthly" | "yearly" | "one_time";
  access_type: "newsletter" | "journal" | "course" | "all";
  duration_days?: number;
  benefits?: string[];
  is_active: boolean;
};

export default function ContentSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingPlanId, setBuyingPlanId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const [plansRes, subRes] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
      ]);

      setPlans(plansRes?.data || []);

      const subData = subRes?.data?.subscription || subRes?.data || null;
      setActiveSubscription(subData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setBuyingPlanId(plan.id);

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Failed to load Razorpay");
      }

      const orderResponse = await createSubscriptionOrder(plan.uuid);

      console.log(orderResponse, "orderResponse");

      const orderData = orderResponse.data?.data || orderResponse.data;

      const paymentUuid = orderData.payment_uuid;
      const razorpayOrderId = orderData.order.id;

      console.log(razorpayOrderId, "razorpayOrderId");

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        order_id: razorpayOrderId,

        name: "ISKCON Ahmedabad",
        description: plan.name,

        handler: async (response: any) => {
          console.log("Razorpay success response:", response);

          await verifySubscriptionPayment({
            payment_uuid: paymentUuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Subscription activated successfully 🙏");
          fetchPlans();
        },

        theme: {
          color: "#ea580c",
        },
      });

      razorpay.on("payment.failed", (response: any) => {
        console.error(response);
        alert("Payment failed");
      });

      razorpay.open();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || error.message);
    } finally {
      setBuyingPlanId(null);
    }
  };

  const formatPrice = (plan: SubscriptionPlan) => {
    const symbol = plan.currency === "INR" ? "₹" : plan.currency;
    return `${symbol}${plan.amount}`;
  };

  const formatBilling = (type: SubscriptionPlan["billing_type"]) => {
    if (type === "monthly") return "Monthly";
    if (type === "yearly") return "Yearly";
    return "One Time";
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Content Subscriptions"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <Crown className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Content Subscription Plans
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Subscribe to journals, newsletters, courses, and spiritual content
            from ISKCON Ahmedabad.
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No plans available
            </h2>
            <p className="mt-2 text-slate-500">
              Subscription plans will appear here once they are created.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan =
                activeSubscription.active !== false
                  ? activeSubscription?.plan_name === plan.name ||
                    activeSubscription?.plan_type === plan.billing_type
                  : false;
              return (
                <div
                  key={plan.uuid || plan.id}
                  className={`relative rounded-3xl border p-6 shadow-sm transition ${
                    isCurrentPlan
                      ? "border-green-300 bg-gradient-to-b from-green-50 to-white"
                      : "border-orange-100 bg-white hover:-translate-y-1 hover:shadow-xl"
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                      Current Plan
                    </div>
                  )}
                  <br />

                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="pr-20">
                      <h2 className="text-xl font-extrabold text-slate-900">
                        {plan.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {plan.description ||
                          "Access premium devotional content."}
                      </p>
                    </div>

                    <div
                      className={`rounded-full p-3 ${
                        isCurrentPlan
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <Crown className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-end gap-1">
                      <span
                        className={`text-4xl font-extrabold ${
                          isCurrentPlan ? "text-green-700" : "text-orange-700"
                        }`}
                      >
                        {formatPrice(plan)}
                      </span>

                      <span className="pb-1 text-sm font-semibold text-slate-500">
                        / {formatBilling(plan.billing_type)}
                      </span>
                    </div>

                    {plan.duration_days && (
                      <p className="mt-2 text-sm text-slate-500">
                        Valid for {plan.duration_days} days
                      </p>
                    )}
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isCurrentPlan
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {formatBilling(plan.billing_type)}
                    </span>

                    {activeSubscription && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Premium Active
                      </span>
                    )}
                  </div>

                  <div className="mb-6 space-y-3">
                    {(plan.benefits?.length
                      ? plan.benefits
                      : [
                          "Premium devotional content",
                          "Access to selected journals/newsletters",
                          "Spiritual learning material",
                        ]
                    ).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            isCurrentPlan ? "text-green-600" : "text-orange-600"
                          }`}
                        />
                        <p className="text-sm text-slate-600">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan && activeSubscription?.end_date && (
                    <div className="mb-5 rounded-2xl bg-white p-4 text-sm shadow-sm">
                      <p className="font-bold text-slate-800">
                        Your plan is active
                      </p>
                      <p className="mt-1 text-slate-500">
                        Valid until{" "}
                        <span className="font-bold text-green-700">
                          {new Date(
                            activeSubscription.end_date,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={
                      buyingPlanId === plan.id || !!activeSubscription?.active
                    }
                    className={`w-full rounded-full px-5 py-3 font-bold transition disabled:cursor-not-allowed ${
                      activeSubscription?.active
                        ? isCurrentPlan
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 text-slate-500"
                        : "bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-70"
                    }`}
                  >
                    {activeSubscription?.active ? (
                      isCurrentPlan ? (
                        "Your Active Plan"
                      ) : (
                        "Already Subscribed"
                      )
                    ) : buyingPlanId === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
