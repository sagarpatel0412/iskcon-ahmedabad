import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import TripForm from "./TripForm";
import { getTripByUuid, updateTrip } from "../../api/tripApi";

export default function EditTripScreen({ route, navigation }: any) {
  const { uuid } = route.params;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [uuid]);

  const loadTrip = async () => {
    try {
      const res = await getTripByUuid(uuid);
      const trip = res.data;

      setForm({
        ...trip,
        centre_id: trip.centre_id ? String(trip.centre_id) : "",
        max_capacity: trip.max_capacity ? String(trip.max_capacity) : "",
        price_amount: trip.price_amount ? String(trip.price_amount) : "",
        days: trip.days || [],
        stays: trip.stays || [],
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load trip",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateTrip(uuid, {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: Number(form.price_amount || 0),
      });

      Alert.alert("Success", "Trip updated successfully 🙏");
      navigation.navigate("TripDetails", { uuid });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update trip",
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
        <Text style={{ marginTop: 10, color: "#9a3412", fontWeight: "800" }}>
          Loading trip...
        </Text>
      </View>
    );
  }

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
        submitLabel="Update Trip"
        onSubmit={handleSubmit}
      />
    </View>
  );
}
