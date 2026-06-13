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
import { getMyCreatedCourses } from "../../api/courseApi";

export default function MyCreatedCoursesScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getMyCreatedCourses();
      setCourses(Array.isArray(res.data) ? res.data : res.data?.courses || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load created courses");
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
        title="My Created Courses"
        subtitle="Manage courses and sessions"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>My Created Courses</Text>
            <Text style={styles.subtitle}>
              Manage courses, sessions, and registrations.
            </Text>
          </View>

          <Pressable
            style={styles.createBtn}
            onPress={() => navigation.navigate("CreateCourse")}
          >
            <Text style={styles.createBtnText}>Create Course</Text>
          </Pressable>
        </View>

        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No courses created yet.</Text>
          </View>
        ) : (
          courses.map((course) => (
            <View key={course.uuid} style={styles.card}>
              <View style={styles.badgeRow}>
                <Text style={styles.orangeBadge}>{course.status}</Text>
                <Text style={styles.yellowBadge}>{course.course_mode}</Text>
                <Text style={styles.greenBadge}>
                  {course.is_paid ? "Paid" : "Free"}
                </Text>
              </View>

              <Text style={styles.courseTitle}>{course.title}</Text>

              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  📅 {formatDate(course.start_date)} -{" "}
                  {formatDate(course.end_date)}
                </Text>

                <Text style={styles.metaText}>💻 {course.course_mode}</Text>

                <Text style={styles.metaText}>
                  👥 Capacity: {course.max_capacity || "Open"}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.lightBtn}
                  onPress={() =>
                    navigation.navigate("CourseDetails", {
                      uuid: course.uuid,
                    })
                  }
                >
                  <Text style={styles.lightBtnText}>View</Text>
                </Pressable>

                <Pressable
                  style={styles.registrationBtn}
                  onPress={() =>
                    navigation.navigate("CourseRegistrations", {
                      uuid: course.uuid,
                    })
                  }
                >
                  <Text style={styles.registrationBtnText}>Registrations</Text>
                </Pressable>

                <Pressable
                  style={styles.editBtn}
                  onPress={() =>
                    navigation.navigate("EditCourse", {
                      uuid: course.uuid,
                    })
                  }
                >
                  <Text style={styles.editBtnText}>✏️ Edit</Text>
                </Pressable>
              </View>
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
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 22,
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
    lineHeight: 21,
  },
  createBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  createBtnText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
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
  yellowBadge: {
    backgroundColor: "#fef3c7",
    color: "#a16207",
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
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  lightBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lightBtnText: {
    color: "#334155",
    fontWeight: "900",
  },
  registrationBtn: {
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  registrationBtnText: {
    color: "#a16207",
    fontWeight: "900",
  },
  editBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  editBtnText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});