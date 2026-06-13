import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import CourseFormScreen from "./CourseFormScreen";
import { getCourseByUuid, updateCourse } from "../../api/courseApi";

export default function EditCourseScreen({ navigation, route }: any) {
  const { uuid } = route.params;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [uuid]);

  const loadCourse = async () => {
    try {
      setLoading(true);

      const res = await getCourseByUuid(uuid);
      const course = res.data?.course || res.data;

      setForm({
        ...course,
        centre_id: course.centre_id ? String(course.centre_id) : "",
        max_capacity: course.max_capacity ? String(course.max_capacity) : "",
        price_amount: course.price_amount ? String(course.price_amount) : "",
        sessions: course.sessions || [],
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load course"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateCourse(uuid, {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: form.is_paid ? Number(form.price_amount || 0) : 0,
      });

      Alert.alert("Success", "Course updated successfully 🙏");
      navigation.navigate("CourseDetails", { uuid });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff7ed",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <CourseFormScreen
      mode="edit"
      form={form}
      setForm={setForm}
      saving={saving}
      submitLabel="Update Course"
      onSubmit={handleSubmit}
      navigation={navigation}
    />
  );
}