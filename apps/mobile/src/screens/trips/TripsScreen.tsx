// src/screens/trips/TripsScreen.tsx

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getTrips } from "../../api/tripApi";
import AppHeader from "../../components/AppHeader";

export default function TripsScreen({ navigation }: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await getTrips();
      setTrips(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const goToDetails = (uuid: string) => {
    navigation.navigate("TripDetails", { uuid });
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const priceText = (trip: any) => {
    if (!trip.is_paid || Number(trip.price_amount) <= 0) return "Free";

    return `${trip.currency === "INR" ? "₹" : trip.currency}${trip.price_amount}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ea580c" />
          <Text style={styles.loadingText}>Loading trips...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />

      <View style={styles.screen}>
        <AppHeader
          title="Trips & Yatras"
          subtitle="Spiritual journeys"
          showBack
          onBack={() => navigation.goBack()}
        />

        <FlatList
          data={trips}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#ea580c"]}
              tintColor="#ea580c"
            />
          }
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Spiritual Trips & Yatras</Text>
              <Text style={styles.heroText}>
                Join multi-day devotional trips with stay, itinerary, prasadam,
                and places to visit.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No trips available</Text>
              <Text style={styles.emptyText}>
                Upcoming yatras will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => goToDetails(item.uuid)}
            >
              {item.cover_image_url ? (
                <Image
                  source={{ uri: item.cover_image_url }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Yatra</Text>
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{item.destination}</Text>

                  <Text
                    style={[
                      styles.priceBadge,
                      item.is_paid ? styles.paidBadge : styles.freeBadge,
                    ]}
                  >
                    {priceText(item)}
                  </Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.description} numberOfLines={2}>
                  {item.description ||
                    "A devotional yatra organized for seekers and devotees."}
                </Text>

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    📅 {formatDate(item.start_date)} -{" "}
                    {formatDate(item.end_date)}
                  </Text>

                  {item.departure_city ? (
                    <Text style={styles.infoText}>
                      📍 From {item.departure_city}
                    </Text>
                  ) : null}

                  {item.max_capacity ? (
                    <Text style={styles.infoText}>
                      👥 Capacity: {item.max_capacity}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.button}>
                  <Text style={styles.buttonText}>View Details</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff7ed",
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
    fontWeight: "700",
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  hero: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
  },
  heroText: {
    marginTop: 8,
    color: "#64748b",
    lineHeight: 22,
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 30,
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
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: "100%",
    height: 180,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#ea580c",
    fontWeight: "900",
    fontSize: 22,
  },
  cardBody: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
  },
  paidBadge: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
  description: {
    marginTop: 8,
    color: "#64748b",
    lineHeight: 21,
  },
  infoBox: {
    marginTop: 14,
    gap: 7,
  },
  infoText: {
    color: "#475569",
    fontWeight: "600",
  },
  button: {
    marginTop: 18,
    backgroundColor: "#ea580c",
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});