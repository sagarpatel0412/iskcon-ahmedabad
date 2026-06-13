import { useState } from "react";
import { Alert } from "react-native";

import CourseFormScreen, { emptyCourseForm } from "./CourseFormScreen";
import { createCourse } from "../../api/courseApi";

export default function CreateCourseScreen({ navigation }: any) {
  const [form, setForm] = useState<any>(emptyCourseForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const res = await createCourse({
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: form.is_paid ? Number(form.price_amount || 0) : 0,
      });

      const course = res.data?.course || res.data;

      Alert.alert("Success", "Course created successfully 🙏");
      navigation.navigate("CourseDetails", { uuid: course.uuid });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create course"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <CourseFormScreen
      mode="create"
      form={form}
      setForm={setForm}
      saving={saving}
      submitLabel="Create Course"
      onSubmit={handleSubmit}
      navigation={navigation}
    />
  );
}