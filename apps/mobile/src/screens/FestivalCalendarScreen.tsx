import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CalendarDays,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react-native";

import AppHeader from "../components/AppHeader";
import { getFestivalCalendar } from "../api/festivalCalendarApi";

export default function FestivalCalendarScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState("2026");
  const [city, setCity] = useState("Ahmedabad");
  const [country, setCountry] = useState("India");
  const [loading, setLoading] = useState(false);
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

  useEffect(() => {
    loadCalendar();
  }, []);

  const upcomingEvents = useMemo(() => {
    const today = new Date();

    return events.filter((event) => new Date(event.start) >= today).slice(0, 5);
  }, [events]);

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const date = new Date(event.start);
      return (
        date.getFullYear() === Number(year) && date.getMonth() === monthIndex
      );
    });
  }, [events, monthIndex, year]);

  const calendarDays = useMemo(() => {
    const selectedYear = Number(year);
    const firstDay = new Date(selectedYear, monthIndex, 1);
    const lastDay = new Date(selectedYear, monthIndex + 1, 0);

    const firstWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const blanks = Array.from({ length: firstWeekday }).map(() => null);

    const days = Array.from({ length: daysInMonth }).map((_, index) => {
      const day = index + 1;

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start);

        return (
          eventDate.getFullYear() === selectedYear &&
          eventDate.getMonth() === monthIndex &&
          eventDate.getDate() === day
        );
      });

      return {
        day,
        events: dayEvents,
      };
    });

    return [...blanks, ...days];
  }, [events, monthIndex, year]);

  const loadCalendar = async () => {
    try {
      setLoading(true);

      const data = await getFestivalCalendar({
        year: Number(year),
        city,
        country,
      });

      setEvents(Array.isArray(data) ? data : data?.events || []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load festival calendar",
      );
    } finally {
      setLoading(false);
    }
  };

  const openGoogleCalendar = async (event: any) => {
    const title = event.title;
    const description = `
${event.extendedProps?.description || event.description || ""}

${event.extendedProps?.fasting || event.fasting || ""}
    `.trim();

    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : startDate;

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    };

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}` +
      `&details=${encodeURIComponent(description)}` +
      `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;

    await Linking.openURL(url);
  };

  const changeMonth = (value: number) => {
    setMonthIndex((prev) => {
      if (prev + value < 0) return 11;
      if (prev + value > 11) return 0;
      return prev + value;
    });
  };

  return (
    <View style={styles.page}>
      <AppHeader
        title="Festival Calendar"
        subtitle="Vaishnava Calendar"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroPill}>
            <Sparkles size={15} color="#ffffff" />
            <Text style={styles.heroPillText}>Vaishnava Calendar</Text>
          </View>

          <Text style={styles.heroTitle}>Festival Calendar</Text>

          <Text style={styles.heroText}>
            View ISKCON and Vaishnava festivals by year and location. Tap any
            festival to add it to Google Calendar.
          </Text>

          <View style={styles.heroBadgeRow}>
            <View style={styles.whiteBadge}>
              <MapPin size={14} color="#c2410c" />
              <Text style={styles.whiteBadgeText}>
                {city}, {country}
              </Text>
            </View>

            <View style={styles.darkBadge}>
              <CalendarDays size={14} color="#ffffff" />
              <Text style={styles.darkBadgeText}>{year}</Text>
            </View>
          </View>

          <View style={styles.heroStats}>
            <HeroStat label="Festivals" value={events.length} />
            <HeroStat label="Location" value={city} small />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Search size={22} color="#ea580c" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Generate Calendar</Text>
              <Text style={styles.cardSub}>
                Select year and location to generate festival calendar.
              </Text>
            </View>
          </View>

          <Input
            label="Year"
            value={year}
            onChange={setYear}
            keyboardType="numeric"
          />
          <Input
            label="City"
            value={city}
            onChange={setCity}
            editable={false}
          />
          <Input
            label="Country"
            value={country}
            onChange={setCountry}
            editable={false}
          />

          <Pressable
            style={[styles.loadBtn, loading && styles.disabled]}
            onPress={loadCalendar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Search size={18} color="#ffffff" />
                <Text style={styles.loadBtnText}>Load Calendar</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.monthHeader}>
            <Pressable style={styles.monthBtn} onPress={() => changeMonth(-1)}>
              <Text style={styles.monthBtnText}>‹</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {monthNames[monthIndex]} {year}
            </Text>

            <Pressable style={styles.monthBtn} onPress={() => changeMonth(1)}>
              <Text style={styles.monthBtnText}>›</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.calendarLoader}>
              <ActivityIndicator size="large" color="#ea580c" />
              <Text style={styles.loadingText}>Loading calendar...</Text>
            </View>
          ) : (
            <>
              <View style={styles.weekRow}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <Text key={day} style={styles.weekDay}>
                      {day}
                    </Text>
                  ),
                )}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((item, index) => {
                  if (!item) {
                    return (
                      <View key={`blank-${index}`} style={styles.dayCell} />
                    );
                  }

                  const hasEvent = item.events.length > 0;

                  return (
                    <Pressable
                      key={`day-${item.day}`}
                      style={[styles.dayCell, hasEvent && styles.dayCellActive]}
                      onPress={() => {
                        if (hasEvent) {
                          openGoogleCalendar(item.events[0]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          hasEvent && styles.dayNumberActive,
                        ]}
                      >
                        {item.day}
                      </Text>

                      {hasEvent && (
                        <>
                          <View style={styles.eventDot} />
                          <Text numberOfLines={2} style={styles.dayEventText}>
                            {item.events[0].title}
                          </Text>
                        </>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {monthEvents.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>
                    No festivals found for this month.
                  </Text>
                </View>
              ) : (
                <View style={styles.monthEventList}>
                  <Text style={styles.monthEventTitle}>
                    Festivals this month
                  </Text>

                  {monthEvents.map((event, index) => (
                    <FestivalCard
                      key={`${event.title}-${index}`}
                      event={event}
                      onPress={() => openGoogleCalendar(event)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, styles.yellowIconBox]}>
              <CalendarDays size={22} color="#a16207" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Upcoming Festivals</Text>
              <Text style={styles.cardSub}>
                Next events from this calendar.
              </Text>
            </View>
          </View>

          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No upcoming festivals found.</Text>
            </View>
          ) : (
            upcomingEvents.map((event, index) => (
              <FestivalCard
                key={`${event.title}-${index}`}
                event={event}
                onPress={() => openGoogleCalendar(event)}
              />
            ))
          )}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tip</Text>
          <Text style={styles.tipText}>
            Festival dates can depend on location. Always generate the calendar
            using the city where you will observe the festival.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function FestivalCard({ event, onPress }: any) {
  return (
    <Pressable style={styles.festivalCard} onPress={onPress}>
      <Text style={styles.festivalTitle}>{event.title}</Text>
      <Text style={styles.festivalDate}>{formatDate(event.start)}</Text>

      <View style={styles.externalRow}>
        <ExternalLink size={13} color="#64748b" />
        <Text style={styles.externalText}>Add to Google Calendar</Text>
      </View>
    </Pressable>
  );
}

function HeroStat({ label, value, small }: any) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={small ? styles.heroStatValueSmall : styles.heroStatValue}>
        {value}
      </Text>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType, editable = true }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={String(value || "")}
        onChangeText={onChange}
        keyboardType={keyboardType}
        editable={editable}
        style={[styles.input, !editable && styles.inputDisabled]}
        placeholderTextColor="#fb923c"
      />
    </View>
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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  content: {
    padding: 16,
    paddingBottom: 44,
  },
  hero: {
    minHeight: 340,
    borderRadius: 36,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#ea580c",
    marginBottom: 18,
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "900",
    marginTop: 22,
  },
  heroText: {
    color: "#ffedd5",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  heroBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 18,
  },
  whiteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  whiteBadgeText: {
    color: "#c2410c",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },
  darkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(67,20,7,0.35)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  darkBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  heroStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 24,
    padding: 16,
  },
  heroStatLabel: {
    color: "#ffedd5",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
  },
  heroStatValueSmall: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 9,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
    alignItems: "center",
  },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 17,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  yellowIconBox: {
    backgroundColor: "#fef3c7",
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 23,
    fontWeight: "900",
  },
  cardSub: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 3,
  },
  inputWrap: {
    marginBottom: 13,
  },
  inputLabel: {
    color: "#334155",
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#0f172a",
    fontWeight: "800",
  },
  inputDisabled: {
    opacity: 0.75,
  },
  loadBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  loadBtnText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },
  disabled: {
    opacity: 0.65,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthBtn: {
    height: 42,
    width: 42,
    borderRadius: 16,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  monthBtnText: {
    color: "#ea580c",
    fontSize: 30,
    fontWeight: "900",
    marginTop: -2,
  },
  monthTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  calendarLoader: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#c2410c",
    fontWeight: "900",
    marginTop: 10,
  },
  eventList: {
    gap: 10,
  },
  festivalCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  festivalTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },
  festivalDate: {
    color: "#ea580c",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },
  externalRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 9,
  },
  externalText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontWeight: "800",
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 28,
    padding: 20,
  },
  tipTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  tipText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 9,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    color: "#9a3412",
    fontSize: 11,
    fontWeight: "900",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    minHeight: 74,
    borderWidth: 0.5,
    borderColor: "#fed7aa",
    backgroundColor: "#fff7ed",
    padding: 5,
  },
  dayCellActive: {
    backgroundColor: "#ffedd5",
  },
  dayNumber: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
  },
  dayNumberActive: {
    color: "#c2410c",
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ea580c",
    marginTop: 5,
  },
  dayEventText: {
    color: "#9a3412",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 4,
    lineHeight: 12,
  },
  monthEventList: {
    marginTop: 18,
  },
  monthEventTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
});
