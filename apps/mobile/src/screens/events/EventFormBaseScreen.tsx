import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppHeader from "../../components/AppHeader";
import { uploadEventPoster } from "../../api/eventApi";

type Status = "draft" | "published" | "cancelled" | "completed";

type Props = {
  mode: "create" | "edit";
  navigation: any;
  initialEvent?: any;
  loadingPage?: boolean;
  onSubmit: (payload: any) => Promise<any>;
};

export default function EventFormBaseScreen({
  mode,
  navigation,
  initialEvent,
  loadingPage = false,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    centre_id: 1,
    title: "",
    description: "",
    poster_url: "",
    location: "",
    event_date: "",
    start_time: "",
    end_time: "",
    registration_start_at: "",
    registration_end_at: "",
    max_capacity: "",
    is_paid: false,
    price_amount: "",
    currency: "INR",
    status: "draft" as Status,
  });

  const [selectedPoster, setSelectedPoster] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialEvent) return;

    setForm({
      centre_id: initialEvent.centre_id || 1,
      title: initialEvent.title || "",
      description: initialEvent.description || "",
      poster_url: initialEvent.poster_url || "",
      location: initialEvent.location || "",
      event_date: initialEvent.event_date || "",
      start_time: initialEvent.start_time || "",
      end_time: initialEvent.end_time || "",
      registration_start_at: initialEvent.registration_start_at || "",
      registration_end_at: initialEvent.registration_end_at || "",
      max_capacity:
        initialEvent.max_capacity !== null && initialEvent.max_capacity !== undefined
          ? String(initialEvent.max_capacity)
          : "",
      is_paid: Boolean(initialEvent.is_paid),
      price_amount: initialEvent.price_amount ? String(initialEvent.price_amount) : "",
      currency: initialEvent.currency || "INR",
      status: initialEvent.status || "draft",
    });
  }, [initialEvent]);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickPoster = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedPoster(result.assets[0]);
    }
  };

  const getErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) return message.join("\n");

    return message || error?.message || fallback;
  };

  const save = async (status?: Status) => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        status: status || form.status,
        centre_id: Number(form.centre_id),
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        is_paid: form.is_paid,
        price_amount: form.is_paid ? Number(form.price_amount || 0) : 0,
        registration_start_at: form.registration_start_at || undefined,
        registration_end_at: form.registration_end_at || undefined,
      };

      const res = await onSubmit(payload);
      const event = res.data?.event || res.data;
      const eventUuid = event?.uuid || initialEvent?.uuid;

      if (selectedPoster && eventUuid) {
        await uploadEventPoster(eventUuid, selectedPoster);
      }

      Alert.alert(
        "Success",
        mode === "create" ? "Event created successfully" : "Event updated successfully"
      );

      if (mode === "create" && eventUuid) {
        navigation.navigate("EditEvent", { eventUuid });
      } else {
        navigation.goBack();
      }
    } catch (error: any) {
      console.log("SAVE EVENT ERROR:", JSON.stringify(error?.response?.data, null, 2));
      Alert.alert("Error", getErrorMessage(error, "Failed to save event"));
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
      </View>
    );
  }

  const posterPreview = selectedPoster?.uri || form.poster_url;

  return (
    <View style={styles.page}>
      <AppHeader
        title={mode === "create" ? "Create Event" : "Edit Event"}
        subtitle="Fill event details, poster, timing and payment settings"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.draftButton, saving && styles.disabled]}
            onPress={() => save("draft")}
            disabled={saving}
          >
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </Pressable>

          <Pressable
            style={[styles.publishButton, saving && styles.disabled]}
            onPress={() => save("published")}
            disabled={saving}
          >
            <Text style={styles.publishButtonText}>
              {saving
                ? "Saving..."
                : mode === "create"
                ? "Publish Event"
                : "Update Event"}
            </Text>
          </Pressable>
        </View>

        <Card title="Basic Information">
          <Input label="Event Title *" value={form.title} onChange={(v: string) => update("title", v)} />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v: string) => update("description", v)}
          />

          <Input label="Event Date *" placeholder="YYYY-MM-DD" value={form.event_date} onChange={(v: string) => update("event_date", v)} />
          <Input label="Location" value={form.location} onChange={(v: string) => update("location", v)} />
          <Input label="Start Time" placeholder="HH:mm" value={form.start_time} onChange={(v: string) => update("start_time", v)} />
          <Input label="End Time" placeholder="HH:mm" value={form.end_time} onChange={(v: string) => update("end_time", v)} />
        </Card>

        <Card title="Registration Window">
          <Input
            label="Registration Opens"
            placeholder="2026-05-25T09:00:00.000Z"
            value={form.registration_start_at}
            onChange={(v: string) => update("registration_start_at", v)}
          />

          <Input
            label="Registration Closes"
            placeholder="2026-05-30T17:00:00.000Z"
            value={form.registration_end_at}
            onChange={(v: string) => update("registration_end_at", v)}
          />

          <Input
            label="Max Capacity"
            placeholder="100"
            value={form.max_capacity}
            keyboardType="numeric"
            onChange={(v: string) => update("max_capacity", v)}
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {(["draft", "published", "cancelled", "completed"] as Status[]).map((item) => (
              <Pressable
                key={item}
                style={[styles.statusButton, form.status === item && styles.statusButtonActive]}
                onPress={() => update("status", item)}
              >
                <Text style={[styles.statusText, form.status === item && styles.statusTextActive]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card title="Payment Settings">
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Paid Event</Text>
              <Text style={styles.switchSubtitle}>Enable payment for registration.</Text>
            </View>

            <Switch value={form.is_paid} onValueChange={(v) => update("is_paid", v)} />
          </View>

          {form.is_paid && (
            <>
              <Input
                label="Price Amount"
                value={form.price_amount}
                keyboardType="numeric"
                onChange={(v: string) => update("price_amount", v)}
              />

              <Input
                label="Currency"
                value={form.currency}
                onChange={(v: string) => update("currency", v)}
              />
            </>
          )}
        </Card>

        <Card title="Event Poster">
          <Pressable style={styles.posterBox} onPress={pickPoster}>
            <Text style={styles.posterIcon}>🖼️</Text>
            <Text style={styles.posterTitle}>
              {selectedPoster ? "Poster Selected ✅" : "Upload Poster"}
            </Text>
            <Text style={styles.posterHint}>JPG, PNG, WEBP up to 5MB</Text>
          </Pressable>

          {posterPreview ? (
            <Image source={{ uri: posterPreview }} style={styles.posterImage} />
          ) : null}
        </Card>

        <Card title="Preview">
          <View style={styles.previewCard}>
            <Text style={styles.previewTag}>ISKCON AHMEDABAD</Text>
            <Text style={styles.previewTitle}>{form.title || "Event Title"}</Text>
            <Text style={styles.previewMeta}>
              {form.event_date || "Date"} · {form.start_time || "Time"} ·{" "}
              {form.is_paid ? `₹${form.price_amount || 0}` : "Free"}
            </Text>
          </View>
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

function Input({ label, value, onChange, keyboardType = "default", placeholder = "" }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder || label}
        placeholderTextColor="#b08a52"
        value={value || ""}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={label}
        placeholderTextColor="#b08a52"
        value={value || ""}
        onChangeText={onChange}
        multiline
      />
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  draftButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingVertical: 14,
    marginRight: 8,
  },
  draftButtonText: {
    textAlign: "center",
    color: "#5c3d1a",
    fontWeight: "900",
  },
  publishButton: {
    flex: 1,
    backgroundColor: "#c8902a",
    borderRadius: 16,
    paddingVertical: 14,
    marginLeft: 8,
  },
  publishButtonText: {
    textAlign: "center",
    color: "#1a0a00",
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.7,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 14,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5c3d1a",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#1a0a00",
    fontWeight: "800",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    backgroundColor: "#f7f0e4",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 15,
  },
  switchSubtitle: {
    color: "#9a7a4a",
    fontWeight: "700",
    fontSize: 12,
    marginTop: 3,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  statusText: {
    color: "#5c3d1a",
    fontWeight: "900",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: "#1a0a00",
  },
  posterBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ede0c8",
    backgroundColor: "#f7f0e4",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  posterIcon: {
    fontSize: 38,
  },
  posterTitle: {
    marginTop: 8,
    color: "#5c3d1a",
    fontWeight: "900",
  },
  posterHint: {
    marginTop: 4,
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "700",
  },
  posterImage: {
    marginTop: 14,
    width: "100%",
    height: 220,
    borderRadius: 18,
    backgroundColor: "#f7f0e4",
  },
  previewCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  previewTag: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  previewTitle: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  previewMeta: {
    marginTop: 8,
    color: "#d4a853",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});