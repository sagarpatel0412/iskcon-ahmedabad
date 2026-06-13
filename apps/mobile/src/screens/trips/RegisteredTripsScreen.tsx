import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import { getMyTripRegistrations } from "../../api/tripApi";

export default function RegisteredTripsScreen({ navigation }: any) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const res = await getMyTripRegistrations();
      setRegistrations(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const priceText = (reg: any) => {
    if (!reg.payment) return "Free";
    return `${reg.payment.currency === "INR" ? "₹" : reg.payment.currency}${
      reg.payment.amount
    }`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading registered trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Trips & Yatras"
        subtitle="trips section"
        showBack
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={registrations}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.pageTitle}>My Registered Yatras</Text>
            <Text style={styles.pageText}>
              View your confirmed and pending trip registrations.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No registrations yet</Text>
            <Text style={styles.emptyText}>
              Register for upcoming yatras from Trips page.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const trip = item.trip;

          return (
            <View style={styles.card}>
              {trip?.cover_image_url ? (
                <Image
                  source={{ uri: trip.cover_image_url }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>Yatra</Text>
                </View>
              )}

              <View style={styles.body}>
                <View style={styles.badgeRow}>
                  <Text style={styles.statusBadge}>
                    {item.registration_status}
                  </Text>

                  <Text
                    style={
                      item.payment_status === "success" ||
                      item.payment_status === "not_required"
                        ? styles.successBadge
                        : styles.pendingBadge
                    }
                  >
                    {item.payment_status}
                  </Text>
                </View>

                <Text style={styles.title}>{trip?.title || "Trip"}</Text>

                <Text style={styles.meta}>📍 {trip?.destination || "-"}</Text>
                <Text style={styles.meta}>
                  📅 {formatDate(trip?.start_date)} -{" "}
                  {formatDate(trip?.end_date)}
                </Text>
                <Text style={styles.meta}>💳 {priceText(item)}</Text>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Registered Name</Text>
                  <Text style={styles.infoValue}>{item.full_name}</Text>

                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{item.phone}</Text>
                </View>

                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate("TripDetails", { uuid: trip?.uuid })
                  }
                >
                  <Text style={styles.primaryButtonText}>View Trip</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  center: {
    flex: 1,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9a3412",
    fontWeight: "800",
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hero: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  pageText: {
    marginTop: 5,
    color: "#64748b",
  },
  createButton: {
    backgroundColor: "#ea580c",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#334155",
  },
  emptyText: {
    marginTop: 6,
    color: "#64748b",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fed7aa",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 165,
  },
  imagePlaceholder: {
    height: 165,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    color: "#ea580c",
    fontSize: 22,
    fontWeight: "900",
  },
  body: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  paidBadge: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
  },
  successBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  pendingBadge: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
  meta: {
    marginTop: 8,
    color: "#475569",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: "#ffedd5",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#c2410c",
    fontWeight: "900",
  },
  infoBox: {
    marginTop: 14,
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 12,
  },
  infoLabel: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    marginTop: 3,
    color: "#0f172a",
    fontWeight: "800",
  },
});
