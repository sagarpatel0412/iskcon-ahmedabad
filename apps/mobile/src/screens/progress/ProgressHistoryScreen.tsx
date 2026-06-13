import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import { getMyDailyProgress } from "../../api/dailyProgressApi";

export default function ProgressHistoryScreen({ navigation }: any) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getMyDailyProgress();
      const list = res.data?.progress || res.data || [];
      setEntries(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [])
  );

  const stats = useMemo(() => {
    const totalRounds = entries.reduce(
      (sum, item) => sum + Number(item.mala_count || 0),
      0
    );

    const fullDays = entries.filter(
      (item) => Number(item.mala_count || 0) >= 16
    ).length;

    const lectures = entries.filter((item) => item.lecture_attended).length;

    const booksCompleted = entries.filter(
      (item) => item.book_status === "completed"
    ).length;

    return {
      totalRounds,
      fullDays,
      lectures,
      booksCompleted,
      daysLogged: entries.length,
    };
  }, [entries]);

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
        title="Track My Progress"
        subtitle="Your sādhana history"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
      >
        <View style={styles.mantraBox}>
          <Text style={styles.mantraText}>
            ॐ नमो भगवते वासुदेवाय · My Progress
          </Text>
        </View>

        <Text style={styles.pageTitle}>Track My Progress</Text>
        <Text style={styles.pageSub}>
          Your sādhana history and growth summary.
        </Text>

        <View style={styles.fullDaysCard}>
          <Text style={styles.fullDaysNumber}>🔥 {stats.fullDays}</Text>
          <Text style={styles.fullDaysTitle}>Full Mala Days</Text>
          <Text style={styles.fullDaysText}>
            Keep going. Consistency is bhakti in action.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard number={stats.totalRounds} label="Total Rounds" sub="All entries" />
          <StatCard number={stats.daysLogged} label="Days Logged" sub="Total" />
          <StatCard number={stats.lectures} label="Lectures" sub="Attended" />
          <StatCard number={stats.booksCompleted} label="Books Completed" sub="All time" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sādhana</Text>

          {entries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🙏</Text>
              <Text style={styles.emptyTitle}>No progress logged yet</Text>
              <Text style={styles.emptyText}>
                Start by logging today’s sādhana.
              </Text>
            </View>
          ) : (
            entries.map((entry) => (
              <ProgressEntryCard key={entry.uuid || entry.id} entry={entry} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rounds Overview</Text>

          <View style={styles.chartWrap}>
            {entries
              .slice(0, 14)
              .reverse()
              .map((entry) => {
                const mala = Number(entry.mala_count || 0);
                const height = Math.max(8, Math.min(100, (mala / 16) * 100));
                const complete = mala >= 16;

                return (
                  <View key={entry.uuid || entry.id} style={styles.barItem}>
                    <Text style={styles.barValue}>{mala}</Text>

                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.bar,
                          complete ? styles.barComplete : styles.barPartial,
                          { height: `${height}%` },
                        ]}
                      />
                    </View>

                    <Text style={styles.barDate}>
                      {formatDay(entry.progress_date)}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ProgressEntryCard({ entry }: { entry: any }) {
  const complete = Number(entry.mala_count || 0) >= 16;

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.entryDate}>
            {formatFullDate(entry.progress_date)}
          </Text>
          <Text style={styles.entrySub}>Logged progress entry</Text>
        </View>

        <View style={[styles.completeBadge, complete && styles.completeBadgeActive]}>
          <Text
            style={[
              styles.completeBadgeText,
              complete && styles.completeBadgeTextActive,
            ]}
          >
            {complete ? "Complete" : "Partial"}
          </Text>
        </View>
      </View>

      <View style={styles.entryMetaRow}>
        <Text style={styles.entryMeta}>🧿 {entry.mala_count || 0} rounds</Text>
        <Text style={styles.entryMeta}>
          📖 {entry.lecture_attended ? "Lecture ✓" : "No lecture"}
        </Text>
        <Text style={styles.entryMeta}>📚 {entry.books_read_count || 0} read</Text>
      </View>

      {(entry.current_book || entry.book_name) && (
        <View style={styles.bookBox}>
          <Text style={styles.bookLabel}>Current Book</Text>
          <Text style={styles.bookName}>
            {entry.current_book || entry.book_name}
          </Text>
          <Text style={styles.bookStatus}>
            {entry.book_status?.replace("_", " ") || "-"}
          </Text>
        </View>
      )}

      {entry.notes ? (
        <Text style={styles.notes}>“{entry.notes}”</Text>
      ) : null}
    </View>
  );
}

function StatCard({ number, label, sub }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function formatFullDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDay(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0e8d8", paddingTop: 48 },
  loaderPage: {
    flex: 1,
    backgroundColor: "#f0e8d8",
    justifyContent: "center",
    alignItems: "center",
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
  pageTitle: {
    color: "#1a0a00",
    fontSize: 34,
    fontWeight: "900",
  },
  pageSub: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginTop: 5,
    marginBottom: 18,
  },
  fullDaysCard: {
    backgroundColor: "#1a0a00",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  fullDaysNumber: {
    color: "#d4a853",
    fontSize: 48,
    fontWeight: "900",
  },
  fullDaysTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },
  fullDaysText: {
    color: "#d4a853",
    fontWeight: "800",
    marginTop: 6,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },
  statNumber: {
    color: "#c8902a",
    fontSize: 34,
    fontWeight: "900",
  },
  statLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 6,
    textAlign: "center",
  },
  statSub: {
    color: "#5c3d1a",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1a0a00",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 16,
  },
  emptyCard: {
    backgroundColor: "#f7f0e4",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
  },
  emptyIcon: { fontSize: 44 },
  emptyTitle: {
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
    textAlign: "center",
  },
  emptyText: {
    color: "#9a7a4a",
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  entryCard: {
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  entryDate: {
    color: "#1a0a00",
    fontSize: 20,
    fontWeight: "900",
  },
  entrySub: {
    color: "#9a7a4a",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  completeBadge: {
    backgroundColor: "#f5e8c8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completeBadgeActive: {
    backgroundColor: "#ecfdf5",
  },
  completeBadgeText: {
    color: "#8b6914",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  completeBadgeTextActive: {
    color: "#047857",
  },
  entryMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  entryMeta: {
    color: "#5c3d1a",
    fontWeight: "800",
    fontSize: 13,
  },
  bookBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  bookLabel: {
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  bookName: {
    color: "#1a0a00",
    fontWeight: "900",
    marginTop: 5,
  },
  bookStatus: {
    color: "#8b6914",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
    textTransform: "capitalize",
  },
  notes: {
    backgroundColor: "#f7f0e4",
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
    color: "#5c3d1a",
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 21,
  },
  chartWrap: {
    height: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
    height: "100%",
  },
  barValue: {
    color: "#5c3d1a",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 4,
  },
  barTrack: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barComplete: {
    backgroundColor: "#c8902a",
  },
  barPartial: {
    backgroundColor: "#f5e8c8",
    borderWidth: 1,
    borderColor: "#c8902a",
  },
  barDate: {
    color: "#9a7a4a",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 6,
  },
});