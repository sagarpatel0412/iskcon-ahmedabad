import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import AppHeader from "../../components/AppHeader";
import { scanEventQr } from "../../api/eventApi";

export default function ScanQrScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleQrScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    try {
      setScanned(true);
      setLoading(true);

      let parsed: any = null;

      try {
        parsed = JSON.parse(data);
      } catch {
        Alert.alert("Invalid QR", "This QR code is not valid for event entry.");
        return;
      }

      if (parsed?.type !== "event_attendance" || !parsed?.qr_token) {
        Alert.alert("Invalid QR", "This QR code is not an event attendance QR.");
        return;
      }

      const res = await scanEventQr({
        qr_token: parsed.qr_token,
      });

      setLastResult(res.data);

      Alert.alert(
        "Entry Approved ✅",
        res.data?.message || "Attendance marked successfully"
      );
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Alert.alert(
        "Scan Failed",
        Array.isArray(message)
          ? message.join("\n")
          : message || "Unable to mark attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <AppHeader
          title="Scan QR"
          subtitle="Camera permission required"
          showBack
          onBack={() => navigation.goBack()}
        />

        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            Please allow camera access to scan seeker event QR codes.
          </Text>

          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Allow Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Scan QR"
        subtitle="Grant seeker entry"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.scannerCard}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleQrScanned}
        />

        <View style={styles.scanFrame}>
          <Text style={styles.scanText}>Scan seeker QR</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.statusText}>Verifying QR...</Text>
        </View>
      )}

      {lastResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Last Entry Approved</Text>
          <Text style={styles.resultText}>
            Event: {lastResult?.event?.title || "-"}
          </Text>
          <Text style={styles.resultText}>
            Seeker:{" "}
            {lastResult?.seeker?.first_name
              ? `${lastResult.seeker.first_name} ${lastResult.seeker.last_name || ""}`
              : "-"}
          </Text>
        </View>
      )}

      <Pressable
        style={styles.rescanButton}
        onPress={() => {
          setScanned(false);
          setLastResult(null);
        }}
      >
        <Text style={styles.rescanText}>Scan Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionCard: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1e3a8a",
  },
  permissionText: {
    marginTop: 8,
    color: "#1d4ed8",
    textAlign: "center",
    lineHeight: 22,
  },
  scannerCard: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#000",
    height: 600,
    borderWidth: 3,
    borderColor: "#2563eb",
  },
  camera: {
    flex: 1,
  },
  scanFrame: {
    position: "absolute",
    top: "32%",
    left: "15%",
    right: "15%",
    height: 170,
    borderWidth: 3,
    borderColor: "#ffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
  scanText: {
    color: "#ffffff",
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  statusText: {
    color: "#1e3a8a",
    fontWeight: "800",
  },
  resultCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  resultTitle: {
    color: "#15803d",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  resultText: {
    color: "#1e3a8a",
    fontWeight: "700",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  rescanButton: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 18,
  },
  rescanText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
});