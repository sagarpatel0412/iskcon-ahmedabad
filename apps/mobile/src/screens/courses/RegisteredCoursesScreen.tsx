import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { getMyRegisteredCourses } from "../../api/courseApi";

export default function RegisteredCoursesScreen({ navigation }: any) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const res = await getMyRegisteredCourses();
      setRegistrations(
        Array.isArray(res.data) ? res.data : res.data?.registrations || []
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to load registered courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const formatPrice = (reg: any) => {
    if (!reg.payment) return "Free";

    return `${reg.payment.currency === "INR" ? "₹" : reg.payment.currency}${
      reg.payment.amount
    }`;
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loaderText}>Loading registrations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="My Registered Courses"
        subtitle="Your course registrations"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Registered Courses</Text>

        <Text style={styles.subtitle}>
          View all courses you registered for.
        </Text>

        {registrations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              You have not registered for any course yet.
            </Text>
          </View>
        ) : (
          registrations.map((reg) => (
            <View key={reg.uuid} style={styles.card}>
              <View style={styles.badgeRow}>
                <Text style={styles.orangeBadge}>
                  {reg.registration_status}
                </Text>

                <Text style={styles.greenBadge}>{reg.payment_status}</Text>
              </View>

              <Text style={styles.courseTitle}>
                {reg.course?.title || "Course"}
              </Text>

              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  📅 {formatDate(reg.course?.start_date)} -{" "}
                  {formatDate(reg.course?.end_date)}
                </Text>

                <Text style={styles.metaText}>
                  💻 {reg.course?.course_mode || "-"}
                </Text>

                <Text style={styles.metaText}>💳 {formatPrice(reg)}</Text>
              </View>

              <Pressable
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate("CourseDetails", {
                    uuid: reg.course?.uuid,
                  })
                }
              >
                <Text style={styles.viewBtnText}>View Course</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#c2410c",
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 22,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 28,
    alignItems: "center",
  },
  emptyText: {
    color: "#334155",
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  orangeBadge: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  greenBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  courseTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  metaBox: {
    marginTop: 14,
    gap: 8,
  },
  metaText: {
    color: "#64748b",
    fontWeight: "800",
  },
  viewBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 13,
    marginTop: 18,
  },
  viewBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
  },
});