import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";

import {
  deleteEvent,
  getEventByUuid,
  getEventFormFields,
} from "../../api/eventApi";

const API_ORIGIN = "http://localhost:3000";

export default function DevoteeEventDetailsScreen({
  navigation,
  route,
}: any) {
  const { eventUuid } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      setLoading(true);

      const eventRes = await getEventByUuid(eventUuid);

      const eventData =
        eventRes.data?.event || eventRes.data;

      setEvent(eventData);

      const formRes = await getEventFormFields(eventUuid);

      setFields(
        formRes.data?.fields ||
          formRes.data ||
          []
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to load event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(event.uuid);

              Alert.alert(
                "Success",
                "Event deleted successfully"
              );

              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                "Delete Failed",
                error?.response?.data?.message ||
                  "Failed to delete event"
              );
            }
          },
        },
      ]
    );
  };

  const posterUrl = event?.poster_url
    ? event.poster_url.startsWith("http")
      ? event.poster_url
      : `${API_ORIGIN}${event.poster_url}`
    : "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator
          size="large"
          color="#2563eb"
        />
      </View>
    );
  }

  const hasForm = fields.length > 0;

  return (
    <View style={styles.page}>
      <AppHeader
        title="Event Details"
        subtitle="Manage your event"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={{ uri: posterUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.overlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {event?.status || "draft"}
              </Text>
            </View>

            <Text style={styles.title}>
              {event?.title}
            </Text>

            <Text style={styles.description}>
              {event?.description}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.infoCard}>
          <InfoRow
            label="Date"
            value={event?.event_date || "-"}
          />

          <InfoRow
            label="Time"
            value={`${event?.start_time || "-"} - ${
              event?.end_time || "-"
            }`}
          />

          <InfoRow
            label="Location"
            value={event?.location || "-"}
          />

          <InfoRow
            label="Capacity"
            value={
              event?.max_capacity
                ? String(event.max_capacity)
                : "Unlimited"
            }
          />

          <InfoRow
            label="Price"
            value={
              event?.is_paid
                ? `₹${event?.price_amount}`
                : "Free Event"
            }
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            Dynamic Form Fields
          </Text>

          {fields.length === 0 ? (
            <Text style={styles.emptyText}>
              No dynamic form created yet.
            </Text>
          ) : (
            fields.map((field) => (
              <View
                key={field.uuid}
                style={styles.fieldItem}
              >
                <Text style={styles.fieldLabel}>
                  {field.label}
                </Text>

                <Text style={styles.fieldType}>
                  {field.field_type}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.buttonGrid}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("EditEvent", {
                eventUuid: event.uuid,
              })
            }
          >
            <Text style={styles.primaryBtnText}>
              Edit Event
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() =>
              navigation.navigate(
                "CreateEventForm",
                {
                  eventUuid: event.uuid,
                  mode: hasForm
                    ? "edit"
                    : "create",
                }
              )
            }
          >
            <Text style={styles.secondaryBtnText}>
              {hasForm
                ? "Edit Form"
                : "Create Form"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.scanBtn}
            onPress={() =>
              navigation.navigate("ScanQr", {
                eventUuid: event.uuid,
              })
            }
          >
            <Text style={styles.scanBtnText}>
              Scan QR
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteBtn}
            onPress={handleDelete}
          >
            <Text style={styles.deleteBtnText}>
              Delete Event
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 48,
  },

  loaderPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  hero: {
    height: 360,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 18,
  },

  heroImage: {
    borderRadius: 30,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor:
      "rgba(15,23,42,0.45)",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },

  badgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },

  description: {
    color: "#e2e8f0",
    marginTop: 10,
    lineHeight: 22,
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 18,
  },

  infoRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  infoLabel: {
    color: "#64748b",
    fontWeight: "800",
    marginBottom: 4,
  },

  infoValue: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 15,
  },

  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },

  emptyText: {
    color: "#64748b",
    fontWeight: "700",
  },

  fieldItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  fieldLabel: {
    color: "#0f172a",
    fontWeight: "900",
  },

  fieldType: {
    marginTop: 4,
    color: "#64748b",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "800",
  },

  buttonGrid: {
    gap: 12,
  },

  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 18,
  },

  primaryBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },

  secondaryBtn: {
    backgroundColor: "#eff6ff",
    paddingVertical: 15,
    borderRadius: 18,
  },

  secondaryBtnText: {
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },

  scanBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 15,
    borderRadius: 18,
  },

  scanBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },

  deleteBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 18,
  },

  deleteBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },
});