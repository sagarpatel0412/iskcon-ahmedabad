import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CalendarDays,
  Clock,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import {
  getEventByUuid,
  getEventFormFields,
} from "../../api/eventApi";
import { registerForEventFlow } from "../../api/eventRegistrationFlow";

const API_ORIGIN = "http://localhost:3000";

export default function EventDetailsScreen({ navigation, route }: any) {
  const { eventUuid } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const getImageUrl = (posterUrl?: string) => {
    if (!posterUrl) {
      return "https://iskconahmedabad.com/images/gallery/gallery2.jpg";
    }

    if (posterUrl.startsWith("http")) {
      return posterUrl;
    }

    return `${API_ORIGIN}${posterUrl}`;
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const eventRes = await getEventByUuid(eventUuid);
      const eventData = eventRes.data?.event || eventRes.data;

      const formRes = await getEventFormFields(eventUuid);
      const formFields = formRes.data?.fields || formRes.data || [];

      setEvent(eventData);
      setFields(Array.isArray(formFields) ? formFields : []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load event"
      );
    } finally {
      setLoading(false);
    }
  };

  const poster = useMemo(() => {
    return getImageUrl(event?.poster_url);
  }, [event]);

  const spotsLeft = useMemo(() => {
    const max = Number(event?.max_capacity || 0);
    const registered = Number(
      event?.registration_count || event?.registrations_count || 0
    );

    if (!max) return "Unlimited";
    return String(Math.max(max - registered, 0));
  }, [event]);

  const updateAnswer = (key: string, value: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    for (const field of fields) {
      if (field.is_required && !answers[field.field_key]) {
        Alert.alert("Validation", `${field.label} is required`);
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      if (!event) return;

      if (!validateForm()) return;

      setRegistering(true);

      await registerForEventFlow({
        event,
        answers,
        navigation,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Alert.alert(
        "Registration Failed",
        Array.isArray(message)
          ? message.join("\n")
          : message || error?.message || "Failed to register"
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    Alert.alert("Share Event", "Sharing will be added later.");
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loaderPage}>
        <Text style={styles.emptyTitle}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Event Details"
        subtitle="View and register"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.omText}>
          ॐ नमो भगवते वासुदेवाय · ISKCON Ahmedabad Events
        </Text>

        <ImageBackground
          source={{ uri: poster }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>
                  {event?.status || "published"}
                </Text>
              </View>

              <View style={styles.lightBadge}>
                <Text style={styles.lightBadgeText}>
                  {event?.is_paid
                    ? `Paid · ₹${event?.price_amount || 0}`
                    : "Free Entry"}
                </Text>
              </View>
            </View>

            <Text style={styles.presentText}>ISKCON Ahmedabad Presents</Text>

            <Text style={styles.title}>{event?.title}</Text>

            <Text style={styles.heroMeta}>
              {formatDate(event?.event_date)} · {event?.start_time || "-"} –{" "}
              {event?.end_time || "-"}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.grid}>
          <InfoCard
            icon={CalendarDays}
            label="Date"
            value={formatDate(event?.event_date)}
          />

          <InfoCard
            icon={Clock}
            label="Time"
            value={`${event?.start_time || "-"} - ${event?.end_time || "-"}`}
          />

          <InfoCard
            icon={MapPin}
            label="Location"
            value={event?.location || "-"}
          />

          <InfoCard
            icon={Users}
            label="Capacity"
            value={
              event?.max_capacity ? `${spotsLeft} spots left` : "Unlimited"
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About this Event</Text>

          <Text style={styles.description}>
            {event?.description || "No description available."}
          </Text>
        </View>

        <View style={styles.registrationCard}>
          <Text style={styles.registrationLabel}>Registration</Text>

          <Text style={styles.priceText}>
            {event?.is_paid ? `₹${event?.price_amount || 0}` : "Free"}
          </Text>

          <Text style={styles.paymentText}>
            {event?.is_paid
              ? `${event?.currency || "INR"} payment required`
              : "No payment required"}
          </Text>

          <View style={styles.divider} />

          <View style={styles.registerMeta}>
            <Text style={styles.registerMetaText}>
              📅 {formatDate(event?.event_date)}
            </Text>
            <Text style={styles.registerMetaText}>
              🕐 {event?.start_time || "-"} – {event?.end_time || "-"}
            </Text>
            <Text style={styles.registerMetaText}>
              📍 {event?.location || "-"}
            </Text>
            <Text style={styles.registerMetaText}>
              👥 {event?.max_capacity ? `${spotsLeft} spots left` : "Unlimited"}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Registration Form</Text>

          {fields.length === 0 ? (
            <Text style={styles.noFormText}>
              No extra form required. You can directly register.
            </Text>
          ) : (
            fields.map((field) => (
              <View
                key={field.uuid || field.field_key}
                style={styles.fieldGroup}
              >
                <Text style={styles.label}>
                  {field.label} {field.is_required ? "*" : ""}
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    field.field_type === "textarea" && styles.textArea,
                  ]}
                  placeholder={field.label}
                  placeholderTextColor="#9a7a4a"
                  keyboardType={
                    field.field_type === "number" ? "numeric" : "default"
                  }
                  multiline={field.field_type === "textarea"}
                  value={answers[field.field_key] || ""}
                  onChangeText={(text) => updateAnswer(field.field_key, text)}
                />
              </View>
            ))
          )}

          <Pressable
            style={[styles.registerBtn, registering && styles.disabledBtn]}
            onPress={handleRegister}
            disabled={registering}
          >
            <Ticket size={18} color="#1a0a00" />
            <Text style={styles.registerBtnText}>
              {registering
                ? event?.is_paid
                  ? "Opening Payment..."
                  : "Registering..."
                : event?.is_paid
                ? "Register & Pay"
                : "Register Now"}
            </Text>
          </Pressable>

          <Pressable style={styles.shareBtn} onPress={handleShare}>
            <Share2 size={17} color="#d4a853" />
            <Text style={styles.shareBtnText}>Share Event</Text>
          </Pressable>
        </View>

        <View style={styles.organiserCard}>
          <Text style={styles.organiserSmall}>🪔 Organised by</Text>

          <View style={styles.organiserRow}>
            <Image
              source={{
                uri: "https://iskconahmedabad.com/images/logo.png",
              }}
              style={styles.logo}
            />

            <View>
              <Text style={styles.organiserTitle}>
                {event?.centre?.name || "ISKCON Ahmedabad"}
              </Text>
              <Text style={styles.organiserText}>Official Temple Event</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Icon size={21} color="#8b6914" />
      </View>

      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value || "-")}</Text>
    </View>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
  loaderText: {
    marginTop: 10,
    color: "#8b6914",
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  omText: {
    backgroundColor: "#1a0a00",
    color: "#d4a853",
    textAlign: "center",
    paddingVertical: 10,
    borderRadius: 18,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  hero: {
    minHeight: 380,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#1a0a00",
  },
  heroImage: {
    borderRadius: 30,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(26,10,0,0.56)",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  goldBadge: {
    backgroundColor: "#c8902a",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  goldBadgeText: {
    color: "#1a0a00",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  lightBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  lightBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  presentText: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  heroMeta: {
    marginTop: 12,
    color: "#f5e8c8",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    padding: 14,
  },
  infoIcon: {
    height: 42,
    width: 42,
    borderRadius: 14,
    backgroundColor: "#f5e8c8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    marginTop: 5,
    color: "#1a0a00",
    fontSize: 14,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  description: {
    color: "#5c3d1a",
    fontSize: 15,
    lineHeight: 26,
    fontWeight: "600",
  },
  registrationCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  registrationLabel: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  priceText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 44,
    fontWeight: "900",
  },
  paymentText: {
    marginTop: 5,
    color: "#d4a853",
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#5c3d1a",
    marginVertical: 18,
  },
  registerMeta: {
    gap: 8,
  },
  registerMetaText: {
    color: "#f5e8c8",
    fontWeight: "800",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ede0c8",
    marginBottom: 18,
  },
  noFormText: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginBottom: 16,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#5c3d1a",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#1a0a00",
    fontWeight: "700",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  registerBtn: {
    marginTop: 8,
    backgroundColor: "#c8902a",
    paddingVertical: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  registerBtnText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  shareBtn: {
    marginTop: 10,
    backgroundColor: "#1a0a00",
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareBtnText: {
    color: "#d4a853",
    fontWeight: "900",
  },
  organiserCard: {
    backgroundColor: "#f5e8c8",
    borderWidth: 1,
    borderColor: "#c8902a",
    borderRadius: 28,
    padding: 18,
  },
  organiserSmall: {
    color: "#8b6914",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  organiserRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 52,
    width: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#c8902a",
    backgroundColor: "#ffffff",
  },
  organiserTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 16,
  },
  organiserText: {
    color: "#9a7a4a",
    fontWeight: "800",
    fontSize: 12,
    marginTop: 2,
  },
  emptyTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 18,
  },
});