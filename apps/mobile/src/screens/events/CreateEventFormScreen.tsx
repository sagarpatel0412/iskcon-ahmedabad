import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import {
  createEventFormFieldsBulk,
  getEventByUuid,
  getEventFormFields,
} from "../../api/eventApi";

const fieldTypes = [
  "text",
  "number",
  "email",
  "phone",
  "select",
  "checkbox",
  "textarea",
  "date",
] as const;

type FieldType = (typeof fieldTypes)[number];

type FieldItem = {
  uuid?: string;
  label: string;
  field_key: string;
  field_type: FieldType;
  is_required: boolean;
  options: string | string[] | null;
  sort_order: number;
};

export default function CreateEventFormScreen({ navigation, route }: any) {
  const { eventUuid } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<FieldItem[]>([
    {
      label: "Full Name",
      field_key: "full_name",
      field_type: "text",
      is_required: true,
      options: null,
      sort_order: 1,
    },
    {
      label: "Phone Number",
      field_key: "phone_number",
      field_type: "phone",
      is_required: true,
      options: null,
      sort_order: 2,
    },
  ]);

  useEffect(() => {
    fetchEventAndForm();
  }, [eventUuid]);

  const fetchEventAndForm = async () => {
    try {
      const eventRes = await getEventByUuid(eventUuid);
      setEvent(eventRes.data?.event || eventRes.data);

      const formRes = await getEventFormFields(eventUuid);
      const formFields = formRes.data?.fields || formRes.data || [];

      if (Array.isArray(formFields) && formFields.length) {
        setFields(
          formFields.map((field: any, index: number) => ({
            uuid: field.uuid,
            label: field.label || "",
            field_key: field.field_key || "",
            field_type: field.field_type || "text",
            is_required: Boolean(field.is_required),
            options: Array.isArray(field.options)
              ? field.options.join(", ")
              : field.options || null,
            sort_order: field.sort_order || index + 1,
          }))
        );
      }
    } catch (error: any) {
      console.log("FORM LOAD ERROR:", error?.response?.data || error);
      Alert.alert("Error", "Failed to load event form");
    }
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        label: "",
        field_key: "",
        field_type: "text",
        is_required: false,
        options: null,
        sort_order: prev.length + 1,
      },
    ]);
  };

  const updateField = (index: number, key: keyof FieldItem, value: any) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const generateFieldKey = (label: string) => {
    return label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const saveForm = async () => {
    try {
      const cleanFields = fields
        .filter((field) => field.label.trim())
        .map((field, index) => {
          const needsOptions =
            field.field_type === "select" || field.field_type === "checkbox";

          return {
            label: field.label.trim(),
            field_key: field.field_key.trim() || generateFieldKey(field.label),
            field_type: field.field_type,
            is_required: Boolean(field.is_required),
            sort_order: index + 1,
            options:
              needsOptions &&
              typeof field.options === "string" &&
              field.options.trim()
                ? field.options.split(",").map((item) => item.trim())
                : Array.isArray(field.options)
                ? field.options
                : null,
          };
        });

      if (!cleanFields.length) {
        Alert.alert("Validation", "Please add at least one form field");
        return;
      }

      setLoading(true);

      await createEventFormFieldsBulk(eventUuid, cleanFields);

      Alert.alert("Success", "Event form saved successfully");
      navigation.navigate("MyEvents");
    } catch (error: any) {
      console.log("SAVE FORM ERROR:", JSON.stringify(error?.response?.data, null, 2));

      const message = error?.response?.data?.message;

      Alert.alert(
        "Error",
        Array.isArray(message)
          ? message.join("\n")
          : message || "Failed to save form"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <AppHeader
        title="Registration Form Fields"
        subtitle={event?.title || "Event"}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {event && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventText}>📍 {event.location || "Location"}</Text>
            <Text style={styles.eventText}>📅 {event.event_date || "Date"}</Text>
            <Text style={styles.eventText}>⏰ {event.start_time || "Time"}</Text>
          </View>
        )}

        <View style={styles.topRow}>
          <Text style={styles.note}>
            These fields will appear when seekers register for this event.
          </Text>

          <Pressable style={styles.addSmallBtn} onPress={addField}>
            <Text style={styles.addSmallText}>+ Add</Text>
          </Pressable>
        </View>

        {fields.map((field, index) => (
          <View key={index} style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldTitle}>Field {index + 1}</Text>

              {fields.length > 1 && (
                <Pressable onPress={() => removeField(index)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              )}
            </View>

            <Input
              label="Label"
              placeholder="Full Name"
              value={field.label}
              onChangeText={(text: string) => updateField(index, "label", text)}
            />

            <Input
              label="Field Key"
              placeholder="full_name"
              value={field.field_key}
              onChangeText={(text: string) => updateField(index, "field_key", text)}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              {fieldTypes.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeChip,
                    field.field_type === type && styles.typeChipActive,
                  ]}
                  onPress={() => updateField(index, "field_type", type)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      field.field_type === type && styles.typeChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            {(field.field_type === "select" || field.field_type === "checkbox") && (
              <Input
                label="Options comma separated"
                placeholder="Male, Female, Other"
                value={
                  Array.isArray(field.options)
                    ? field.options.join(", ")
                    : field.options || ""
                }
                onChangeText={(text: string) => updateField(index, "options", text)}
              />
            )}

            <View style={styles.bottomRow}>
              <Pressable
                style={[
                  styles.requiredBtn,
                  field.is_required && styles.requiredBtnActive,
                ]}
                onPress={() =>
                  updateField(index, "is_required", !field.is_required)
                }
              >
                <Text
                  style={[
                    styles.requiredText,
                    field.is_required && styles.requiredTextActive,
                  ]}
                >
                  {field.is_required ? "Required" : "Optional"}
                </Text>
              </Pressable>

              <Text style={styles.sortText}>Sort: {index + 1}</Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.addBtn} onPress={addField}>
          <Text style={styles.addText}>+ Add Field</Text>
        </Pressable>

        <Pressable
          style={[styles.saveBtn, loading && styles.disabled]}
          onPress={saveForm}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Form"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Input({ label, value, onChangeText, placeholder }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#b08a52"
        value={value || ""}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f0e8d8",
    paddingTop: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  eventCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ede0c8",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#1a0a00",
    marginBottom: 8,
  },
  eventText: {
    color: "#5c3d1a",
    fontWeight: "800",
    marginTop: 4,
  },
  topRow: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  note: {
    flex: 1,
    color: "#9a7a4a",
    fontWeight: "800",
    fontSize: 13,
    paddingRight: 10,
  },
  addSmallBtn: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  addSmallText: {
    color: "#5c3d1a",
    fontWeight: "900",
  },
  fieldCard: {
    backgroundColor: "#fdfaf5",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ede0c8",
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1a0a00",
  },
  removeBtn: {
    backgroundColor: "#fff1f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  removeText: {
    color: "#b91c1c",
    fontWeight: "900",
  },
  inputGroup: {
    marginBottom: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5c3d1a",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#1a0a00",
    fontWeight: "800",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  typeChipText: {
    color: "#5c3d1a",
    fontWeight: "900",
    textTransform: "capitalize",
  },
  typeChipTextActive: {
    color: "#1a0a00",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requiredBtn: {
    borderWidth: 1,
    borderColor: "#ede0c8",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  requiredBtnActive: {
    backgroundColor: "#15803d",
    borderColor: "#15803d",
  },
  requiredText: {
    color: "#5c3d1a",
    fontWeight: "900",
  },
  requiredTextActive: {
    color: "#ffffff",
  },
  sortText: {
    color: "#9a7a4a",
    fontWeight: "900",
  },
  addBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    paddingVertical: 15,
    borderRadius: 18,
    marginBottom: 12,
  },
  addText: {
    textAlign: "center",
    color: "#5c3d1a",
    fontWeight: "900",
  },
  saveBtn: {
    backgroundColor: "#c8902a",
    paddingVertical: 15,
    borderRadius: 18,
  },
  saveText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.7,
  },
});