import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function TripForm({ form, setForm, onSubmit, submitLabel, saving }: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addDay = () => {
    update("days", [
      ...(form.days || []),
      {
        day_number: (form.days?.length || 0) + 1,
        title: "",
        description: "",
        date: "",
        breakfast_info: "",
        lunch_info: "",
        dinner_info: "",
        places: [],
      },
    ]);
  };

  const updateDay = (index: number, key: string, value: any) => {
    const days = [...(form.days || [])];
    days[index][key] = value;
    update("days", days);
  };

  const addPlace = (dayIndex: number) => {
    const days = [...(form.days || [])];
    days[dayIndex].places = [
      ...(days[dayIndex].places || []),
      {
        place_name: "",
        description: "",
        visit_time: "",
        location_url: "",
        image_url: "",
      },
    ];
    update("days", days);
  };

  const updatePlace = (dayIndex: number, placeIndex: number, key: string, value: any) => {
    const days = [...(form.days || [])];
    days[dayIndex].places[placeIndex][key] = value;
    update("days", days);
  };

  const addStay = () => {
    update("stays", [
      ...(form.stays || []),
      {
        stay_name: "",
        stay_type: "other",
        address: "",
        check_in_date: "",
        check_out_date: "",
        contact_phone: "",
        location_url: "",
        notes: "",
      },
    ]);
  };

  const updateStay = (index: number, key: string, value: any) => {
    const stays = [...(form.stays || [])];
    stays[index][key] = value;
    update("stays", stays);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Basic Details">
        <Input label="Title" value={form.title} onChange={(v:any) => update("title", v)} />
        <Input label="Destination" value={form.destination} onChange={(v:any) => update("destination", v)} />
        <Input label="Description" value={form.description} onChange={(v:any) => update("description", v)} multiline />
        <Input label="Cover Image URL" value={form.cover_image_url} onChange={(v:any) => update("cover_image_url", v)} />
        <Input label="Start Date YYYY-MM-DD" value={form.start_date} onChange={(v:any) => update("start_date", v)} />
        <Input label="End Date YYYY-MM-DD" value={form.end_date} onChange={(v:any) => update("end_date", v)} />
        <Input label="Departure City" value={form.departure_city} onChange={(v:any) => update("departure_city", v)} />
        <Input label="Meeting Point" value={form.meeting_point} onChange={(v:any) => update("meeting_point", v)} />
        <Input label="Meeting Time HH:mm" value={form.meeting_time} onChange={(v:any) => update("meeting_time", v)} />
      </Section>

      <Section title="Payment & Registration">
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Paid Trip</Text>
          <Switch value={!!form.is_paid} onValueChange={(v:any) => update("is_paid", v)} />
        </View>

        <Input label="Price Amount" value={String(form.price_amount || "")} onChange={(v:any) => update("price_amount", v)} keyboardType="numeric" />
        <Input label="Currency" value={form.currency} onChange={(v:any) => update("currency", v)} />
        <Input label="Max Capacity" value={String(form.max_capacity || "")} onChange={(v:any) => update("max_capacity", v)} keyboardType="numeric" />
        <Input label="Registration Start YYYY-MM-DD HH:mm:ss" value={form.registration_start_date} onChange={(v:any) => update("registration_start_date", v)} />
        <Input label="Registration End YYYY-MM-DD HH:mm:ss" value={form.registration_end_date} onChange={(v:any) => update("registration_end_date", v)} />
        <Input label="Status draft/published/cancelled/completed" value={form.status} onChange={(v:any) => update("status", v)} />
      </Section>

      <Section title="Extra Info">
        <Input label="Includes" value={form.includes} onChange={(v:any) => update("includes", v)} multiline />
        <Input label="Excludes" value={form.excludes} onChange={(v:any) => update("excludes", v)} multiline />
        <Input label="Rules" value={form.rules} onChange={(v:any) => update("rules", v)} multiline />
        <Input label="Contact Name" value={form.contact_name} onChange={(v:any) => update("contact_name", v)} />
        <Input label="Contact Phone" value={form.contact_phone} onChange={(v:any) => update("contact_phone", v)} />
      </Section>

      <Section title="Stay Details">
        {(form.stays || []).map((stay: any, index: number) => (
          <View key={index} style={styles.subCard}>
            <Text style={styles.subTitle}>Stay {index + 1}</Text>
            <Input label="Stay Name" value={stay.stay_name} onChange={(v:any) => updateStay(index, "stay_name", v)} />
            <Input label="Stay Type" value={stay.stay_type} onChange={(v:any) => updateStay(index, "stay_type", v)} />
            <Input label="Address" value={stay.address} onChange={(v:any) => updateStay(index, "address", v)} multiline />
            <Input label="Check In YYYY-MM-DD" value={stay.check_in_date} onChange={(v:any) => updateStay(index, "check_in_date", v)} />
            <Input label="Check Out YYYY-MM-DD" value={stay.check_out_date} onChange={(v:any) => updateStay(index, "check_out_date", v)} />
            <Input label="Contact Phone" value={stay.contact_phone} onChange={(v:any) => updateStay(index, "contact_phone", v)} />
            <Input label="Location URL" value={stay.location_url} onChange={(v:any) => updateStay(index, "location_url", v)} />
            <Input label="Notes" value={stay.notes} onChange={(v:any) => updateStay(index, "notes", v)} multiline />
          </View>
        ))}

        <Pressable style={styles.secondaryButton} onPress={addStay}>
          <Text style={styles.secondaryButtonText}>+ Add Stay</Text>
        </Pressable>
      </Section>

      <Section title="Daily Itinerary">
        {(form.days || []).map((day: any, dayIndex: number) => (
          <View key={dayIndex} style={styles.subCard}>
            <Text style={styles.subTitle}>Day {dayIndex + 1}</Text>

            <Input label="Day Number" value={String(day.day_number || "")} onChange={(v:any) => updateDay(dayIndex, "day_number", Number(v))} keyboardType="numeric" />
            <Input label="Date YYYY-MM-DD" value={day.date} onChange={(v:any) => updateDay(dayIndex, "date", v)} />
            <Input label="Title" value={day.title} onChange={(v:any) => updateDay(dayIndex, "title", v)} />
            <Input label="Description" value={day.description} onChange={(v:any) => updateDay(dayIndex, "description", v)} multiline />
            <Input label="Breakfast" value={day.breakfast_info} onChange={(v:any) => updateDay(dayIndex, "breakfast_info", v)} multiline />
            <Input label="Lunch" value={day.lunch_info} onChange={(v:any) => updateDay(dayIndex, "lunch_info", v)} multiline />
            <Input label="Dinner" value={day.dinner_info} onChange={(v:any) => updateDay(dayIndex, "dinner_info", v)} multiline />

            {(day.places || []).map((place: any, placeIndex: number) => (
              <View key={placeIndex} style={styles.placeCard}>
                <Text style={styles.placeTitle}>Place {placeIndex + 1}</Text>
                <Input label="Place Name" value={place.place_name} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "place_name", v)} />
                <Input label="Visit Time HH:mm" value={place.visit_time} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "visit_time", v)} />
                <Input label="Description" value={place.description} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "description", v)} multiline />
                <Input label="Location URL" value={place.location_url} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "location_url", v)} />
                <Input label="Image URL" value={place.image_url} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "image_url", v)} />
              </View>
            ))}

            <Pressable style={styles.secondaryButton} onPress={() => addPlace(dayIndex)}>
              <Text style={styles.secondaryButtonText}>+ Add Place</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.secondaryButton} onPress={addDay}>
          <Text style={styles.secondaryButtonText}>+ Add Day</Text>
        </Pressable>
      </Section>

      <Pressable style={styles.primaryButton} onPress={onSubmit} disabled={saving}>
        <Text style={styles.primaryButtonText}>{saving ? "Saving..." : submitLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({ label, value, onChange, keyboardType, multiline }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
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
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff7ed" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "#0f172a", marginBottom: 12 },
  inputWrap: { marginBottom: 12 },
  label: { fontWeight: "800", color: "#334155", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0f172a",
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  switchText: { fontWeight: "900", color: "#0f172a" },
  subCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },
  subTitle: { fontSize: 16, fontWeight: "900", color: "#9a3412", marginBottom: 10 },
  placeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  placeTitle: { fontWeight: "900", color: "#0f172a", marginBottom: 8 },
  primaryButton: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  secondaryButton: {
    backgroundColor: "#ffedd5",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  secondaryButtonText: { color: "#c2410c", fontWeight: "900" },
});