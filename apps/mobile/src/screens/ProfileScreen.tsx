import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CalendarDays,
  Crown,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react-native";

import AppHeader from "../components/AppHeader";
import { api } from "../api/client";

export default function ProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    country_code: "",
    state_code: "",
    city: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    postal_code: "",
    profile_image_url: "",
  });

  useEffect(() => {
    loadProfilePage();
  }, []);

  const loadProfilePage = async () => {
    try {
      setLoading(true);

      const [profileRes, subscriptionRes, purchasesRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/content/my-subscription"),
        api.get("/content/my-purchases"),
      ]);

      const user = profileRes.data?.user || profileRes.data?.data || profileRes.data;

      setProfile(user);
      setForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        country_code: user?.country_code || "",
        state_code: user?.state_code || "",
        city: user?.city || "",
        address_line_1: user?.address_line_1 || "",
        address_line_2: user?.address_line_2 || "",
        landmark: user?.landmark || "",
        postal_code: user?.postal_code || "",
        profile_image_url: user?.profile_image_url || "",
      });

      setSubscription(
        subscriptionRes.data?.subscription ||
          subscriptionRes.data?.data ||
          subscriptionRes.data ||
          null
      );

      setPurchases(purchasesRes.data?.data || purchasesRes.data || []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await api.patch("/users/me", {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        gender: form.gender || null,
        country_code: form.country_code,
        state_code: form.state_code,
        city: form.city,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        landmark: form.landmark,
        postal_code: form.postal_code,
        profile_image_url: form.profile_image_url,
      });

      Alert.alert("Success", "Profile updated successfully 🙏");
      loadProfilePage();
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (amount?: number, currency = "INR") => {
    if (!amount) return "-";
    return `${currency === "INR" ? "₹" : currency}${amount}`;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.emptyTitle}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="My Profile"
        subtitle="Account, subscription & purchases"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            {form.profile_image_url ? (
              <Image source={{ uri: form.profile_image_url }} style={styles.avatarImage} />
            ) : (
              <UserRound size={38} color="#1a0a00" />
            )}
          </View>

          <Text style={styles.name}>
            {profile.first_name} {profile.last_name || ""}
          </Text>

          <View style={styles.badgeRow}>
            {profile?.roles?.map((role: any) => (
              <Badge key={role.id || role.name} text={role.name} />
            ))}

            {profile?.is_verified_devotee && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={13} color="#166534" />
                <Text style={styles.verifiedBadgeText}>Verified Devotee</Text>
              </View>
            )}

            {profile?.isSubscribed && <PremiumBadge />}
          </View>

          <Text style={styles.centre}>
            {profile?.centre?.name || "ISKCON Ahmedabad"}
          </Text>
        </View>

        <Section title="Profile Information">
          <Input
            label="First Name"
            value={form.first_name}
            onChangeText={(v: string) => update("first_name", v)}
          />

          <Input
            label="Last Name"
            value={form.last_name}
            onChangeText={(v: string) => update("last_name", v)}
          />

          <ReadOnlyInfo icon={Mail} label="Email" value={profile.email || "-"} />

          <Input
            icon={Phone}
            label="Phone"
            value={form.phone}
            onChangeText={(v: string) => update("phone", v)}
            keyboardType="phone-pad"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Gender</Text>

            <View style={styles.chipRow}>
              {["male", "female", "other"].map((gender) => (
                <Pressable
                  key={gender}
                  onPress={() => update("gender", gender)}
                  style={[
                    styles.chip,
                    form.gender === gender && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.gender === gender && styles.chipTextActive,
                    ]}
                  >
                    {gender.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Input
            label="Profile Image URL"
            value={form.profile_image_url}
            onChangeText={(v: string) => update("profile_image_url", v)}
          />
        </Section>

        <Section title="Address">
          <Input
            label="Country Code"
            value={form.country_code}
            onChangeText={(v: string) => update("country_code", v)}
          />

          <Input
            label="State Code"
            value={form.state_code}
            onChangeText={(v: string) => update("state_code", v)}
          />

          <Input
            icon={MapPin}
            label="City"
            value={form.city}
            onChangeText={(v: string) => update("city", v)}
          />

          <Input
            label="Postal Code"
            value={form.postal_code}
            onChangeText={(v: string) => update("postal_code", v)}
            keyboardType="number-pad"
          />

          <Input
            label="Address Line 1"
            value={form.address_line_1}
            onChangeText={(v: string) => update("address_line_1", v)}
          />

          <Input
            label="Address Line 2"
            value={form.address_line_2}
            onChangeText={(v: string) => update("address_line_2", v)}
          />

          <Input
            label="Landmark"
            value={form.landmark}
            onChangeText={(v: string) => update("landmark", v)}
          />
        </Section>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.disabled]}
        >
          {saving ? (
            <ActivityIndicator color="#1a0a00" />
          ) : (
            <Save size={18} color="#1a0a00" />
          )}

          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>

        <Section title="Active Subscription">
          <View style={styles.sectionHeaderIcon}>
            <Crown size={22} color="#c8902a" />
            <Text style={styles.smallSectionTitle}>Premium Access</Text>
          </View>

          {subscription ? (
            <View style={styles.subscriptionBox}>
              <Text style={styles.subscriptionName}>
                {subscription.plan_name}
              </Text>

              <Text style={styles.mutedText}>
                {subscription.plan_type?.toUpperCase()} Plan
              </Text>

              <View style={styles.twoColumn}>
                <InfoBox
                  label="Amount"
                  value={formatPrice(subscription.amount, subscription.currency)}
                />
                <InfoBox label="Status" value={subscription.status} />
                <InfoBox label="Start" value={formatDate(subscription.start_date)} />
                <InfoBox label="End" value={formatDate(subscription.end_date)} />
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No active subscription</Text>
              <Text style={styles.emptyText}>
                Subscribe to unlock premium journals and newsletters.
              </Text>
            </View>
          )}
        </Section>

        <Section title="Purchases">
          <View style={styles.sectionHeaderIcon}>
            <ShoppingBag size={22} color="#c8902a" />
            <Text style={styles.smallSectionTitle}>Your paid content</Text>
          </View>

          {purchases.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No purchases yet.</Text>
            </View>
          ) : (
            <View style={styles.purchaseList}>
              {purchases.map((purchase) => (
                <View key={purchase.uuid} style={styles.purchaseCard}>
                  <Text style={styles.purchaseTitle}>
                    {purchase.post?.title ||
                      purchase.subscription?.plan_name ||
                      "Subscription Purchase"}
                  </Text>

                  <View style={styles.purchaseFooter}>
                    <Text style={styles.purchaseAmount}>
                      {formatPrice(purchase.amount, purchase.currency)}
                    </Text>

                    <Text style={styles.successBadge}>
                      {purchase.payment_status}
                    </Text>
                  </View>

                  <View style={styles.dateRow}>
                    <CalendarDays size={13} color="#9a7a4a" />
                    <Text style={styles.dateText}>
                      {formatDate(purchase.paid_at)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({
  label,
  value,
  onChangeText,
  icon: Icon,
  keyboardType = "default",
}: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrap}>
        {Icon && <Icon size={17} color="#8b6914" />}
        <TextInput
          style={styles.input}
          value={value || ""}
          onChangeText={onChangeText}
          placeholderTextColor="#9a7a4a"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

function ReadOnlyInfo({ label, value, icon: Icon }: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.readOnlyBox}>
        {Icon && <Icon size={17} color="#9a7a4a" />}
        <Text style={styles.readOnlyText}>{value}</Text>
      </View>
    </View>
  );
}

function InfoBox({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value || "-")}</Text>
    </View>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function PremiumBadge() {
  return (
    <View style={styles.premiumBadge}>
      <Crown size={13} color="#7c2d12" />
      <Text style={styles.premiumBadgeText}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    paddingTop: 48,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#8b6914",
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 34,
  },
  heroCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 30,
    padding: 26,
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#c8902a",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 4,
    borderColor: "#d4a853",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 25,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
  },
  centre: {
    marginTop: 8,
    color: "#d4a853",
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  badge: {
    backgroundColor: "#f5e8c8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#8b6914",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verifiedBadgeText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "900",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ffedd5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumBadgeText: {
    color: "#7c2d12",
    fontSize: 11,
    fontWeight: "900",
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#1a0a00",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 16,
  },
  sectionHeaderIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },
  smallSectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1a0a00",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#5c3d1a",
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1a0a00",
    fontWeight: "700",
  },
  readOnlyBox: {
    backgroundColor: "#f6f1e8",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readOnlyText: {
    color: "#9a7a4a",
    fontWeight: "800",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#fdfaf5",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#5c3d1a",
  },
  chipTextActive: {
    color: "#1a0a00",
  },
  saveButton: {
    backgroundColor: "#c8902a",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  subscriptionBox: {
    backgroundColor: "#fdfaf5",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ede0c8",
    padding: 14,
  },
  subscriptionName: {
    fontSize: 18,
    color: "#8b6914",
    fontWeight: "900",
  },
  mutedText: {
    marginTop: 4,
    color: "#9a7a4a",
    fontWeight: "700",
  },
  twoColumn: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoBox: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
  },
  infoLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    marginTop: 5,
    color: "#1a0a00",
    fontWeight: "900",
  },
  emptyBox: {
    backgroundColor: "#fdfaf5",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 16,
  },
  emptyText: {
    color: "#9a7a4a",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
  },
  purchaseList: {
    gap: 12,
  },
  purchaseCard: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    padding: 14,
  },
  purchaseTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 15,
  },
  purchaseFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  purchaseAmount: {
    color: "#8b6914",
    fontWeight: "900",
  },
  successBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: 11,
    fontWeight: "900",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  dateRow: {
    marginTop: 9,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dateText: {
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "700",
  },
});