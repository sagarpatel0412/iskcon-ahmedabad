import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  CalendarDays,
  Eye,
  MapPin,
  Search,
} from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import {
  getPublicEvents,
  registerForEvent,
  getEventFormFields,
} from "../../api/eventApi";

import { registerForEventFlow } from "../../api/eventRegistrationFlow";

export default function BrowseEventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await getPublicEvents();
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch = event.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus = status === "all" || event.status === status;

      return matchSearch && matchStatus;
    });
  }, [events, search, status]);

  const openRegistration = async (event: any) => {
    try {
      setSelectedEvent({
        ...event,
        form_fields: [],
        loadingForm: true,
      });

      setAnswers({});

      const res = await getEventFormFields(event.uuid);
      const fields = res.data?.fields || res.data || [];

      setSelectedEvent({
        ...event,
        form_fields: Array.isArray(fields) ? fields : [],
        loadingForm: false,
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load event form"
      );

      setSelectedEvent(null);
    }
  };

  const updateAnswer = (fieldKey: string, value: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const submitRegistration = async () => {
    try {
      if (!selectedEvent) return;

      const fields = selectedEvent.form_fields || [];

      for (const field of fields) {
        if (field.is_required && !answers[field.field_key]) {
          Alert.alert("Validation", `${field.label} is required`);
          return;
        }
      }

      setRegistering(true);

      await registerForEventFlow({
        event: selectedEvent,
        answers,
        navigation,
      });

      Alert.alert("Success", "Registered successfully 🙏");
      setSelectedEvent(null);
      navigation.navigate("MyRegistrations");
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Alert.alert(
        "Registration Failed",
        Array.isArray(message)
          ? message.join("\n")
          : message || "Failed to register"
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Events"
        subtitle="ISKCON Ahmedabad temple events"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
        {selectedEvent ? (
          <RegistrationView
            selectedEvent={selectedEvent}
            answers={answers}
            registering={registering}
            updateAnswer={updateAnswer}
            submitRegistration={submitRegistration}
            onCancel={() => setSelectedEvent(null)}
          />
        ) : (
          <>
            <View style={styles.topIntro}>
              <Text style={styles.omText}>
                ॐ नमो भगवते वासुदेवाय · ISKCON Ahmedabad
              </Text>

              <Text style={styles.pageTitle}>Events</Text>

              <Text style={styles.pageSubtitle}>
                Discover spiritual programs, festivals, kirtans and community
                events.
              </Text>
            </View>

            <View style={styles.filterRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statusRow}
              >
                {["all", "published", "draft", "cancelled", "completed"].map(
                  (item) => (
                    <Pressable
                      key={item}
                      onPress={() => setStatus(item)}
                      style={[
                        styles.statusChip,
                        status === item && styles.statusChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          status === item && styles.statusChipTextActive,
                        ]}
                      >
                        {item.toUpperCase()}
                      </Text>
                    </Pressable>
                  )
                )}
              </ScrollView>

              <View style={styles.searchBox}>
                <Search size={18} color="#9a7a4a" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search events..."
                  placeholderTextColor="#9a7a4a"
                  style={styles.searchInput}
                />
              </View>
            </View>

            {filteredEvents.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🪔</Text>
                <Text style={styles.emptyTitle}>No events available</Text>
                <Text style={styles.emptyText}>
                  Published events will appear here.
                </Text>
              </View>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.uuid}
                  event={event}
                  onView={() =>
                    navigation.navigate("EventDetails", {
                      eventUuid: event.uuid,
                    })
                  }
                  onRegister={() => openRegistration(event)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function EventCard({
  event,
  onView,
  onRegister,
}: {
  event: any;
  onView: () => void;
  onRegister: () => void;
}) {
  const poster =
    event.poster_url ||
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1200";

  return (
    <View style={styles.eventCard}>
      <ImageBackground
        source={{ uri: poster }}
        style={styles.eventImageWrap}
        imageStyle={styles.eventImage}
      >
        <View style={styles.imageOverlay}>
          <View style={styles.eventHeader}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>
                {formatDate(event.event_date)}
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {event.status || "published"}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.eventTitle}>{event.title}</Text>

            <Text style={styles.eventDescription} numberOfLines={2}>
              {event.description || "No description available"}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.eventBody}>
        <View style={styles.metaBox}>
          <MetaLine icon="🕐" text={`${event.start_time || "-"} – ${event.end_time || "-"}`} />
          <MetaLine icon="📍" text={event.location || "-"} />
          <MetaLine
            icon="🎟"
            text={event.is_paid ? `₹${event.price_amount}` : "Free Event"}
          />
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.viewBtn} onPress={onView}>
            <Eye size={16} color="#d4a853" />
            <Text style={styles.viewBtnText}>View</Text>
          </Pressable>

          <Pressable style={styles.registerBtnDark} onPress={onRegister}>
            <CalendarDays size={16} color="#1a0a00" />
            <Text style={styles.registerBtnDarkText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function RegistrationView({
  selectedEvent,
  answers,
  registering,
  updateAnswer,
  submitRegistration,
  onCancel,
}: any) {
  return (
    <View>
      <View style={styles.registrationHero}>
        <Text style={styles.registrationLabel}>Event Registration</Text>

        <Text style={styles.registrationTitle}>{selectedEvent.title}</Text>

        <View style={styles.registrationMeta}>
          <Text style={styles.registrationMetaText}>
            📍 {selectedEvent.location || "-"}
          </Text>
          <Text style={styles.registrationMetaText}>
            📅 {selectedEvent.event_date || "-"}
          </Text>
          <Text style={styles.registrationMetaText}>
            ⏰ {selectedEvent.start_time || "-"} - {selectedEvent.end_time || "-"}
          </Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Registration Form</Text>

        {selectedEvent.loadingForm ? (
          <ActivityIndicator size="large" color="#c8902a" />
        ) : (selectedEvent.form_fields || []).length === 0 ? (
          <Text style={styles.noFormText}>
            No extra form required. Tap confirm registration to continue.
          </Text>
        ) : (
          selectedEvent.form_fields.map((field: any) => (
            <View key={field.uuid || field.field_key}>
              <Text style={styles.label}>
                {field.label} {field.is_required ? "*" : ""}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  field.field_type === "textarea" && styles.textArea,
                ]}
                placeholder={field.label}
                placeholderTextColor="#9a7a4a"
                keyboardType={field.field_type === "number" ? "numeric" : "default"}
                multiline={field.field_type === "textarea"}
                value={answers[field.field_key] || ""}
                onChangeText={(text) => updateAnswer(field.field_key, text)}
              />
            </View>
          ))
        )}

        <Pressable
          style={[styles.confirmBtn, registering && styles.disabled]}
          onPress={submitRegistration}
          disabled={registering}
        >
          <Text style={styles.confirmBtnText}>
            {registering ? "Registering..." : "Confirm Registration"}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetaLine({ icon, text }: { icon: string; text: string }) {
  return (
    <Text style={styles.metaText}>
      {icon} {text}
    </Text>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
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
  topIntro: {
    marginBottom: 20,
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
  },
  pageTitle: {
    marginTop: 18,
    fontSize: 38,
    fontWeight: "900",
    color: "#1a0a00",
  },
  pageSubtitle: {
    marginTop: 5,
    color: "#9a7a4a",
    fontWeight: "800",
    lineHeight: 21,
  },
  filterRow: {
    marginBottom: 18,
  },
  statusRow: {
    gap: 8,
    paddingBottom: 12,
  },
  statusChip: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  statusChipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  statusChipText: {
    color: "#5c3d1a",
    fontSize: 11,
    fontWeight: "900",
  },
  statusChipTextActive: {
    color: "#1a0a00",
  },
  searchBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#1a0a00",
    fontWeight: "800",
    paddingVertical: 9,
  },
  eventCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#1a0a00",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  eventImageWrap: {
    height: 210,
  },
  eventImage: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  imageOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(26,10,0,0.48)",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateBadge: {
    backgroundColor: "#c8902a",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dateBadgeText: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 11,
  },
  statusBadge: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusBadgeText: {
    color: "#5c3d1a",
    fontWeight: "900",
    fontSize: 11,
    textTransform: "uppercase",
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32,
  },
  eventDescription: {
    color: "#f5e8c8",
    marginTop: 8,
    lineHeight: 21,
    fontWeight: "700",
  },
  eventBody: {
    padding: 16,
  },
  metaBox: {
    gap: 7,
  },
  metaText: {
    color: "#9a7a4a",
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ede0c8",
    paddingTop: 14,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#1a0a00",
    borderRadius: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  viewBtnText: {
    color: "#d4a853",
    fontWeight: "900",
  },
  registerBtnDark: {
    flex: 1,
    backgroundColor: "#c8902a",
    borderRadius: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  registerBtnDarkText: {
    color: "#1a0a00",
    fontWeight: "900",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1a0a00",
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#9a7a4a",
    fontWeight: "700",
  },
  registrationHero: {
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  registrationLabel: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  registrationTitle: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  registrationMeta: {
    marginTop: 16,
    gap: 7,
  },
  registrationMetaText: {
    color: "#f5e8c8",
    fontWeight: "800",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ede0c8",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5c3d1a",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    color: "#1a0a00",
    fontWeight: "700",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  noFormText: {
    color: "#9a7a4a",
    marginBottom: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  confirmBtn: {
    backgroundColor: "#15803d",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  confirmBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
  },
  cancelBtn: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    paddingVertical: 13,
    borderRadius: 16,
    marginTop: 10,
  },
  cancelBtnText: {
    color: "#8b6914",
    textAlign: "center",
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.6,
  },
});