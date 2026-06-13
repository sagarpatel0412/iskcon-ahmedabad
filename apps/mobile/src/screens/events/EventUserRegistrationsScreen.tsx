import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { getEventByUuid, getEventRegistrations } from "../../api/eventApi";

export default function EventUserRegistrationsScreen({ navigation, route }: any) {
  const { eventUuid } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [eventUuid]);

  const load = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        getEventByUuid(eventUuid),
        getEventRegistrations(eventUuid),
      ]);

      setEvent(eventRes.data?.event || eventRes.data);
      setRegistrations(
        Array.isArray(regRes.data) ? regRes.data : regRes.data?.registrations || []
      );
    } catch (error: any) {
      console.log("REGISTRATIONS ERROR:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: registrations.length,
      registered: registrations.filter((r) => r.status === "registered").length,
      attended: registrations.filter((r) => r.status === "attended").length,
    };
  }, [registrations]);

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading registrations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Registered Users"
        subtitle="Event registration list"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTag}>Event Registrations</Text>
          <Text style={styles.heroTitle}>{event?.title || "Event"}</Text>
          <Text style={styles.heroMeta}>
            {event?.event_date || "-"} · {event?.start_time || "-"} -{" "}
            {event?.end_time || "-"}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Registered" value={stats.registered} />
          <StatCard label="Attended" value={stats.attended} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Registered Users</Text>
            <Text style={styles.countBadge}>
              {registrations.length} registrations
            </Text>
          </View>

          {registrations.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>No registrations yet</Text>
            </View>
          ) : (
            registrations.map((reg) => (
              <RegistrationCard key={reg.uuid || reg.id} reg={reg} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function RegistrationCard({ reg }: { reg: any }) {
  const user = reg.user || {};

  return (
    <View style={styles.regCard}>
      <View style={styles.regTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>
            {user?.first_name || "User"} {user?.last_name || ""}
          </Text>

          <Text style={styles.userMeta}>✉️ {user?.email || "-"}</Text>
          <Text style={styles.userMeta}>📞 {user?.phone || "-"}</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <Badge value={reg.status || "registered"} />
        <Badge value={reg.payment_status || "not_required"} />
      </View>

      {reg.form_answers && (
        <View style={styles.answersBox}>
          <Text style={styles.answersTitle}>Form Answers</Text>

          {Object.entries(reg.form_answers).map(([key, value]) => (
            <View key={key} style={styles.answerItem}>
              <Text style={styles.answerKey}>{key}</Text>
              <Text style={styles.answerValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <Text style={styles.badge}>
      {value}
    </Text>
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
  hero: {
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
  },
  heroTag: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  heroTitle: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },
  heroMeta: {
    marginTop: 10,
    color: "#d4a853",
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#c8902a",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "900",
    color: "#8b6914",
    textTransform: "uppercase",
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1a0a00",
  },
  countBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  emptyCard: {
    backgroundColor: "#fdfaf5",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyTitle: {
    marginTop: 10,
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 24,
    textAlign: "center",
  },
  regCard: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  regTop: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 18,
    backgroundColor: "#c8902a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#1a0a00",
    fontSize: 22,
    fontWeight: "900",
  },
  userName: {
    color: "#1a0a00",
    fontSize: 22,
    fontWeight: "900",
  },
  userMeta: {
    color: "#5c3d1a",
    fontWeight: "800",
    marginTop: 5,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  badge: {
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  answersBox: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
  },
  answersTitle: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  answerItem: {
    backgroundColor: "#fdfaf5",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  answerKey: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  answerValue: {
    color: "#1a0a00",
    fontWeight: "800",
    marginTop: 4,
  },
});