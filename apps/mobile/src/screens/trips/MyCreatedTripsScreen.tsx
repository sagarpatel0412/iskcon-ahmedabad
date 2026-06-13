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
import { getMyCreatedTrips } from "../../api/tripApi";

export default function MyCreatedTripsScreen({ navigation }: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await getMyCreatedTrips();
      setTrips(res.data || []);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading created trips...</Text>
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
        data={trips}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.pageTitle}>My Created Yatras</Text>
              <Text style={styles.pageText}>Manage trips created by you.</Text>
            </View>

            <Pressable
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateTrip")}
            >
              <Text style={styles.createButtonText}>+ Create</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No trips created yet</Text>
            <Text style={styles.emptyText}>
              Create your first spiritual yatra.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.cover_image_url ? (
              <Image
                source={{ uri: item.cover_image_url }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>Yatra</Text>
              </View>
            )}

            <View style={styles.body}>
              <View style={styles.badgeRow}>
                <Text style={styles.statusBadge}>{item.status}</Text>
                <Text
                  style={item.is_paid ? styles.paidBadge : styles.freeBadge}
                >
                  {item.is_paid ? "Paid" : "Free"}
                </Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.meta}>📍 {item.destination}</Text>
              <Text style={styles.meta}>
                📅 {formatDate(item.start_date)} - {formatDate(item.end_date)}
              </Text>
              <Text style={styles.meta}>
                👥 Capacity: {item.max_capacity || "Open"}
              </Text>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() =>
                    navigation.navigate("TripDetails", { uuid: item.uuid })
                  }
                >
                  <Text style={styles.secondaryButtonText}>View</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={() =>
                    navigation.navigate("TripRegistrations", {
                      uuid: item.uuid,
                    })
                  }
                >
                  <Text style={styles.secondaryButtonText}>Registrations</Text>
                </Pressable>

                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate("EditTrip", { uuid: item.uuid })
                  }
                >
                  <Text style={styles.primaryButtonText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
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
