import { useEffect, useState } from "react";
import { Loader2, MapPin, Plus, ShoppingBag } from "lucide-react";
import {
  createProductOrder,
  createShippingAddress,
  getMyCart,
  getMyShippingAddresses,
  verifyProductPayment,
  applyShopCoupon,
} from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state_code: "GJ",
    country_code: "IN",
    postal_code: "",
    is_default: true,
  });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const [cartRes, addressRes] = await Promise.all([
        getMyCart(),
        getMyShippingAddresses(),
      ]);

      setCart(cartRes.data);
      setAddresses(addressRes.data || []);

      if (addressRes.data?.[0]) {
        setSelectedAddress(addressRes.data[0].uuid);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum: number, item: any) => {
    return (
      sum + Number(item.product?.price_amount || 0) * Number(item.quantity || 0)
    );
  }, 0);

  const discountAmount = Number(coupon?.discount_amount || 0);
  const finalTotal = subtotal - discountAmount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Enter coupon code");
      return;
    }

    try {
      setCouponLoading(true);

      const res = await applyShopCoupon({
        code: couponCode.trim().toUpperCase(),
      });

      setCoupon(res.data);
      alert("Coupon applied 🙏");
    } catch (error: any) {
      setCoupon(null);
      alert(error?.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const saveAddress = async () => {
    try {
      const res = await createShippingAddress(addressForm);
      await load();
      setSelectedAddress(res.data.address.uuid);
      alert("Address saved 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save address");
    }
  };

  const payNow = async () => {
    if (!selectedAddress) {
      alert("Please select or add shipping address");
      return;
    }

    try {
      setPaying(true);

      const res = await createProductOrder({
        shipping_address_uuid: selectedAddress,
        shipping_amount: 0,
        coupon_code: coupon?.code || undefined,
      });

      const { order, razorpay } = res.data;

      const options = {
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "ISKCON Ahmedabad",
        description: "Temple Shop Order",
        order_id: razorpay.order_id,
        handler: async function (response: any) {
          await verifyProductPayment({
            order_uuid: order.uuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful 🙏");
          window.location.href = "/shop/payment-success";
        },
        theme: {
          color: "#c8902a",
        },
        modal: {
          ondismiss: function () {
            window.location.href = "/shop/payment-failed";
          },
        },
      };

      const razorpayObj = new window.Razorpay(options);
      razorpayObj.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Checkout failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title="Checkout | Temple Shop"
        description="Complete your order."
      />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
            Checkout
          </h1>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#ede0c8] bg-white p-6">
                <h2 className="mb-5 flex items-center gap-2 font-serif text-3xl font-black text-[#1a0a00]">
                  <MapPin className="text-[#c8902a]" />
                  Shipping Address
                </h2>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.uuid}
                      className="flex cursor-pointer gap-3 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
                    >
                      <input
                        type="radio"
                        checked={selectedAddress === address.uuid}
                        onChange={() => setSelectedAddress(address.uuid)}
                      />

                      <div>
                        <p className="font-black text-[#1a0a00]">
                          {address.full_name} · {address.phone}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                          {address.address_line_1}, {address.city} -{" "}
                          {address.postal_code}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl font-black text-[#1a0a00]">
                    <Plus size={20} />
                    Add New Address
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(addressForm).map((key) => {
                      if (key === "is_default") return null;

                      return (
                        <input
                          key={key}
                          value={(addressForm as any)[key]}
                          onChange={(e) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder={key.replaceAll("_", " ")}
                          className="rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={saveAddress}
                    className="mt-4 rounded-2xl bg-[#1a0a00] px-5 py-3 font-black text-[#d4a853]"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-[#ede0c8] bg-white p-6">
              <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                {items.map((item: any) => (
                  <div
                    key={item.uuid}
                    className="flex justify-between text-sm font-bold text-[#5c3d1a]"
                  >
                    <span>
                      {item.product?.title} × {item.quantity}
                    </span>
                    <span>
                      ₹{Number(item.product?.price_amount || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4">
                <label className="text-sm font-black text-[#5c3d1a]">
                  Coupon Code
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="GITA100"
                    className="min-w-0 flex-1 rounded-xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
                  />

                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="rounded-xl bg-[#1a0a00] px-4 py-3 text-sm font-black text-[#d4a853] disabled:opacity-60"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>

                {coupon && (
                  <p className="mt-2 text-sm font-black text-emerald-700">
                    {coupon.code} applied: ₹{coupon.discount_amount} off
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-[#ede0c8] pt-5 space-y-2">
                <div className="flex justify-between text-sm font-bold text-[#5c3d1a]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-black text-[#1a0a00]">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={payNow}
                disabled={paying || items.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] disabled:opacity-60"
              >
                {paying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
                Pay Now
              </button>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
