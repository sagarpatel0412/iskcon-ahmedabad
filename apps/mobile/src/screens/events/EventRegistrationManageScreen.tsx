import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { getMyEvents } from "../../api/eventApi";

export default function EventRegistrationManageScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyEvents();
      setEvents(Array.isArray(res.data) ? res.data : res.data?.events || []);
    } catch (error: any) {
      console.log("MY EVENTS ERROR:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading your created events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Event Registrations"
        subtitle="Manage registered seekers and devotees"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mantraBox}>
          <Text style={styles.mantraText}>
            ॐ नमो भगवते वासुदेवाय · Event Registrations
          </Text>
        </View>

        <Text style={styles.title}>Event Registration Management</Text>
        <Text style={styles.subtitle}>
          Select an event to view registered devotees and seekers.
        </Text>

        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No events created yet</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.uuid} style={styles.eventCard}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statusBadge}>{event.status}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>

                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>📅</Text>
                </View>
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaText}>📅 {event.event_date || "-"}</Text>
                <Text style={styles.metaText}>
                  🕐 {event.start_time || "-"} - {event.end_time || "-"}
                </Text>
                <Text style={styles.metaText}>📍 {event.location || "-"}</Text>
                <Text style={styles.metaText}>
                  👥 Capacity: {event.max_capacity || "Unlimited"}
                </Text>
                <Text style={styles.metaText}>
                  🎟 {event.is_paid ? `₹${event.price_amount}` : "Free Event"}
                </Text>
              </View>

              <Pressable
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate("EventUserRegistrations", {
                    eventUuid: event.uuid,
                  })
                }
              >
                <Text style={styles.viewButtonText}>👁 View Registrations</Text>
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
    marginTop: 12,
    color: "#5c3d1a",
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  mantraBox: {
    backgroundColor: "#1a0a00",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  mantraText: {
    color: "#d4a853",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 8,
  },
  subtitle: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginBottom: 20,
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
    fontSize: 44,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 25,
    fontWeight: "900",
    color: "#1a0a00",
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  eventTitle: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "900",
    color: "#1a0a00",
  },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "#1a0a00",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 22,
  },
  metaBox: {
    marginTop: 18,
  },
  metaText: {
    color: "#5c3d1a",
    fontWeight: "800",
    marginBottom: 8,
  },
  viewButton: {
    marginTop: 14,
    backgroundColor: "#c8902a",
    paddingVertical: 14,
    borderRadius: 18,
  },
  viewButtonText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },
});