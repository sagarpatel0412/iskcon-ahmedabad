import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { CalendarDays, Clock, MapPin, QrCode, Ticket, X } from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import { getMyRegistrations } from "../../api/eventApi";

const API_ORIGIN = "http://localhost:3000";

export default function MyRegistrationsScreen({ navigation }: any) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const res = await getMyRegistrations();
      const list = res.data?.registrations || res.data || [];
      setRegistrations(Array.isArray(list) ? list : []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load registrations"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRegistrations();
    }, [])
  );

  const getImageUrl = (posterUrl?: string) => {
    if (!posterUrl) {
      return "https://iskconahmedabad.com/images/gallery/gallery2.jpg";
    }

    if (posterUrl.startsWith("http")) {
      return posterUrl;
    }

    return `${API_ORIGIN}${posterUrl}`;
  };

  const getQrPayload = (registration: any) => {
    const event = registration.event || registration.Event;

    return JSON.stringify({
      type: "event_attendance",
      event_uuid: event?.uuid,
      registration_uuid: registration.uuid,
      qr_token: registration.qr_token,
    });
  };

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
        title="My Registrations"
        subtitle="Events and QR entry passes"
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
              fetchRegistrations();
            }}
          />
        }
      >
        <Text style={styles.omText}>
          ॐ नमो भगवते वासुदेवाय · My Registered Events
        </Text>

        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>My Registered Events</Text>
          <Text style={styles.pageSubtitle}>
            View your event registrations and entry QR codes.
          </Text>
        </View>

        {registrations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🙏</Text>
            <Text style={styles.emptyTitle}>No registered events</Text>
            <Text style={styles.emptyText}>
              Your registered events will appear here.
            </Text>
          </View>
        ) : (
          registrations.map((registration) => {
            const event = registration.event || registration.Event || {};

            return (
              <Pressable
                key={registration.uuid}
                onPress={() => setSelectedRegistration(registration)}
                style={styles.card}
              >
                <Image
                  source={{ uri: getImageUrl(event.poster_url) }}
                  style={styles.poster}
                />

                <View style={styles.badgeRow}>
                  <View style={styles.successBadge}>
                    <Text style={styles.successBadgeText}>
                      {registration.status || "registered"}
                    </Text>
                  </View>

                  <View style={styles.goldBadge}>
                    <Text style={styles.goldBadgeText}>
                      {event.is_paid ? `Paid · ₹${event.price_amount || 0}` : "Free"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.title}>{event?.title || "Event"}</Text>

                <View style={styles.metaBox}>
                  <Text style={styles.meta}>📅 {formatDate(event?.event_date)}</Text>
                  <Text style={styles.meta}>
                    🕐 {event?.start_time || "-"} - {event?.end_time || "-"}
                  </Text>
                  <Text style={styles.meta}>📍 {event?.location || "-"}</Text>
                </View>

                <Pressable
                  style={styles.qrButton}
                  onPress={() => setSelectedRegistration(registration)}
                >
                  <QrCode size={18} color="#d4a853" />
                  <Text style={styles.qrButtonText}>Show QR Code</Text>
                </Pressable>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={!!selectedRegistration}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRegistration(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedRegistration && (
              <RegistrationPassModal
                registration={selectedRegistration}
                getQrPayload={getQrPayload}
                getImageUrl={getImageUrl}
                onClose={() => setSelectedRegistration(null)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function RegistrationPassModal({
  registration,
  getQrPayload,
  getImageUrl,
  onClose,
}: any) {
  const event = registration.event || registration.Event || {};
  const qrValue = getQrPayload(registration);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalSmall}>Event Pass</Text>
          <Text style={styles.modalTitle}>{event?.title || "Registered Event"}</Text>
        </View>

        <Pressable style={styles.closeIconButton} onPress={onClose}>
          <X size={22} color="#1a0a00" />
        </Pressable>
      </View>

      <Image
        source={{ uri: getImageUrl(event.poster_url) }}
        style={styles.modalPoster}
      />

      <View style={styles.modalInfoGrid}>
        <ModalInfo icon={CalendarDays} label="Date" value={formatDate(event.event_date)} />
        <ModalInfo
          icon={Clock}
          label="Time"
          value={`${event.start_time || "-"} - ${event.end_time || "-"}`}
        />
        <ModalInfo icon={MapPin} label="Location" value={event.location || "-"} />
        <ModalInfo
          icon={Ticket}
          label="Status"
          value={registration.status || "registered"}
        />
      </View>

      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Entry QR Code</Text>

        <View style={styles.qrWrapper}>
          {registration.qr_token ? (
            <QRCode value={qrValue} size={220} />
          ) : (
            <View style={styles.qrMissing}>
              <Text style={styles.qrMissingText}>QR token missing</Text>
            </View>
          )}
        </View>

        <Text style={styles.qrHelp}>
          Show this QR code at the event entry gate. Devotee will scan this for
          attendance.
        </Text>

        {!!registration.qr_token && (
          <Text numberOfLines={2} style={styles.tokenText}>
            Token: {registration.qr_token}
          </Text>
        )}
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.paymentLabel}>Payment</Text>
        <Text style={styles.paymentAmount}>
          {event?.is_paid ? `₹${event?.price_amount || 0}` : "Free"}
        </Text>
        <Text style={styles.paymentStatus}>
          {event?.is_paid
            ? registration.payment_status || "Payment status"
            : "No payment required"}
        </Text>
      </View>

      <View style={styles.organiserCard}>
        <Text style={styles.organiserSmall}>🪔 Organised by</Text>

        <View style={styles.organiserRow}>
          <Image
            source={{ uri: "https://iskconahmedabad.com/images/logo.png" }}
            style={styles.logo}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.organiserTitle}>
              {event?.centre?.name || "ISKCON Ahmedabad"}
            </Text>
            <Text style={styles.organiserText}>Official Temple Event</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Pass</Text>
      </Pressable>
    </ScrollView>
  );
}

function ModalInfo({ icon: Icon, label, value }: any) {
  return (
    <View style={styles.modalInfoCard}>
      <View style={styles.modalInfoIcon}>
        <Icon size={18} color="#8b6914" />
      </View>
      <Text style={styles.modalInfoLabel}>{label}</Text>
      <Text style={styles.modalInfoValue}>{String(value || "-")}</Text>
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
  headerBlock: {
    marginBottom: 18,
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
    lineHeight: 21,
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
    color: "#9a7a4a",
    textAlign: "center",
    fontWeight: "700",
  },
  card: {
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
  poster: {
    width: "100%",
    height: 180,
    borderRadius: 22,
    marginBottom: 14,
    backgroundColor: "#1a0a00",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  successBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  successBadgeText: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 11,
    textTransform: "uppercase",
  },
  goldBadge: {
    backgroundColor: "#f5e8c8",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  goldBadgeText: {
    color: "#8b6914",
    fontWeight: "900",
    fontSize: 11,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1a0a00",
    lineHeight: 30,
  },
  metaBox: {
    marginTop: 10,
    gap: 7,
  },
  meta: {
    color: "#9a7a4a",
    fontWeight: "800",
  },
  qrButton: {
    marginTop: 16,
    backgroundColor: "#1a0a00",
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  qrButtonText: {
    color: "#d4a853",
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: "#fdfaf5",
    borderRadius: 30,
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  modalSmall: {
    color: "#c8902a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  modalTitle: {
    marginTop: 5,
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    flexShrink: 1,
  },
  closeIconButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  modalPoster: {
    width: "100%",
    height: 190,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: "#1a0a00",
  },
  modalInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  modalInfoCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ede0c8",
    padding: 12,
  },
  modalInfoIcon: {
    height: 36,
    width: 36,
    borderRadius: 12,
    backgroundColor: "#f5e8c8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },
  modalInfoLabel: {
    color: "#9a7a4a",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modalInfoValue: {
    marginTop: 4,
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 12,
  },
  qrCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#c8902a",
    borderRadius: 26,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  qrTitle: {
    color: "#8b6914",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  qrWrapper: {
    marginTop: 16,
    marginBottom: 14,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  qrMissing: {
    height: 220,
    width: 220,
    backgroundColor: "#f7f0e4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  qrMissingText: {
    color: "#9a7a4a",
    fontWeight: "900",
  },
  qrHelp: {
    color: "#9a7a4a",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 20,
    fontSize: 12,
  },
  tokenText: {
    marginTop: 12,
    backgroundColor: "#f7f0e4",
    borderRadius: 12,
    padding: 10,
    color: "#5c3d1a",
    fontSize: 11,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
  },
  paymentCard: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#1a0a00",
    borderRadius: 24,
    padding: 18,
  },
  paymentLabel: {
    color: "#d4a853",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 11,
  },
  paymentAmount: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
  },
  paymentStatus: {
    color: "#d4a853",
    marginTop: 6,
    fontWeight: "800",
  },
  organiserCard: {
    backgroundColor: "#f5e8c8",
    borderWidth: 1,
    borderColor: "#c8902a",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  organiserSmall: {
    color: "#8b6914",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  organiserRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#c8902a",
    backgroundColor: "#ffffff",
  },
  organiserTitle: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 15,
  },
  organiserText: {
    color: "#9a7a4a",
    fontWeight: "800",
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: "#1a0a00",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#d4a853",
    fontWeight: "900",
  },
});