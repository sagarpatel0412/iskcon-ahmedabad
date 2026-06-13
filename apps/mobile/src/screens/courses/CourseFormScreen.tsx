import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";

const courseModes = ["offline", "online", "hybrid"];
const statuses = ["draft", "published", "cancelled", "completed"];

export const emptyCourseForm = {
  title: "",
  description: "",
  cover_image_url: "",
  centre_id: "",
  course_mode: "offline",
  venue_name: "",
  venue_address: "",
  online_meeting_url: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  max_capacity: "",
  is_paid: false,
  price_amount: "",
  currency: "INR",
  registration_start_date: "",
  registration_end_date: "",
  what_you_will_learn: "",
  requirements: "",
  rules: "",
  contact_name: "",
  contact_phone: "",
  status: "draft",
  sessions: [],
};

export default function CourseFormScreen({
  mode,
  form,
  setForm,
  saving,
  submitLabel,
  onSubmit,
  navigation,
}: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addSession = () => {
    update("sessions", [
      ...(form.sessions || []),
      {
        session_number: (form.sessions?.length || 0) + 1,
        title: "",
        description: "",
        session_date: "",
        start_time: "",
        end_time: "",
        venue_name: "",
        venue_address: "",
        online_meeting_url: "",
      },
    ]);
  };

  const updateSession = (index: number, key: string, value: any) => {
    const sessions = [...(form.sessions || [])];
    sessions[index] = { ...sessions[index], [key]: value };
    update("sessions", sessions);
  };

  const removeSession = (index: number) => {
    update(
      "sessions",
      (form.sessions || []).filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <View style={styles.page}>
      <AppHeader
        title={mode === "create" ? "Create Course" : "Edit Course"}
        subtitle="Spiritual learning course"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>
          {mode === "create" ? "Create Course" : "Edit Course"}
        </Text>

        <Card title="Basic Course Details">
          <Input label="Title" value={form.title} onChange={(v: string) => update("title", v)} />
          <Input label="Cover Image URL" value={form.cover_image_url} onChange={(v: string) => update("cover_image_url", v)} />

          <ChipGroup
            label="Course Mode"
            value={form.course_mode}
            options={courseModes}
            onChange={(v: string) => update("course_mode", v)}
          />

          <ChipGroup
            label="Status"
            value={form.status}
            options={statuses}
            onChange={(v: string) => update("status", v)}
          />

          <Input label="Start Date" placeholder="YYYY-MM-DD" value={form.start_date} onChange={(v: string) => update("start_date", v)} />
          <Input label="End Date" placeholder="YYYY-MM-DD" value={form.end_date} onChange={(v: string) => update("end_date", v)} />
          <Input label="Start Time" placeholder="HH:mm" value={form.start_time} onChange={(v: string) => update("start_time", v)} />
          <Input label="End Time" placeholder="HH:mm" value={form.end_time} onChange={(v: string) => update("end_time", v)} />

          <Textarea label="Description" value={form.description} onChange={(v: string) => update("description", v)} />
        </Card>

        <Card title="Venue / Online Details">
          <Input label="Venue Name" value={form.venue_name} onChange={(v: string) => update("venue_name", v)} />
          <Input label="Online Meeting URL" value={form.online_meeting_url} onChange={(v: string) => update("online_meeting_url", v)} />
          <Textarea label="Venue Address" value={form.venue_address} onChange={(v: string) => update("venue_address", v)} />
        </Card>

        <Card title="Payment & Registration">
          <Input label="Centre ID" value={form.centre_id} keyboardType="numeric" onChange={(v: string) => update("centre_id", v)} />
          <Input label="Max Capacity" value={form.max_capacity} keyboardType="numeric" onChange={(v: string) => update("max_capacity", v)} />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Paid Course</Text>
              <Text style={styles.switchSub}>Enable payment for registration.</Text>
            </View>

            <Switch value={!!form.is_paid} onValueChange={(v) => update("is_paid", v)} />
          </View>

          {form.is_paid && (
            <>
              <Input label="Price Amount" value={form.price_amount} keyboardType="numeric" onChange={(v: string) => update("price_amount", v)} />
              <Input label="Currency" value={form.currency} onChange={(v: string) => update("currency", v)} />
            </>
          )}

          <Input label="Registration Start" placeholder="YYYY-MM-DD" value={form.registration_start_date} onChange={(v: string) => update("registration_start_date", v)} />
          <Input label="Registration End" placeholder="YYYY-MM-DD" value={form.registration_end_date} onChange={(v: string) => update("registration_end_date", v)} />
        </Card>

        <Card title="Learning Details">
          <Textarea label="What You Will Learn" value={form.what_you_will_learn} onChange={(v: string) => update("what_you_will_learn", v)} />
          <Textarea label="Requirements" value={form.requirements} onChange={(v: string) => update("requirements", v)} />
          <Textarea label="Rules" value={form.rules} onChange={(v: string) => update("rules", v)} />
          <Input label="Contact Name" value={form.contact_name} onChange={(v: string) => update("contact_name", v)} />
          <Input label="Contact Phone" value={form.contact_phone} onChange={(v: string) => update("contact_phone", v)} />
        </Card>

        <Card title="Course Sessions">
          <Pressable style={styles.addBtn} onPress={addSession}>
            <Text style={styles.addBtnText}>+ Add Session</Text>
          </Pressable>

          {(form.sessions || []).map((session: any, index: number) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>Session {index + 1}</Text>

                <Pressable onPress={() => removeSession(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>

              <Input
                label="Session Number"
                value={String(session.session_number || "")}
                keyboardType="numeric"
                onChange={(v: string) =>
                  updateSession(index, "session_number", Number(v || 0))
                }
              />

              <Input label="Session Title" value={session.title} onChange={(v: string) => updateSession(index, "title", v)} />
              <Input label="Session Date" placeholder="YYYY-MM-DD" value={session.session_date} onChange={(v: string) => updateSession(index, "session_date", v)} />
              <Input label="Start Time" placeholder="HH:mm" value={session.start_time} onChange={(v: string) => updateSession(index, "start_time", v)} />
              <Input label="End Time" placeholder="HH:mm" value={session.end_time} onChange={(v: string) => updateSession(index, "end_time", v)} />
              <Input label="Venue Name" value={session.venue_name} onChange={(v: string) => updateSession(index, "venue_name", v)} />
              <Input label="Online Meeting URL" value={session.online_meeting_url} onChange={(v: string) => updateSession(index, "online_meeting_url", v)} />

              <Textarea label="Description" value={session.description} onChange={(v: string) => updateSession(index, "description", v)} />
              <Textarea label="Venue Address" value={session.venue_address} onChange={(v: string) => updateSession(index, "venue_address", v)} />
            </View>
          ))}
        </Card>

        <Pressable
          style={[styles.submitBtn, saving && styles.disabled]}
          disabled={saving}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>
            {saving ? "Saving..." : submitLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Card({ title, children }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({ label, value, onChange, keyboardType = "default", placeholder = "" }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value || ""}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder || label}
        placeholderTextColor="#fb923c"
        style={styles.input}
      />
    </View>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value || ""}
        onChangeText={onChange}
        multiline
        placeholder={label}
        placeholderTextColor="#fb923c"
        style={[styles.input, styles.textarea]}
      />
    </View>
  );
}

function ChipGroup({ label, value, options, onChange }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chipRow}>
        {options.map((option: string) => (
          <Pressable
            key={option}
            style={[styles.chip, value === option && styles.chipActive]}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.chipText, value === option && styles.chipTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  content: {
    padding: 16,
    paddingBottom: 44,
  },
  pageTitle: {
    color: "#0f172a",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#0f172a",
    fontWeight: "700",
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: "#ea580c",
    borderColor: "#ea580c",
  },
  chipText: {
    color: "#9a3412",
    fontWeight: "900",
    textTransform: "capitalize",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  switchRow: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTitle: {
    color: "#0f172a",
    fontWeight: "900",
  },
  switchSub: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  addBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#ffedd5",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },
  addBtnText: {
    color: "#c2410c",
    fontWeight: "900",
  },
  sessionCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sessionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
  removeText: {
    color: "#dc2626",
    fontWeight: "900",
  },
  submitBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});