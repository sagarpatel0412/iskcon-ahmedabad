import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { getCourses } from "../../api/courseApi";

export default function CoursesScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(Array.isArray(res.data) ? res.data : res.data?.courses || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (course: any) => {
    if (!course.is_paid || Number(course.price_amount) <= 0) return "Free";
    return `${course.currency === "INR" ? "₹" : course.currency}${course.price_amount}`;
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loaderText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Courses"
        subtitle="Spiritual learning"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>📖</Text>
          </View>

          <Text style={styles.title}>Spiritual Courses</Text>

          <Text style={styles.subtitle}>
            Learn through offline, online, and hybrid courses conducted by
            devotees with session-wise guidance.
          </Text>
        </View>

        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No courses available</Text>
            <Text style={styles.emptyText}>Upcoming courses will appear here.</Text>
          </View>
        ) : (
          courses.map((course) => (
            <Pressable
              key={course.uuid}
              style={styles.courseCard}
              onPress={() =>
                navigation.navigate("CourseDetails", {
                  uuid: course.uuid,
                })
              }
            >
              {course.cover_image_url ? (
                <Image
                  source={{ uri: course.cover_image_url }}
                  style={styles.cover}
                />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={styles.coverIcon}>📚</Text>
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  <Text style={styles.modeBadge}>
                    {course.course_mode === "offline" ? "📍" : "💻"}{" "}
                    {course.course_mode?.toUpperCase()}
                  </Text>

                  <Text
                    style={course.is_paid ? styles.paidBadge : styles.freeBadge}
                  >
                    {formatPrice(course)}
                  </Text>
                </View>

                <Text style={styles.courseTitle}>{course.title}</Text>

                <Text numberOfLines={2} style={styles.description}>
                  {course.description ||
                    "A spiritual learning course for seekers and devotees."}
                </Text>

                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>
                    📅 {formatDate(course.start_date)} -{" "}
                    {formatDate(course.end_date)}
                  </Text>

                  {course.venue_name ? (
                    <Text style={styles.metaText}>📍 {course.venue_name}</Text>
                  ) : null}

                  {course.max_capacity ? (
                    <Text style={styles.metaText}>
                      👥 Capacity: {course.max_capacity}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View Course</Text>
                </View>
              </View>
            </Pressable>
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
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroIcon: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroIconText: {
    fontSize: 30,
  },
  title: {
    color: "#0f172a",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 10,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
  },
  emptyText: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 8,
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
  },
  cover: {
    height: 190,
    width: "100%",
  },
  coverPlaceholder: {
    height: 190,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  coverIcon: {
    fontSize: 46,
  },
  cardBody: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  modeBadge: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  paidBadge: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  courseTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    color: "#64748b",
    lineHeight: 21,
    marginTop: 8,
    fontWeight: "600",
  },
  metaBox: {
    marginTop: 16,
    gap: 8,
  },
  metaText: {
    color: "#475569",
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
    fontWeight: "900",
    textAlign: "center",
  },
});