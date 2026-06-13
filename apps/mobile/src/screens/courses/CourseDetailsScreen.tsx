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
  getCourseByUuid,
  registerCourse,
  verifyCoursePayment,
} from "../../api/courseApi";

export default function CourseDetailsScreen({ navigation, route }: any) {
  const { uuid } = route.params;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    loadCourse();
  }, [uuid]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourseByUuid(uuid);
      setCourse(res.data?.course || res.data);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load course");
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
    if (!course?.is_paid || Number(course?.price_amount) <= 0) return "Free";
    return `${course.currency === "INR" ? "₹" : course.currency}${course.price_amount}`;
  };

  const handleRegister = async () => {
    try {
      if (!form.full_name.trim() || !form.phone.trim()) {
        Alert.alert("Required", "Full name and phone are required");
        return;
      }

      setRegistering(true);

      const res = await registerCourse(course.uuid, form);
      const data = res.data;

      if (!data.requires_payment) {
        Alert.alert("Success", "Course registration confirmed successfully 🙏");
        loadCourse();
        return;
      }

      const paymentResponse: any = await RazorpayCheckout.open({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        order_id: data.order.id,
        name: "ISKCON Ahmedabad",
        description: course.title,
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#ea580c",
        },
      });

      await verifyCoursePayment({
        payment_uuid: data.payment_uuid,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      Alert.alert("Success", "Payment successful. Course registration confirmed 🙏");
      loadCourse();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.description ||
          "Registration failed"
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loaderText}>Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loaderPage}>
        <Text style={styles.loaderText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Course Details"
        subtitle="Spiritual learning"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroWrap}>
          {course.cover_image_url ? (
            <Image source={{ uri: course.cover_image_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroIcon}>📖</Text>
            </View>
          )}

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <Text style={styles.orangeBadge}>
                {course.course_mode?.toUpperCase()}
              </Text>
              <Text style={styles.priceBadge}>{formatPrice()}</Text>
            </View>

            <Text style={styles.heroTitle}>{course.title}</Text>

            <Text style={styles.heroText}>
              {course.description ||
                "A spiritual learning course for seekers and devotees."}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoBox
            icon="📅"
            label="Dates"
            value={`${formatDate(course.start_date)} - ${formatDate(course.end_date)}`}
          />
          <InfoBox icon="💻" label="Mode" value={course.course_mode || "-"} />
          <InfoBox
            icon="👥"
            label="Capacity"
            value={course.max_capacity ? String(course.max_capacity) : "Open"}
          />
        </View>

        <Card title="Course Information">
          <Detail label="Venue" value={course.venue_name} />
          <Detail label="Venue Address" value={course.venue_address} />
          <Detail label="Online Link" value={course.online_meeting_url} />
          <Detail
            label="Time"
            value={`${course.start_time || "-"} - ${course.end_time || "-"}`}
          />
          <Detail label="Contact Name" value={course.contact_name} />
          <Detail label="Contact Phone" value={course.contact_phone} />
        </Card>

        <Card title="What You Will Learn">
          <TextBlock title="Learning" text={course.what_you_will_learn} />
          <TextBlock title="Requirements" text={course.requirements} />
          <TextBlock title="Rules" text={course.rules} />
        </Card>

        {course.sessions?.length > 0 && (
          <Card title="Course Sessions">
            {course.sessions.map((session: any) => (
              <View key={session.uuid || session.id} style={styles.sessionCard}>
                <View style={styles.sessionBadgeRow}>
                  <Text style={styles.sessionBadge}>
                    Session {session.session_number}
                  </Text>
                  <Text style={styles.dateBadge}>
                    {formatDate(session.session_date)}
                  </Text>
                </View>

                <Text style={styles.sessionTitle}>{session.title}</Text>

                {session.description ? (
                  <Text style={styles.sessionText}>{session.description}</Text>
                ) : null}

                <Detail
                  label="Time"
                  value={`${session.start_time || "-"} - ${
                    session.end_time || "-"
                  }`}
                />
                <Detail label="Venue" value={session.venue_name} />
                <Detail label="Address" value={session.venue_address} />
                <Detail label="Online Link" value={session.online_meeting_url} />
              </View>
            ))}
          </Card>
        )}

        <Card title="Register for Course">
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Course Price</Text>
            <Text style={styles.priceText}>{formatPrice()}</Text>
          </View>

          <Input
            label="Full Name"
            value={form.full_name}
            onChange={(v: string) => update("full_name", v)}
          />
          <Input
            label="Phone"
            value={form.phone}
            keyboardType="phone-pad"
            onChange={(v: string) => update("phone", v)}
          />
          <Input
            label="Email"
            value={form.email}
            keyboardType="email-address"
            onChange={(v: string) => update("email", v)}
          />
          <Input
            label="Notes"
            value={form.notes}
            multiline
            onChange={(v: string) => update("notes", v)}
          />

          <Pressable
            style={[styles.registerBtn, registering && styles.disabled]}
            disabled={registering}
            onPress={handleRegister}
          >
            {registering ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerText}>
                {course.is_paid ? "Register & Pay" : "Register Free"}
              </Text>
            )}
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

function Card({ title, children }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
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
      <Text style={styles.textBlockText}>{text || "-"}</Text>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType, multiline }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value || ""}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff7ed", paddingTop: 48 },
  loaderPage: {
    flex: 1,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#c2410c",
    fontWeight: "900",
    marginTop: 10,
  },
  content: { paddingBottom: 40 },
  heroWrap: {
    height: 360,
    position: "relative",
    backgroundColor: "#ffedd5",
  },
  heroImage: { height: "100%", width: "100%" },
  heroPlaceholder: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: { fontSize: 58 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroContent: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 26,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  orangeBadge: {
    backgroundColor: "#ea580c",
    color: "#ffffff",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  priceBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    color: "#ffffff",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },
  heroText: {
    color: "#ffedd5",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  infoBox: {
    width: "31%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 22,
    padding: 14,
  },
  infoIcon: { fontSize: 24, marginBottom: 8 },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#0f172a",
    fontWeight: "900",
    marginTop: 5,
    textTransform: "capitalize",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 18,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 16,
  },
  detail: { marginBottom: 13 },
  detailValue: {
    color: "#334155",
    fontWeight: "800",
    marginTop: 4,
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
    marginBottom: 6,
  },
  textBlockText: {
    color: "#475569",
    fontWeight: "600",
    lineHeight: 21,
  },
  sessionCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },
  sessionBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  sessionBadge: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  dateBadge: {
    backgroundColor: "#fef3c7",
    color: "#a16207",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  sessionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
  sessionText: {
    color: "#64748b",
    fontWeight: "600",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 12,
  },
  priceBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  priceLabel: {
    color: "#64748b",
    fontWeight: "800",
  },
  priceText: {
    color: "#ea580c",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },
  inputWrap: { marginBottom: 13 },
  inputLabel: {
    color: "#334155",
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#0f172a",
    fontWeight: "700",
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  registerBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  registerText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
  disabled: { opacity: 0.6 },
});