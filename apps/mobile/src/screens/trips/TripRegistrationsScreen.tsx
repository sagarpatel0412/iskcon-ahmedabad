import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import {
  getTripByUuid,
  getTripRegistrations,
} from "../../api/tripApi";

export default function TripRegistrationsScreen({ navigation, route }: any) {
  const { uuid } = route.params;

  const [trip, setTrip] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [uuid]);

  const load = async () => {
    try {
      const [tripRes, regRes] = await Promise.all([
        getTripByUuid(uuid),
        getTripRegistrations(uuid),
      ]);

      setTrip(tripRes.data?.trip || tripRes.data);
      setRegistrations(
        Array.isArray(regRes.data) ? regRes.data : regRes.data?.registrations || []
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to load trip registrations");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: registrations.length,
      confirmed: registrations.filter(
        (r) => r.registration_status === "confirmed"
      ).length,
      pending: registrations.filter(
        (r) => r.registration_status === "pending"
      ).length,
      cancelled: registrations.filter(
        (r) => r.registration_status === "cancelled"
      ).length,
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
        title="Trip Registrations"
        subtitle="Registered devotees and seekers"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTag}>Trip Registrations</Text>

          <Text style={styles.heroTitle}>{trip?.title || "Trip"}</Text>

          <Text style={styles.heroMeta}>
            {formatDate(trip?.start_date)} - {formatDate(trip?.end_date)} ·{" "}
            {trip?.destination || "-"}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Confirmed" value={stats.confirmed} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Cancelled" value={stats.cancelled} />
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
              <TripRegistrationCard key={reg.uuid || reg.id} reg={reg} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function TripRegistrationCard({ reg }: { reg: any }) {
  const user = reg.user || {};
  const payment = reg.payment || reg.trip_payment;

  const displayName =
    reg.full_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";

  return (
    <View style={styles.regCard}>
      <View style={styles.regTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{displayName}</Text>

          <Text style={styles.userMeta}>✉️ {reg.email || user?.email || "-"}</Text>
          <Text style={styles.userMeta}>📞 {reg.phone || user?.phone || "-"}</Text>
          <Text style={styles.userMeta}>Age: {reg.age || "-"}</Text>
          <Text style={styles.userMeta}>Gender: {reg.gender || "-"}</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <Badge value={reg.registration_status || "pending"} />
        <Badge value={reg.payment_status || "not_required"} />
      </View>

      <View style={styles.infoGrid}>
        <Info
          label="Emergency Contact"
          value={reg.emergency_contact_name || "-"}
        />
        <Info
          label="Emergency Phone"
          value={reg.emergency_contact_phone || "-"}
        />
        <Info
          label="Payment ID"
          value={payment?.provider_payment_id || "-"}
        />
        <Info
          label="Amount"
          value={
            payment?.amount
              ? `${payment.currency || "INR"} ${payment.amount}`
              : "-"
          }
        />
      </View>

      {reg.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{reg.notes}</Text>
        </View>
      ) : null}
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
  return <Text style={styles.badge}>{value}</Text>;
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value || "-")}</Text>
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
    marginTop: 10,
    color: "#5c3d1a",
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
  },
  statValue: {
    color: "#c8902a",
    fontSize: 36,
    fontWeight: "900",
  },
  statLabel: {
    color: "#8b6914",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 5,
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
    color: "#1a0a00",
    fontSize: 27,
    fontWeight: "900",
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
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
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
  infoGrid: {
    marginTop: 16,
    gap: 8,
  },
  infoItem: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
  },
  infoLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#1a0a00",
    fontWeight: "800",
    marginTop: 4,
  },
  notesBox: {
    marginTop: 14,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
  },
  notesLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  notesText: {
    color: "#1a0a00",
    fontWeight: "800",
    marginTop: 5,
  },
});