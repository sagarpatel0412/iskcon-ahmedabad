import { useState } from "react";
import { Alert, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import TripForm from "./TripForm";
import { createTrip } from "../../api/tripApi";

const emptyForm = {
  title: "",
  description: "",
  cover_image_url: "",
  centre_id: "",
  start_date: "",
  end_date: "",
  departure_city: "",
  destination: "",
  meeting_point: "",
  meeting_time: "",
  price_amount: "",
  currency: "INR",
  is_paid: false,
  max_capacity: "",
  registration_start_date: "",
  registration_end_date: "",
  includes: "",
  excludes: "",
  rules: "",
  contact_name: "",
  contact_phone: "",
  status: "draft",
  days: [],
  stays: [],
};

export default function CreateTripScreen({ navigation }: any) {
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const res = await createTrip({
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: Number(form.price_amount || 0),
      });

      Alert.alert("Success", "Trip created successfully 🙏");
      navigation.navigate("TripDetails", { uuid: res.data.trip.uuid });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create trip",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff7ed", paddingTop: 48, }}>
      <AppHeader
        title="Trips & Yatras"
        subtitle="trips section"
        showBack
        onBack={() => navigation.goBack()}
      />
      <TripForm
        form={form}
        setForm={setForm}
        saving={saving}
        submitLabel="Create Trip"
        onSubmit={handleSubmit}
      />
    </View>
  );
}
