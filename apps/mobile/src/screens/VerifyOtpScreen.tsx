import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { api } from "../api/client";
import { saveToken, saveUser } from "../storage/authStorage";

export default function VerifyOtpScreen({ route, navigation }: any) {
  const { email, mode, registerData } = route.params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    return message || error?.message || "Something went wrong";
  };

  const verifyOtp = async () => {
    try {
      if (!otp || otp.length < 4) {
        Alert.alert("Validation", "Please enter valid OTP");
        return;
      }

      setLoading(true);

      const verifyRes = await api.post("/auth/verify-otp", {
        email,
        otp,
        purpose: mode,
      });

      if (mode === "register") {
        await api.post("/auth/register", registerData);

        Alert.alert("Success", "Account created successfully. Please login.");

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });

        return;
      }

      if (mode === "login") {
        await saveToken(verifyRes.data.token);
        await saveUser(verifyRes.data.user);

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });

        return;
      }
    } catch (error: any) {
      console.log("OTP VERIFY ERROR:", error?.response?.data || error);

      Alert.alert("OTP Failed", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.hero}>
        <Image
          source={{
            uri: "https://iskconahmedabad.com/images/logo.png",
          }}
          style={styles.logo}
        />

        <Text style={styles.heroSmall}>ISKCON Ahmedabad</Text>

        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>We sent a verification code to</Text>

        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Verification Code</Text>

          <Text style={styles.cardText}>
            Please enter the OTP received in your email.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor="#9a7a4a"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={verifyOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Change email address</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Hare Krishna 🙏</Text>

          <Text style={styles.infoText}>
            Verification helps us keep your account secure and ensures genuine
            devotees and seekers are part of the community.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdfaf5",
  },

  hero: {
    backgroundColor: "#1a0a00",
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  logo: {
    width: 92,
    height: 92,
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#c8902a",
    marginBottom: 18,
  },

  heroSmall: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#d4a853",
    textTransform: "uppercase",
  },

  title: {
    marginTop: 10,
    fontSize: 34,
    fontWeight: "900",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 10,
    color: "#f5e8c8",
    fontSize: 15,
    fontWeight: "700",
  },

  email: {
    marginTop: 8,
    color: "#d4a853",
    fontSize: 16,
    fontWeight: "900",
  },

  content: {
    padding: 18,
    marginTop: -20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#1a0a00",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1a0a00",
    textAlign: "center",
  },

  cardText: {
    marginTop: 8,
    color: "#8b6914",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    paddingVertical: 18,
    fontSize: 26,
    letterSpacing: 10,
    textAlign: "center",
    color: "#1a0a00",
    fontWeight: "900",
  },

  button: {
    backgroundColor: "#c8902a",
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 18,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },

  link: {
    marginTop: 18,
    textAlign: "center",
    color: "#8b6914",
    fontWeight: "900",
  },

  infoCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
  },

  infoTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },

  infoText: {
    marginTop: 8,
    color: "#d4a853",
    lineHeight: 22,
    fontWeight: "700",
  },
});
