import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { getMyCreatedTrips } from "../../api/tripApi";

export default function TripRegistrationManageScreen({ navigation }: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyCreatedTrips();
      setTrips(Array.isArray(res.data) ? res.data : res.data?.trips || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
        <Text style={styles.loaderText}>Loading your created yatras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Trip Registrations"
        subtitle="Manage yatra registrations"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mantraBox}>
          <Text style={styles.mantraText}>
            ॐ नमो भगवते वासुदेवाय · Trip Registrations
          </Text>
        </View>

        <Text style={styles.title}>Trip Registration Management</Text>

        <Text style={styles.subtitle}>
          Select a yatra to view registered devotees and seekers.
        </Text>

        {trips.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No trips created yet</Text>
          </View>
        ) : (
          trips.map((trip) => (
            <View key={trip.uuid} style={styles.tripCard}>
              {trip.cover_image_url ? (
                <Image source={{ uri: trip.cover_image_url }} style={styles.cover} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={styles.coverIcon}>🛕</Text>
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statusBadge}>{trip.status}</Text>
                    <Text style={styles.tripTitle}>{trip.title}</Text>
                  </View>

                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>🛣️</Text>
                  </View>
                </View>

                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>
                    📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </Text>

                  <Text style={styles.metaText}>
                    📍 {trip.destination || "-"}
                  </Text>

                  <Text style={styles.metaText}>
                    🚩 Departure: {trip.departure_city || "-"}
                  </Text>

                  <Text style={styles.metaText}>
                    👥 Capacity: {trip.max_capacity || "Unlimited"}
                  </Text>

                  <Text style={styles.metaText}>
                    🎟 {trip.is_paid ? `₹${trip.price_amount}` : "Free Trip"}
                  </Text>
                </View>

                <Pressable
                  style={styles.viewBtn}
                  onPress={() =>
                    navigation.navigate("TripRegistrations", {
                      uuid: trip.uuid,
                    })
                  }
                >
                  <Text style={styles.viewBtnText}>👁 View Registrations</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  title: {
    color: "#1a0a00",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 22,
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
    color: "#1a0a00",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  tripCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 16,
  },
  cover: {
    width: "100%",
    height: 210,
    backgroundColor: "#1a0a00",
  },
  coverPlaceholder: {
    width: "100%",
    height: 210,
    backgroundColor: "#1a0a00",
    alignItems: "center",
    justifyContent: "center",
  },
  coverIcon: {
    fontSize: 52,
  },
  cardBody: {
    padding: 18,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tripTitle: {
    marginTop: 12,
    color: "#1a0a00",
    fontSize: 27,
    fontWeight: "900",
  },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: 18,
    backgroundColor: "#1a0a00",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
  },
  metaBox: {
    marginTop: 18,
    gap: 8,
  },
  metaText: {
    color: "#5c3d1a",
    fontWeight: "800",
  },
  viewBtn: {
    marginTop: 18,
    backgroundColor: "#c8902a",
    borderRadius: 18,
    paddingVertical: 14,
  },
  viewBtnText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
  },
});