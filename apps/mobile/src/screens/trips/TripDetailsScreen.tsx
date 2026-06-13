// src/screens/trips/TripDetailsScreen.tsx

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
import RazorpayCheckout from "react-native-razorpay";

import AppHeader from "../../components/AppHeader";
import {
  getTripByUuid,
  registerTrip,
  verifyTripPayment,
} from "../../api/tripApi";

export default function TripDetailsScreen({ navigation, route }: any) {
  const { uuid } = route.params;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    notes: "",
  });

  useEffect(() => {
    loadTrip();
  }, [uuid]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const res = await getTripByUuid(uuid);
      setTrip(res.data?.trip || res.data);
    } catch (error: any) {
      console.log("LOAD TRIP ERROR:", error?.response?.data || error);
      Alert.alert("Error", "Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = () => {
    if (!trip?.is_paid || Number(trip?.price_amount) <= 0) return "Free";

    return `${trip.currency === "INR" ? "₹" : trip.currency}${trip.price_amount}`;
  };

  const getErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) return message.join("\n");

    return message || error?.message || fallback;
  };

  const handleRegister = async () => {
    try {
      if (!trip) return;

      if (!form.full_name.trim() || !form.phone.trim()) {
        Alert.alert("Required", "Full name and phone are required");
        return;
      }

      setRegistering(true);

      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
      };

      const res = await registerTrip(trip.uuid, payload);
      const data = res.data;

      if (!data.requires_payment) {
        Alert.alert("Success", "Trip registration confirmed 🙏");
        loadTrip();
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "ISKCON Ahmedabad",
        description: trip.title,
        order_id: data.order.id,
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          trip_uuid: trip.uuid,
          payment_uuid: data.payment_uuid,
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentResponse: any = await RazorpayCheckout.open(options);

      await verifyTripPayment({
        payment_uuid: data.payment_uuid,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      Alert.alert("Success", "Payment successful. Trip confirmed 🙏");
      loadTrip();
    } catch (error: any) {
      console.log("TRIP REGISTER ERROR:", error?.response?.data || error);

      Alert.alert(
        "Error",
        getErrorMessage(error, "Registration or payment failed")
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Trip Details"
        subtitle="Yatra information"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroWrap}>
          {trip.cover_image_url ? (
            <Image source={{ uri: trip.cover_image_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderText}>📍</Text>
            </View>
          )}

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <Text style={styles.destinationBadge}>
                {trip.destination || "Yatra"}
              </Text>

              <Text style={styles.priceBadge}>{formatPrice()}</Text>
            </View>

            <Text style={styles.heroTitle}>{trip.title}</Text>

            <Text style={styles.heroDescription}>
              {trip.description ||
                "A devotional trip organized for seekers and devotees."}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoBox
            icon="📅"
            label="Dates"
            value={`${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`}
          />

          <InfoBox
            icon="📍"
            label="Departure"
            value={trip.departure_city || "-"}
          />

          <InfoBox
            icon="👥"
            label="Capacity"
            value={trip.max_capacity ? `${trip.max_capacity} devotees` : "Open"}
          />

          <InfoBox
            icon="⏰"
            label="Meeting"
            value={trip.meeting_time || "-"}
          />
        </View>

        <Section title="Trip Information">
          <Detail label="Destination" value={trip.destination} />
          <Detail label="Meeting Point" value={trip.meeting_point} />
          <Detail label="Meeting Time" value={trip.meeting_time} />
          <Detail label="Price" value={formatPrice()} />
          <Detail label="Contact Name" value={trip.contact_name} />
          <Detail label="Contact Phone" value={trip.contact_phone} />
        </Section>

        {(trip.includes || trip.excludes || trip.rules) && (
          <Section title="Includes, Excludes & Rules">
            <TextBlock title="Includes" text={trip.includes} />
            <TextBlock title="Excludes" text={trip.excludes} />
            <TextBlock title="Rules" text={trip.rules} />
          </Section>
        )}

        {trip.stays?.length > 0 && (
          <Section title="Stay Details">
            {trip.stays.map((stay: any) => (
              <View key={stay.uuid} style={styles.stayCard}>
                <Text style={styles.stayIcon}>🏠</Text>

                <View style={{ flex: 1 }}>
                  <Text style={styles.subTitle}>{stay.stay_name}</Text>
                  <Text style={styles.muted}>{stay.stay_type || "-"}</Text>
                  <Text style={styles.text}>{stay.address || "-"}</Text>

                  <Text style={styles.orangeText}>
                    {formatDate(stay.check_in_date)} →{" "}
                    {formatDate(stay.check_out_date)}
                  </Text>

                  {stay.notes ? <Text style={styles.text}>{stay.notes}</Text> : null}
                </View>
              </View>
            ))}
          </Section>
        )}

        {trip.days?.length > 0 && (
          <Section title="Daily Itinerary">
            {trip.days.map((day: any) => (
              <View key={day.uuid} style={styles.dayCard}>
                <Text style={styles.dayBadge}>Day {day.day_number}</Text>

                <Text style={styles.subTitle}>
                  {day.title || `Day ${day.day_number}`}
                </Text>

                {day.date ? (
                  <Text style={styles.muted}>{formatDate(day.date)}</Text>
                ) : null}

                {day.description ? (
                  <Text style={styles.text}>{day.description}</Text>
                ) : null}

                <View style={styles.mealGrid}>
                  <Meal label="Breakfast" value={day.breakfast_info} />
                  <Meal label="Lunch" value={day.lunch_info} />
                  <Meal label="Dinner" value={day.dinner_info} />
                </View>

                {day.places?.length > 0 &&
                  day.places.map((place: any) => (
                    <View key={place.uuid} style={styles.placeCard}>
                      <Text style={styles.placeTitle}>📍 {place.place_name}</Text>

                      {place.visit_time ? (
                        <Text style={styles.muted}>⏰ {place.visit_time}</Text>
                      ) : null}

                      {place.description ? (
                        <Text style={styles.text}>{place.description}</Text>
                      ) : null}
                    </View>
                  ))}
              </View>
            ))}
          </Section>
        )}

        <Section title="Register for Trip">
          <View style={styles.priceBox}>
            <Text style={styles.muted}>Trip Price</Text>
            <Text style={styles.price}>{formatPrice()}</Text>
          </View>

          <Input
            label="Full Name"
            value={form.full_name}
            onChange={(v: string) => update("full_name", v)}
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(v: string) => update("phone", v)}
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v: string) => update("email", v)}
            keyboardType="email-address"
          />

          <Input
            label="Age"
            value={form.age}
            onChange={(v: string) => update("age", v)}
            keyboardType="number-pad"
          />

          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {["male", "female", "other"].map((gender) => (
              <Pressable
                key={gender}
                style={[
                  styles.genderChip,
                  form.gender === gender && styles.genderChipActive,
                ]}
                onPress={() => update("gender", gender)}
              >
                <Text
                  style={[
                    styles.genderChipText,
                    form.gender === gender && styles.genderChipTextActive,
                  ]}
                >
                  {gender}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label="Emergency Contact Name"
            value={form.emergency_contact_name}
            onChange={(v: string) => update("emergency_contact_name", v)}
          />

          <Input
            label="Emergency Contact Phone"
            value={form.emergency_contact_phone}
            onChange={(v: string) => update("emergency_contact_phone", v)}
            keyboardType="phone-pad"
          />

          <Input
            label="Notes"
            value={form.notes}
            onChange={(v: string) => update("notes", v)}
            multiline
          />

          <Pressable
            style={[styles.primaryButton, registering && styles.disabledButton]}
            onPress={handleRegister}
            disabled={registering}
          >
            {registering ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {trip.is_paid ? "Register & Pay" : "Register Free"}
              </Text>
            )}
          </Pressable>
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

function InfoBox({ icon, label, value }: any) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Detail({ label, value }: any) {
  return (
    <View style={styles.detail}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "-"}</Text>
    </View>
  );
}

function TextBlock({ title, text }: any) {
  return (
    <View style={styles.textBlock}>
      <Text style={styles.textBlockTitle}>{title}</Text>
      <Text style={styles.text}>{text || "-"}</Text>
    </View>
  );
}

function Meal({ label, value }: any) {
  return (
    <View style={styles.mealCard}>
      <Text style={styles.mealLabel}>{label}</Text>
      <Text style={styles.mealValue}>{value || "-"}</Text>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType, multiline }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea]}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  center: {
    flex: 1,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9a3412",
    fontWeight: "800",
  },
  container: {
    paddingBottom: 40,
  },
  heroWrap: {
    height: 360,
    backgroundColor: "#ffedd5",
    position: "relative",
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  heroPlaceholder: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroPlaceholderText: {
    fontSize: 62,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroContent: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  destinationBadge: {
    backgroundColor: "#ea580c",
    color: "#ffffff",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    marginRight: 8,
    marginBottom: 8,
  },
  priceBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    color: "#ffffff",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 35,
    fontWeight: "900",
  },
  heroDescription: {
    marginTop: 8,
    color: "#ffedd5",
    fontWeight: "700",
    lineHeight: 21,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 10,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  infoValue: {
    marginTop: 5,
    fontWeight: "900",
    color: "#0f172a",
  },
  section: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 16,
  },
  detail: {
    marginBottom: 14,
  },
  detailValue: {
    marginTop: 4,
    fontWeight: "800",
    color: "#334155",
  },
  textBlock: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  textBlockTitle: {
    color: "#ea580c",
    fontWeight: "900",
    marginBottom: 7,
  },
  text: {
    color: "#475569",
    lineHeight: 21,
    marginTop: 4,
  },
  muted: {
    color: "#64748b",
    marginTop: 3,
  },
  orangeText: {
    color: "#ea580c",
    fontWeight: "900",
    marginTop: 8,
  },
  stayCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  stayIcon: {
    fontSize: 26,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  dayCard: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },
  dayBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },
  mealGrid: {
    marginTop: 14,
  },
  mealCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#a16207",
    textTransform: "uppercase",
  },
  mealValue: {
    color: "#475569",
    marginTop: 4,
    fontWeight: "700",
  },
  placeCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  placeTitle: {
    fontWeight: "900",
    color: "#0f172a",
  },
  priceBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  price: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ea580c",
    marginTop: 2,
  },
  inputWrap: {
    marginBottom: 13,
  },
  inputLabel: {
    fontWeight: "900",
    color: "#334155",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontWeight: "700",
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  genderChip: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  genderChipActive: {
    backgroundColor: "#ea580c",
    borderColor: "#ea580c",
  },
  genderChipText: {
    color: "#9a3412",
    fontWeight: "900",
    textTransform: "capitalize",
  },
  genderChipTextActive: {
    color: "#ffffff",
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
});