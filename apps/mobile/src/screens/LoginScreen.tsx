import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { api } from "../api/client";
import { saveToken, saveUser } from "../storage/authStorage";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("sagar@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    return message || error?.message || "Something went wrong";
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
        device_type: Platform.OS,
        device_name: "Mobile App",
      });

      await saveToken(res.data.token);
      await saveUser(res.data.user);

      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert("Login Failed", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSendLoginOtp = async () => {
    try {
      if (!email.trim()) {
        Alert.alert("Validation", "Email is required");
        return;
      }

      setLoading(true);

      await api.post("/auth/send-otp", {
        email: email.trim().toLowerCase(),
        purpose: "login",
      });

      navigation.navigate("VerifyOtp", {
        email: email.trim().toLowerCase(),
        mode: "login",
      });
    } catch (error: any) {
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <Image
            source={{
              uri: "https://iskconahmedabad.com/images/logo.png",
            }}
            style={styles.logo}
          />

          <Text style={styles.heroSmall}>ISKCON Ahmedabad</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue your Krishna consciousness journey.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Login</Text>

            <Input
              label="Email Address *"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            {/* <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={[styles.buttonOutline, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonOutlineText}>
                {loading ? "Please wait..." : "Login with Password"}
              </Text>
            </Pressable> */}

            <Pressable
              onPress={handleSendLoginOtp}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending OTP..." : "Login with OTP"}
              </Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>New seeker? Register here</Text>
            </Pressable>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Hare Krishna 🙏</Text>
            <Text style={styles.infoText}>
              Access events, yatras, courses, journals, newsletters, progress
              tracking and seva opportunities from one app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
}: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value ?? ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9a7a4a"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdfaf5",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: "#1a0a00",
    paddingTop: 70,
    paddingBottom: 44,
    paddingHorizontal: 22,
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
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    textAlign: "center",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    color: "#f5e8c8",
    fontWeight: "700",
  },
  content: {
    padding: 18,
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#1a0a00",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5c3d1a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a0a00",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#c8902a",
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 12,
    shadowColor: "#c8902a",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#c8902a",
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 6,
  },
  buttonOutlineText: {
    color: "#8b6914",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#8b6914",
    fontWeight: "900",
  },
  infoCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 28,
    padding: 20,
  },
  infoTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  infoText: {
    color: "#d4a853",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
});