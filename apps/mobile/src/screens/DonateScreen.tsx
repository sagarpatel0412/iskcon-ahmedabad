import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { Heart, IndianRupee, Receipt, Sparkles } from "lucide-react-native";

import AppHeader from "../components/AppHeader";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createDonationOrder,
  verifyDonation,
} from "../api/donationApi";

const amounts = [108, 501, 1008, 2100, 5100, 11000];

const sevaTypes = [
  { label: "Nitya Seva", value: "nitya_seva" },
  { label: "Gau Seva", value: "gau_seva" },
  { label: "Khichdi Seva", value: "khichdi_seva" },
];

export default function DonateScreen({ navigation }: any) {
  const { user, loading: userLoading } = useCurrentUser();

  const [amount, setAmount] = useState("501");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    seva_type: "nitya_seva",
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    is_anonymous: false,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        donor_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        donor_email: user.email || "",
        donor_phone: user.phone || "",
      }));
    }
  }, [user]);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const donate = async () => {
    try {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      if (!Number(amount) || Number(amount) <= 0) {
        Alert.alert("Invalid Amount", "Please enter valid donation amount");
        return;
      }

      setLoading(true);

      const orderRes = await createDonationOrder({
        ...form,
        amount: Number(amount),
      });

      const { key, order } = orderRes.data;

      const paymentResponse: any = await RazorpayCheckout.open({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ISKCON Ahmedabad",
        description: "Donation",
        image: "https://iskconahmedabad.com/images/logo.png",
        prefill: {
          name: form.donor_name,
          email: form.donor_email,
          contact: form.donor_phone,
        },
        theme: {
          color: "#c8902a",
        },
      });

      await verifyDonation(paymentResponse);

      Alert.alert("Success", "Donation Successful 🙏 Receipt Generated.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
        console.log(error ,'error')
      Alert.alert(
        "Payment Failed",
        error?.response?.data?.message ||
          error?.description ||
          "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Donate"
        subtitle="Support Krishna Consciousness"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Heart size={58} color="#d4a853" />

          <Text style={styles.heroTitle}>Donate</Text>

          <Text style={styles.heroText}>Support Krishna Consciousness</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Donation Details</Text>

          <Input
            label="Donor Name"
            value={form.donor_name}
            onChange={(v: string) => update("donor_name", v)}
          />

          <Input
            label="Email"
            value={form.donor_email}
            keyboardType="email-address"
            onChange={(v: string) => update("donor_email", v)}
          />

          <Input
            label="Phone"
            value={form.donor_phone}
            keyboardType="phone-pad"
            onChange={(v: string) => update("donor_phone", v)}
          />

          <Text style={styles.label}>Seva</Text>
          <View style={styles.chipRow}>
            {sevaTypes.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.sevaChip,
                  form.seva_type === item.value && styles.sevaChipActive,
                ]}
                onPress={() => update("seva_type", item.value)}
              >
                <Text
                  style={[
                    styles.sevaChipText,
                    form.seva_type === item.value && styles.sevaChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountGrid}>
            {amounts.map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.amountBtn,
                  Number(amount) === value && styles.amountBtnActive,
                ]}
                onPress={() => setAmount(String(value))}
              >
                <Text
                  style={[
                    styles.amountText,
                    Number(amount) === value && styles.amountTextActive,
                  ]}
                >
                  ₹{value}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.amountInputWrap}>
            <IndianRupee size={20} color="#5c3d1a" />
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.amountInput}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Donate anonymously</Text>
              <Text style={styles.switchSub}>
                Your name will not be shown publicly.
              </Text>
            </View>

            <Switch
              value={form.is_anonymous}
              onValueChange={(v) => update("is_anonymous", v)}
            />
          </View>

          <Pressable
            disabled={loading}
            style={[styles.donateBtn, loading && styles.disabled]}
            onPress={donate}
          >
            {loading ? (
              <ActivityIndicator color="#1a0a00" />
            ) : (
              <Text style={styles.donateBtnText}>
                {user ? `Donate ₹${amount}` : "Login to Donate"}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.sevaCard}>
          <Sparkles color="#d4a853" size={28} />

          <Text style={styles.sevaTitle}>Seva Opportunities</Text>

          <Text style={styles.sevaItem}>🙏 Nitya Seva</Text>
          <Text style={styles.sevaItem}>🐄 Gau Seva</Text>
          <Text style={styles.sevaItem}>🍲 Khichdi Seva</Text>
        </View>

        <View style={styles.receiptCard}>
          <Receipt color="#1a0a00" size={30} />

          <Text style={styles.receiptTitle}>Donation Receipt</Text>

          <Text style={styles.receiptText}>
            After successful payment PDF receipt is generated automatically.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType = "default" }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value || ""}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={label}
        placeholderTextColor="#b08a52"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingBottom: 44,
  },
  hero: {
    backgroundColor: "#1a0a00",
    paddingVertical: 58,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 54,
    fontWeight: "900",
    marginTop: 18,
  },
  heroText: {
    color: "#d4a853",
    fontWeight: "800",
    marginTop: 8,
  },
  formCard: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  sectionTitle: {
    color: "#1a0a00",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 18,
  },
  inputWrap: {
    marginBottom: 14,
  },
  label: {
    color: "#5c3d1a",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#1a0a00",
    fontWeight: "800",
    backgroundColor: "#ffffff",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  sevaChip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sevaChipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  sevaChipText: {
    color: "#5c3d1a",
    fontWeight: "900",
  },
  sevaChipTextActive: {
    color: "#1a0a00",
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 14,
  },
  amountBtn: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  amountBtnActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  amountText: {
    color: "#5c3d1a",
    fontWeight: "900",
  },
  amountTextActive: {
    color: "#1a0a00",
  },
  amountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 13,
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 16,
  },
  switchRow: {
    backgroundColor: "#f7f0e4",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTitle: {
    color: "#1a0a00",
    fontWeight: "900",
  },
  switchSub: {
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  donateBtn: {
    backgroundColor: "#c8902a",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  donateBtnText: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 17,
  },
  disabled: {
    opacity: 0.65,
  },
  sevaCard: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 22,
  },
  sevaTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 12,
  },
  sevaItem: {
    color: "#ffffff",
    fontWeight: "800",
    marginTop: 9,
  },
  receiptCard: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  receiptTitle: {
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 14,
  },
  receiptText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
});