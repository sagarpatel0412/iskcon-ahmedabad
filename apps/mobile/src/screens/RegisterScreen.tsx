import { useEffect, useState } from "react";
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
import { getCities, getCountries, getStates } from "../api/locationApi";

export default function RegisterScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",

    centre_id: 1,

    country_code: "IN",
    state_code: "GJ",
    city: "Ahmedabad",

    address_line_1: "",
    address_line_2: "",
    landmark: "",
    postal_code: "",
    profile_image_url: "",
  });

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (form.country_code) {
      loadStates(form.country_code);
    }
  }, [form.country_code]);

  useEffect(() => {
    if (form.country_code && form.state_code) {
      loadCities(form.country_code, form.state_code);
    }
  }, [form.country_code, form.state_code]);

  const loadInitial = async () => {
    try {
      const res = await getCountries();
      setCountries(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadStates = async (countryCode: string) => {
    try {
      const res = await getStates(countryCode);
      setStates(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    try {
      const res = await getCities(countryCode, stateCode);
      setCities(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const update = (key: string, value: any) => {
    setForm((prev) => {
      if (key === "country_code") {
        return {
          ...prev,
          country_code: value,
          state_code: "",
          city: "",
        };
      }

      if (key === "state_code") {
        return {
          ...prev,
          state_code: value,
          city: "",
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const getErrorMessage = (error: any) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    return message || error?.message || "Something went wrong";
  };

  const handleRegister = async () => {
    try {
      if (!form.first_name.trim()) {
        Alert.alert("Validation", "First name is required");
        return;
      }

      if (!form.email.trim()) {
        Alert.alert("Validation", "Email is required");
        return;
      }

      if (!form.password || form.password.length < 6) {
        Alert.alert("Validation", "Password must be at least 6 characters");
        return;
      }

      setLoading(true);

      await api.post("/auth/send-otp", {
        email: form.email.trim().toLowerCase(),
        purpose: "register",
      });

      navigation.navigate("VerifyOtp", {
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        mode: "register",
        registerData: {
          ...form,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim() || undefined,
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || undefined,
          password: form.password,
          centre_id: form.centre_id || null,
          address_line_1: form.address_line_1.trim() || undefined,
          address_line_2: form.address_line_2.trim() || undefined,
          landmark: form.landmark.trim() || undefined,
          postal_code: form.postal_code.trim() || undefined,
          profile_image_url: form.profile_image_url.trim() || undefined,
        },
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
          <Text style={styles.title}>Seeker Registration</Text>
          <Text style={styles.subtitle}>
            Begin your spiritual journey with Krishna consciousness.
          </Text>
        </View>

        <View style={styles.content}>
          <Section title="Personal Information">
            <Input
              label="First Name *"
              value={form.first_name}
              onChangeText={(v: string) => update("first_name", v)}
              placeholder="Enter first name"
            />

            <Input
              label="Last Name"
              value={form.last_name}
              onChangeText={(v: string) => update("last_name", v)}
              placeholder="Enter last name"
            />

            <Input
              label="Email *"
              value={form.email}
              onChangeText={(v: string) => update("email", v)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone"
              value={form.phone}
              onChangeText={(v: string) => update("phone", v)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <Input
              label="Password *"
              value={form.password}
              onChangeText={(v: string) => update("password", v)}
              placeholder="Enter password"
              secureTextEntry
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.chipRow}>
                {["male", "female", "other"].map((gender) => (
                  <Pressable
                    key={gender}
                    onPress={() => update("gender", gender)}
                    style={[
                      styles.chip,
                      form.gender === gender && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        form.gender === gender && styles.chipTextActive,
                      ]}
                    >
                      {gender.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Section>

          <Section title="Location">
            <SelectLike
              label="Country"
              value={form.country_code}
              items={countries}
              getLabel={(item:any) => item.name}
              getValue={(item:any) => item.isoCode || item.code}
              onSelect={(value:any) => update("country_code", value)}
            />

            <SelectLike
              label="State"
              value={form.state_code}
              items={states}
              getLabel={(item:any) => item.name}
              getValue={(item:any) => item.isoCode || item.code}
              onSelect={(value:any) => update("state_code", value)}
            />

            <SelectLike
              label="City"
              value={form.city}
              items={cities}
              getLabel={(item:any) => item.name || item}
              getValue={(item:any) => item.name || item}
              onSelect={(value:any) => update("city", value)}
            />
          </Section>

          <Section title="Address Details">
            <Input
              label="Address Line 1"
              value={form.address_line_1}
              onChangeText={(v: string) => update("address_line_1", v)}
              placeholder="Flat / Street / Society"
            />

            <Input
              label="Address Line 2"
              value={form.address_line_2}
              onChangeText={(v: string) => update("address_line_2", v)}
              placeholder="Area / Additional address"
            />

            <Input
              label="Landmark"
              value={form.landmark}
              onChangeText={(v: string) => update("landmark", v)}
              placeholder="Nearby place"
            />

            <Input
              label="Postal Code"
              value={form.postal_code}
              onChangeText={(v: string) => update("postal_code", v)}
              placeholder="380001"
              keyboardType="number-pad"
            />

            <Input
              label="Profile Image URL"
              value={form.profile_image_url}
              onChangeText={(v: string) => update("profile_image_url", v)}
              placeholder="Optional image URL"
            />
          </Section>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already registered? Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
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

function SelectLike({
  label,
  value,
  items,
  getLabel,
  getValue,
  onSelect,
}: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.selectedBox}>
        <Text style={styles.selectedText}>{value || `Select ${label}`}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionScroll}
      >
        {items.map((item: any, index: number) => {
          const itemValue = getValue(item);
          const itemLabel = getLabel(item);
          const active = value === itemValue;

          return (
            <Pressable
              key={`${itemValue}-${index}`}
              onPress={() => onSelect(itemValue)}
              style={[styles.optionChip, active && styles.optionChipActive]}
            >
              <Text
                style={[
                  styles.optionChipText,
                  active && styles.optionChipTextActive,
                ]}
              >
                {itemLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 36,
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
    fontSize: 34,
    lineHeight: 40,
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
    fontSize: 24,
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
  selectedBox: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedText: {
    color: "#1a0a00",
    fontWeight: "800",
  },
  optionScroll: {
    marginTop: 10,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  optionChipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  optionChipText: {
    color: "#5c3d1a",
    fontWeight: "800",
    fontSize: 12,
  },
  optionChipTextActive: {
    color: "#1a0a00",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#fdfaf5",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#5c3d1a",
  },
  chipTextActive: {
    color: "#1a0a00",
  },
  button: {
    backgroundColor: "#c8902a",
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 6,
    shadowColor: "#c8902a",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#8b6914",
    fontWeight: "900",
  },
});