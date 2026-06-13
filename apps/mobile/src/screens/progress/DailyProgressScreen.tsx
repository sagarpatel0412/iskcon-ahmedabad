import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import {
  getTodayProgress,
  saveDailyProgress,
} from "../../api/dailyProgressApi";

export default function DailyProgressScreen({ navigation }: any) {
  const today = new Date().toISOString().slice(0, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    progress_date: today,
    mala_count: 16,
    lecture_attended: true,
    lecture_title: "Bhāgavatam Morning Class",
    books_read_count: 1,
    current_book: "Śrīmad Bhāgavatam — Canto 1",
    book_status: "ongoing" as "not_started" | "ongoing" | "completed",
    notes: "",
  });

  const percent = useMemo(() => {
    return Math.min((Number(form.mala_count || 0) / 16) * 100, 100);
  }, [form.mala_count]);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    try {
      const res = await getTodayProgress();
      const progress = res.data?.progress || res.data;

      if (progress) {
        setForm({
          progress_date: progress.progress_date || today,
          mala_count: Number(progress.mala_count || 0),
          lecture_attended: Boolean(progress.lecture_attended),
          lecture_title: progress.lecture_title || "",
          books_read_count: Number(progress.books_read_count || 0),
          current_book: progress.current_book || progress.book_name || "",
          book_status: progress.book_status || "not_started",
          notes: progress.notes || "",
        });
      }
    } catch (error: any) {
      console.log("TODAY PROGRESS ERROR:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const changeMala = (value: number) => {
    setForm((prev) => ({
      ...prev,
      mala_count: Math.max(0, Math.min(64, Number(prev.mala_count || 0) + value)),
    }));
  };

  const getErrorMessage = (error: any) => {
    const message = error?.response?.data?.message;
    if (Array.isArray(message)) return message.join("\n");
    return message || error?.message || "Something went wrong";
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveDailyProgress({
        progress_date: form.progress_date,
        mala_count: Number(form.mala_count || 0),
        lecture_attended: form.lecture_attended,
        lecture_title: form.lecture_title.trim() || undefined,
        books_read_count: Number(form.books_read_count || 0),
        current_book: form.current_book.trim() || undefined,
        book_status: form.book_status,
        notes: form.notes.trim() || undefined,
      });

      Alert.alert("Success", "Progress saved! Hare Krishna 🙏", [
        {
          text: "View Progress",
          onPress: () => navigation.navigate("ProgressHistory"),
        },
        { text: "OK" },
      ]);
    } catch (error: any) {
      Alert.alert("Save Failed", getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Log Progress"
        subtitle="Record your daily sādhana"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mantraBox}>
          <Text style={styles.mantraText}>
            ॐ नमो भगवते वासुदेवाय · Daily Sādhana Tracker
          </Text>
        </View>

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Log Progress</Text>
            <Text style={styles.pageSub}>Record your daily sādhana.</Text>
          </View>

          <Pressable
            style={[styles.saveTopBtn, saving && styles.disabledBtn]}
            disabled={saving}
            onPress={handleSave}
          >
            <Text style={styles.saveTopText}>
              {saving ? "Saving..." : "Save Entry"}
            </Text>
          </Pressable>
        </View>

        <Card title="Progress Date">
          <Input
            label="Progress Date"
            value={form.progress_date}
            onChange={(v: string) => update("progress_date", v)}
            editable={false}
          />
        </Card>

        <Card title="🧿 Japa — Mala Count">
          <View style={styles.malaCenter}>
            <View style={styles.circleOuter}>
              <View
                style={[
                  styles.circleProgress,
                  {
                    borderColor:
                      percent >= 100 ? "#c8902a" : "#ede0c8",
                  },
                ]}
              >
                <Text style={styles.malaNumber}>{form.mala_count}</Text>
                <Text style={styles.malaLabel}>Rounds</Text>
              </View>
            </View>

            <View style={styles.malaActions}>
              <RoundBtn label="-1" onPress={() => changeMala(-1)} light />
              <RoundBtn label="-4" onPress={() => changeMala(-4)} light />
              <RoundBtn label="+4" onPress={() => changeMala(4)} />
              <RoundBtn label="+1" onPress={() => changeMala(1)} />
            </View>

            <View style={styles.beadsWrap}>
              {Array.from({ length: 16 }).map((_, index) => {
                const active = index < Number(form.mala_count || 0);

                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      update("mala_count", active ? index : index + 1)
                    }
                    style={[styles.bead, active && styles.beadActive]}
                  />
                );
              })}
            </View>

            <Text style={styles.helperText}>Tap a bead to update rounds.</Text>
          </View>
        </Card>

        <Card title="📖 Lecture / Class">
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Attended a lecture today</Text>
              <Text style={styles.switchSub}>
                Bhāgavatam class, Gītā seminar, online class etc.
              </Text>
            </View>

            <Switch
              value={form.lecture_attended}
              onValueChange={(v) => update("lecture_attended", v)}
            />
          </View>

          {form.lecture_attended && (
            <Input
              label="Lecture Title"
              value={form.lecture_title}
              onChange={(v: string) => update("lecture_title", v)}
            />
          )}
        </Card>

        <Card title="📚 Book Reading">
          <Input
            label="Pages / Chapters Read"
            value={String(form.books_read_count)}
            keyboardType="numeric"
            onChange={(v: string) => update("books_read_count", Number(v || 0))}
          />

          <Text style={styles.label}>Book Status</Text>
          <View style={styles.statusRow}>
            {(["not_started", "ongoing", "completed"] as const).map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.statusBtn,
                  form.book_status === item && styles.statusBtnActive,
                ]}
                onPress={() => update("book_status", item)}
              >
                <Text
                  style={[
                    styles.statusText,
                    form.book_status === item && styles.statusTextActive,
                  ]}
                >
                  {item.replace("_", " ")}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label="Current Book"
            value={form.current_book}
            onChange={(v: string) => update("current_book", v)}
          />
        </Card>

        <Card title="📝 Notes & Realizations">
          <Input
            label="Personal notes, key verse heard, realizations"
            value={form.notes}
            onChange={(v: string) => update("notes", v)}
            multiline
            placeholder="Write realization from japa, lecture, reading..."
          />
        </Card>

        <View style={styles.todayCard}>
          <Text style={styles.todayTag}>Today</Text>
          <Text style={styles.todayTitle}>Hare Krishna 🙏</Text>
          <Text style={styles.todayText}>
            Every round, every page, every lecture is progress.
          </Text>

          <View style={styles.chipRow}>
            <Chip active={form.mala_count >= 16} text={`🧿 ${form.mala_count} Rounds`} />
            <Chip active={form.lecture_attended} text="📖 Lecture" />
            <Chip active={form.books_read_count > 0} text="📚 Reading" />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quick Summary</Text>
          <Text style={styles.summaryText}>🧿 Rounds: {form.mala_count}</Text>
          <Text style={styles.summaryText}>
            📖 Lecture: {form.lecture_attended ? "Yes" : "No"}
          </Text>
          <Text style={styles.summaryText}>
            📚 Reading: {form.books_read_count} pages/chapters
          </Text>
          <Text style={styles.summaryText}>
            📘 Book: {form.current_book || "-"}
          </Text>
        </View>

        <Pressable
          style={[styles.saveBtn, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Saving..." : "Save Progress"}
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

function Input({
  label,
  value,
  onChange,
  keyboardType,
  multiline,
  placeholder,
  editable = true,
}: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value || ""}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        placeholder={placeholder || label}
        placeholderTextColor="#b08a52"
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function RoundBtn({ label, onPress, light }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.roundBtn, light && styles.roundBtnLight]}
    >
      <Text style={[styles.roundBtnText, light && styles.roundBtnTextLight]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Chip({ active, text }: any) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0e8d8", paddingTop: 48 },
  loaderPage: {
    flex: 1,
    backgroundColor: "#f0e8d8",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  mantraBox: {
    backgroundColor: "#1a0a00",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  mantraText: {
    color: "#d4a853",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 18,
  },
  pageTitle: {
    color: "#1a0a00",
    fontSize: 34,
    fontWeight: "900",
  },
  pageSub: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginTop: 4,
  },
  saveTopBtn: {
    backgroundColor: "#c8902a",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  saveTopText: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#1a0a00",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ede0c8",
  },
  malaCenter: { alignItems: "center" },
  circleOuter: {
    height: 190,
    width: 190,
    borderRadius: 95,
    borderWidth: 8,
    borderColor: "#f5e8c8",
    alignItems: "center",
    justifyContent: "center",
  },
  circleProgress: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  malaNumber: {
    color: "#1a0a00",
    fontSize: 48,
    fontWeight: "900",
  },
  malaLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  malaActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  roundBtn: {
    backgroundColor: "#c8902a",
    height: 48,
    minWidth: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  roundBtnLight: {
    backgroundColor: "#f7f0e4",
  },
  roundBtnText: {
    color: "#1a0a00",
    fontWeight: "900",
  },
  roundBtnTextLight: {
    color: "#5c3d1a",
  },
  beadsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    justifyContent: "center",
    marginTop: 20,
    maxWidth: 260,
  },
  bead: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#ede0c8",
    borderWidth: 1,
    borderColor: "#ede0c8",
  },
  beadActive: {
    backgroundColor: "#c8902a",
    borderColor: "#8b6914",
  },
  helperText: {
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },
  inputWrap: { marginBottom: 14 },
  label: {
    color: "#5c3d1a",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#1a0a00",
    fontWeight: "800",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  switchRow: {
    backgroundColor: "#f7f0e4",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTitle: {
    color: "#1a0a00",
    fontWeight: "900",
  },
  switchSub: {
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  statusBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  statusBtnActive: {
    backgroundColor: "#c8902a",
    borderColor: "#c8902a",
  },
  statusText: {
    color: "#5c3d1a",
    fontWeight: "900",
    textTransform: "capitalize",
    fontSize: 12,
  },
  statusTextActive: {
    color: "#1a0a00",
  },
  todayCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },
  todayTag: {
    color: "#d4a853",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  todayTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 10,
  },
  todayText: {
    color: "#d4a853",
    fontWeight: "800",
    marginTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#5c3d1a",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    borderColor: "#86efac",
    backgroundColor: "rgba(20,83,45,0.45)",
  },
  chipText: {
    color: "#d4a853",
    fontSize: 12,
    fontWeight: "900",
  },
  chipTextActive: {
    color: "#bbf7d0",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  summaryTitle: {
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 12,
  },
  summaryText: {
    color: "#5c3d1a",
    fontWeight: "800",
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#c8902a",
    paddingVertical: 15,
    borderRadius: 18,
  },
  saveBtnText: {
    color: "#1a0a00",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  disabledBtn: { opacity: 0.6 },
});