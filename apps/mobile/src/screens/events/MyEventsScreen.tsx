import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  Plus,
  QrCode,
  Trash2,
} from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import { deleteEvent, getMyEvents } from "../../api/eventApi";

export default function MyEventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      const list = res.data?.events || res.data || [];
      setEvents(Array.isArray(list) ? list : []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load events"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEvents();
    }, [])
  );

  const handleDelete = (eventUuid: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEvent(eventUuid);
            fetchEvents();
          } catch (error: any) {
            Alert.alert(
              "Delete Failed",
              error?.response?.data?.message || "Failed to delete event"
            );
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading your events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="My Events"
        subtitle="Events created by you"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor="#c8902a"
            onRefresh={() => {
              setRefreshing(true);
              fetchEvents();
            }}
          />
        }
      >
        <Text style={styles.omText}>
          ॐ नमो भगवते वासुदेवाय · Event Management
        </Text>

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>My Events</Text>
            <Text style={styles.pageSubtitle}>Events created by you.</Text>
          </View>

          <Pressable
            style={styles.createIconButton}
            onPress={() => navigation.navigate("CreateEvent")}
          >
            <Plus size={22} color="#1a0a00" />
          </Pressable>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Plus size={18} color="#1a0a00" />
          <Text style={styles.createButtonText}>Create New Event</Text>
        </Pressable>

        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🪔</Text>
            <Text style={styles.emptyTitle}>No events created yet</Text>
            <Text style={styles.emptyText}>
              Create your first ISKCON Ahmedabad event.
            </Text>
          </View>
        ) : (
          events.map((event) => {
            const hasForm = event.form_fields?.length > 0;

            return (
              <View key={event.uuid} style={styles.eventCard}>
                <View style={styles.rowTop}>
                  <DateBox date={event.event_date} />

                  <View style={styles.eventMain}>
                    <View style={styles.badgeRow}>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>
                          {event.status || "draft"}
                        </Text>
                      </View>

                      <View style={styles.priceBadge}>
                        <Text style={styles.priceBadgeText}>
                          {event.is_paid
                            ? `₹${event.price_amount || 0}`
                            : "Free"}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <Text style={styles.eventMeta}>
                      {formatDate(event.event_date)} · {event.start_time || "-"} ·{" "}
                      {event.location || "-"}
                    </Text>
                  </View>
                </View>

                {!!event.description && (
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                )}

                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>
                    🕐 {event.start_time || "-"} - {event.end_time || "-"}
                  </Text>
                  <Text style={styles.metaText}>
                    📍 {event.location || "-"}
                  </Text>
                  <Text style={styles.metaText}>
                    👥 Capacity: {event.max_capacity || "Unlimited"}
                  </Text>
                </View>

                <View style={styles.actionGrid}>
                  <ActionButton
                    icon={Eye}
                    text="View"
                    dark
                    onPress={() =>
                      navigation.navigate("DevoteeEventDetails", {
                        eventUuid: event.uuid,
                      })
                    }
                  />

                  <ActionButton
                    icon={Edit3}
                    text="Edit"
                    onPress={() =>
                      navigation.navigate("EditEvent", {
                        eventUuid: event.uuid,
                      })
                    }
                  />

                  <ActionButton
                    icon={FileText}
                    text={hasForm ? "Edit Form" : "Create Form"}
                    onPress={() =>
                      navigation.navigate("CreateEventForm", {
                        eventUuid: event.uuid,
                        mode: hasForm ? "edit" : "create",
                      })
                    }
                  />

                  <ActionButton
                    icon={QrCode}
                    text="Scan QR"
                    success
                    onPress={() =>
                      navigation.navigate("ScanQr", {
                        eventUuid: event.uuid,
                      })
                    }
                  />
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(event.uuid)}
                >
                  <Trash2 size={16} color="#991b1b" />
                  <Text style={styles.deleteButtonText}>Delete Event</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function DateBox({ date }: { date?: string }) {
  const day = date ? new Date(date).getDate() : "-";
  const month = date
    ? new Date(date).toLocaleString("en-IN", { month: "short" })
    : "";

  return (
    <View style={styles.dateBox}>
      <Text style={styles.dateDay}>{day}</Text>
      <Text style={styles.dateMonth}>{month}</Text>
    </View>
  );
}

function ActionButton({
  icon: Icon,
  text,
  onPress,
  dark,
  success,
}: {
  icon: any;
  text: string;
  onPress: () => void;
  dark?: boolean;
  success?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionButton,
        dark && styles.darkButton,
        success && styles.successButton,
      ]}
    >
      <Icon
        size={16}
        color={dark ? "#d4a853" : success ? "#ffffff" : "#5c3d1a"}
      />
      <Text
        style={[
          styles.actionButtonText,
          dark && styles.darkButtonText,
          success && styles.successButtonText,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#8b6914",
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
  omText: {
    backgroundColor: "#1a0a00",
    color: "#d4a853",
    textAlign: "center",
    paddingVertical: 10,
    borderRadius: 18,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    overflow: "hidden",
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1a0a00",
  },
  pageSubtitle: {
    marginTop: 4,
    color: "#9a7a4a",
    fontWeight: "800",
  },
  createIconButton: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "#c8902a",
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#c8902a",
    paddingVertical: 15,
    borderRadius: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#1a0a00",
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#9a7a4a",
    fontWeight: "700",
  },
  eventCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ede0c8",
    marginBottom: 18,
    shadowColor: "#1a0a00",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  rowTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  dateBox: {
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8902a",
    backgroundColor: "#f5e8c8",
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1a0a00",
  },
  dateMonth: {
    marginTop: -2,
    fontSize: 11,
    fontWeight: "900",
    color: "#8b6914",
    textTransform: "uppercase",
  },
  eventMain: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "#f5e8c8",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: "#8b6914",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase",
  },
  priceBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceBadgeText: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase",
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1a0a00",
    lineHeight: 28,
  },
  eventMeta: {
    marginTop: 5,
    color: "#9a7a4a",
    fontWeight: "800",
    lineHeight: 20,
  },
  eventDescription: {
    marginTop: 14,
    color: "#5c3d1a",
    lineHeight: 22,
    fontWeight: "600",
  },
  metaBox: {
    marginTop: 14,
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 20,
    padding: 14,
    gap: 7,
  },
  metaText: {
    color: "#5c3d1a",
    fontWeight: "800",
  },
  actionGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  actionButtonText: {
    color: "#5c3d1a",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 12,
  },
  darkButton: {
    backgroundColor: "#1a0a00",
    borderColor: "#1a0a00",
  },
  darkButtonText: {
    color: "#d4a853",
  },
  successButton: {
    backgroundColor: "#15803d",
    borderColor: "#15803d",
  },
  successButtonText: {
    color: "#ffffff",
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  deleteButtonText: {
    color: "#991b1b",
    fontWeight: "900",
  },
});