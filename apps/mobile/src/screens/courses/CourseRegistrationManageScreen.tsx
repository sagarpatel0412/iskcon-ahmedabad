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

export default function CourseRegistrationManageScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyCreatedCourses();
      setCourses(Array.isArray(res.data) ? res.data : res.data?.courses || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Course Registrations"
        subtitle="View registrations for your courses"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Course Registrations</Text>
        <Text style={styles.subtitle}>View registrations for your courses.</Text>

        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No courses created yet.</Text>
          </View>
        ) : (
          courses.map((course) => (
            <View key={course.uuid} style={styles.courseCard}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>📖</Text>
                </View>

                <Text style={styles.statusBadge}>{course.status}</Text>
              </View>

              <Text style={styles.courseTitle}>{course.title}</Text>

              <Text numberOfLines={3} style={styles.description}>
                {course.description || "Spiritual learning course."}
              </Text>

              <Pressable
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate("CourseRegistrations", {
                    uuid: course.uuid,
                  })
                }
              >
                <Text style={styles.viewBtnText}>👁 View Registrations</Text>
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
    backgroundColor: "#f0e8d8",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#f0e8d8",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#5c3d1a",
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: "#1a0a00",
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 22,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 34,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyText: {
    marginTop: 10,
    color: "#5c3d1a",
    fontWeight: "900",
    textAlign: "center",
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 18,
    backgroundColor: "#f5e8c8",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 25,
  },
  statusBadge: {
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  courseTitle: {
    marginTop: 18,
    color: "#1a0a00",
    fontSize: 27,
    fontWeight: "900",
  },
  description: {
    marginTop: 10,
    color: "#5c3d1a",
    fontWeight: "800",
    lineHeight: 21,
  },
  viewBtn: {
    marginTop: 18,
    backgroundColor: "#c8902a",
    borderRadius: 18,
    paddingVertical: 14,
  },
  viewBtnText: {
    color: "#1a0a00",
    fontWeight: "900",
    textAlign: "center",
  },
});