import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Activity,
  BookOpen,
  CalendarDays,
  Crown,
  Flame,
  GraduationCap,
  History,
  MapPin,
  Newspaper,
  PlusCircle,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react-native";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { removeAuth } from "../storage/authStorage";
import AppHeader from "../components/AppHeader";
import SideMenu from "../components/SideMenu";
import { getTrips } from "../api/tripApi";
import { getCourses } from "../api/courseApi";
import { getMySubscription } from "../api/contentPaymentApi";

export default function HomeScreen({ navigation }: any) {
  const { user, loading, isVerifiedDevotee, isAdmin } = useCurrentUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  const canManage = isVerifiedDevotee || isAdmin;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [tripsRes, coursesRes, subRes] = await Promise.all([
        getTrips().catch(() => null),
        getCourses().catch(() => null),
        getMySubscription().catch(() => null),
      ]);

      setTrips(Array.isArray(tripsRes?.data) ? tripsRes?.data : tripsRes?.data?.trips || []);
      setCourses(Array.isArray(coursesRes?.data) ? coursesRes?.data : coursesRes?.data?.courses || []);
      setSubscription(subRes?.data?.subscription || subRes?.data || null);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeAuth();
    navigation.replace("Login");
  };

  if (loading || dashboardLoading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const firstName = user?.first_name || "Devotee";
  const lastName = user?.last_name || "";

  const quickActions = canManage
    ? [
        {
          title: "Create Event",
          text: "Add temple events and manage registrations.",
          icon: CalendarDays,
          onPress: () => navigation.navigate("CreateEvent"),
        },
        {
          title: "Create Trip / Yatra",
          text: "Organize multi-day spiritual yatras.",
          icon: MapPin,
          onPress: () => navigation.navigate("CreateTrip"),
        },
        {
          title: "Create Course",
          text: "Add offline or online spiritual courses.",
          icon: GraduationCap,
          onPress: () => navigation.navigate("CreateCourse"),
        },
        {
          title: "Browse Courses",
          text: "View spiritual learning programs.",
          icon: BookOpen,
          onPress: () => navigation.navigate("Courses"),
        },
      ]
    : [
        {
          title: "Browse Events",
          text: "Join temple events and festivals.",
          icon: CalendarDays,
          onPress: () => navigation.navigate("BrowseEvents"),
        },
        {
          title: "Browse Trips",
          text: "Register for upcoming yatras.",
          icon: MapPin,
          onPress: () => navigation.navigate("Trips"),
        },
        {
          title: "Browse Courses",
          text: "Learn from devotees and mentors.",
          icon: GraduationCap,
          onPress: () => navigation.navigate("Courses"),
        },
        {
          title: "Premium Content",
          text: "Read journals and newsletters.",
          icon: Crown,
          onPress: () => navigation.navigate("Journals"),
        },
      ];

  return (
    <View style={styles.page}>
      <AppHeader
        onMenu={() => setMenuOpen(true)}
        onProfile={() => navigation.navigate("Profile")}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: "https://iskconahmedabad.com/images/gallery/gallery2.jpg",
          }}
          style={styles.heroCard}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroPill}>
              <Sparkles size={15} color="#ffffff" />
              <Text style={styles.heroPillText}>Hare Krishna</Text>
            </View>

            <Text style={styles.heroTitle}>
              Welcome, {firstName} {lastName} 🙏
            </Text>

            <Text style={styles.heroSub}>
              Manage your devotional journey, courses, yatras, events, journals and newsletters from one beautiful spiritual dashboard.
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.whiteBadge}>
                <Text style={styles.whiteBadgeText}>
                  {canManage ? "Verified Devotee" : "Seeker"}
                </Text>
              </View>

              {subscription && (
                <View style={styles.darkBadge}>
                  <Crown size={13} color="#ffffff" />
                  <Text style={styles.darkBadgeText}>Premium</Text>
                </View>
              )}

              {isVerifiedDevotee && (
                <View style={styles.darkBadge}>
                  <UserCheck size={13} color="#ffffff" />
                  <Text style={styles.darkBadgeText}>Devotee</Text>
                </View>
              )}
            </View>

            <View style={styles.heroButtonRow}>
              <Pressable
                style={styles.heroPrimaryBtn}
                onPress={() => navigation.navigate("Courses")}
              >
                <Text style={styles.heroPrimaryText}>Explore Courses</Text>
              </Pressable>

              <Pressable
                style={styles.heroSecondaryBtn}
                onPress={() => navigation.navigate("Trips")}
              >
                <Text style={styles.heroSecondaryText}>View Yatras</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.heroStatsGrid}>
          <HeroStat label="Events" value="0" />
          <HeroStat label="Yatras" value={trips.length} />
          <HeroStat label="Courses" value={courses.length} />
          <HeroStat label="Premium" value={subscription ? "Active" : "No"} small />
        </View>

        <SectionCard
          title="Spiritual Progress"
          subtitle="Track your daily chanting, reading and seva journey."
          icon={Activity}
        >
          <View style={styles.progressGrid}>
            <ProgressCard
              icon={Flame}
              title="Today’s Sadhana"
              text="Record chanting rounds, reading, seva and daily habits."
              bg="#fff7ed"
            />

            <ProgressCard
              icon={Target}
              title="Daily Goal"
              text="Build discipline through small daily devotional progress."
              bg="#fefce8"
            />

            <Pressable
              style={[styles.progressCard, { backgroundColor: "#f0fdf4" }]}
              onPress={() => navigation.navigate("ProgressHistory")}
            >
              <View style={[styles.progressIcon, { backgroundColor: "#dcfce7" }]}>
                <History size={22} color="#15803d" />
              </View>
              <Text style={styles.progressLabel}>Progress History</Text>
              <Text style={styles.progressTitle}>View Journey</Text>
              <Text style={styles.progressText}>
                See previous days and understand spiritual consistency.
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.addTodayBtn}
            onPress={() => navigation.navigate("DailyProgress")}
          >
            <Text style={styles.addTodayText}>Add Today’s Progress</Text>
          </Pressable>
        </SectionCard>

        <View style={styles.statsGrid}>
          <StatCard label="Upcoming Events" value="0" icon={CalendarDays} />
          <StatCard label="Trips / Yatras" value={trips.length} icon={MapPin} />
          <StatCard label="Courses" value={courses.length} icon={GraduationCap} />
          <StatCard label="Premium" value={subscription ? "Active" : "No"} icon={Crown} />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.sectionSub}>Continue your seva and spiritual activities.</Text>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Pressable
                key={action.title}
                style={styles.quickCard}
                onPress={action.onPress}
              >
                <View style={styles.quickIcon}>
                  <Icon size={23} color="#ea580c" />
                </View>

                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickText}>{action.text}</Text>
              </Pressable>
            );
          })}
        </View>

        <MiniSection
          title="Upcoming Trips / Yatras"
          icon={MapPin}
          onViewAll={() => navigation.navigate("Trips")}
        >
          {trips.slice(0, 4).length === 0 ? (
            <Empty text="No yatras available yet." />
          ) : (
            trips.slice(0, 4).map((trip) => (
              <MiniItem
                key={trip.uuid}
                title={trip.title}
                subtitle={`${trip.destination || "Yatra"} • ${formatDate(trip.start_date)}`}
                onPress={() => navigation.navigate("TripDetails", { uuid: trip.uuid })}
              />
            ))
          )}
        </MiniSection>

        <MiniSection
          title="Spiritual Courses"
          icon={GraduationCap}
          onViewAll={() => navigation.navigate("Courses")}
        >
          {courses.slice(0, 4).length === 0 ? (
            <Empty text="No courses available yet." />
          ) : (
            courses.slice(0, 4).map((course) => (
              <MiniItem
                key={course.uuid}
                title={course.title}
                subtitle={`${course.course_mode || "course"} • ${formatDate(course.start_date)}`}
                onPress={() => navigation.navigate("CourseDetails", { uuid: course.uuid })}
              />
            ))
          )}
        </MiniSection>

        <MiniSection
          title="Premium Access"
          icon={Crown}
          onViewAll={() => navigation.navigate("Profile")}
        >
          {subscription ? (
            <View style={styles.premiumActive}>
              <Text style={styles.premiumStatus}>Premium Active</Text>
              <Text style={styles.premiumTitle}>
                {subscription.plan_name || "Premium Plan"}
              </Text>
              <Text style={styles.premiumText}>
                Valid until {formatDate(subscription.end_date)}
              </Text>
            </View>
          ) : (
            <View style={styles.premiumBox}>
              <Text style={styles.premiumStatusOrange}>No active subscription</Text>
              <Text style={styles.premiumText}>
                Subscribe to unlock premium journals and newsletters.
              </Text>
            </View>
          )}
        </MiniSection>

        <SectionCard
          title="Content & Learning"
          subtitle="Journals, newsletters and learning resources."
          icon={BookOpen}
        >
          <FeatureCard
            title="Journals"
            text="Read devotional journal posts and premium writings."
            icon={BookOpen}
            onPress={() => navigation.navigate("Journals")}
          />

          <FeatureCard
            title="Newsletters"
            text="Stay updated with temple announcements and spiritual content."
            icon={Newspaper}
            onPress={() => navigation.navigate("Newsletters")}
          />

          <FeatureCard
            title="Courses"
            text="Learn Bhagavad Gita, bhakti basics and spiritual practice."
            icon={GraduationCap}
            onPress={() => navigation.navigate("Courses")}
          />
        </SectionCard>
      </ScrollView>

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        navigation={navigation}
      />
    </View>
  );
}

function HeroStat({ label, value, small }: any) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={small ? styles.heroStatValueSmall : styles.heroStatValue}>
        {value}
      </Text>
    </View>
  );
}

function SectionCard({ title, subtitle, icon: Icon, children }: any) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionCardHeader}>
        <View style={styles.sectionIcon}>
          <Icon size={22} color="#ea580c" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.sectionCardTitle}>{title}</Text>
          <Text style={styles.sectionCardSub}>{subtitle}</Text>
        </View>
      </View>

      {children}
    </View>
  );
}

function ProgressCard({ icon: Icon, title, text, bg }: any) {
  return (
    <View style={[styles.progressCard, { backgroundColor: bg }]}>
      <View style={styles.progressIcon}>
        <Icon size={22} color="#ea580c" />
      </View>
      <Text style={styles.progressLabel}>{title}</Text>
      <Text style={styles.progressTitle}>Keep Going</Text>
      <Text style={styles.progressText}>{text}</Text>
    </View>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon size={22} color="#ea580c" />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MiniSection({ title, icon: Icon, onViewAll, children }: any) {
  return (
    <View style={styles.miniSection}>
      <View style={styles.miniHeader}>
        <View style={styles.miniTitleRow}>
          <View style={styles.miniIcon}>
            <Icon size={20} color="#ea580c" />
          </View>
          <Text style={styles.miniTitle}>{title}</Text>
        </View>

        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>

      {children}
    </View>
  );
}

function MiniItem({ title, subtitle, onPress }: any) {
  return (
    <Pressable style={styles.miniItem} onPress={onPress}>
      <Text style={styles.miniItemTitle}>{title}</Text>
      <Text style={styles.miniItemSub}>{subtitle}</Text>
    </Pressable>
  );
}

function FeatureCard({ title, text, icon: Icon, onPress }: any) {
  return (
    <Pressable style={styles.featureCard} onPress={onPress}>
      <View style={styles.featureIcon}>
        <Icon size={22} color="#ea580c" />
      </View>

      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </Pressable>
  );
}

function Empty({ text }: any) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>{text}</Text>
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
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#c2410c",
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 44,
  },
  heroCard: {
    minHeight: 430,
    borderRadius: 36,
    overflow: "hidden",
    marginBottom: 16,
  },
  heroImage: {
    borderRadius: 36,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
    backgroundColor: "rgba(154,52,18,0.45)",
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  heroPillText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 41,
    lineHeight: 48,
    fontWeight: "900",
  },
  heroSub: {
    color: "#ffedd5",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "700",
    marginTop: 14,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 18,
  },
  whiteBadge: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  whiteBadgeText: {
    color: "#c2410c",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },
  darkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(67,20,7,0.45)",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  darkBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },
  heroButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },
  heroPrimaryBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  heroPrimaryText: {
    color: "#c2410c",
    fontWeight: "900",
  },
  heroSecondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  heroSecondaryText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  heroStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  heroStat: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  heroStatLabel: {
    color: "#ea580c",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroStatValue: {
    color: "#0f172a",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
  },
  heroStatValueSmall: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 9,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },
  sectionCardHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
    alignItems: "center",
  },
  sectionIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCardTitle: {
    color: "#0f172a",
    fontSize: 23,
    fontWeight: "900",
  },
  sectionCardSub: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 3,
  },
  progressGrid: {
    gap: 12,
  },
  progressCard: {
    borderRadius: 24,
    padding: 17,
  },
  progressIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  progressLabel: {
    color: "#64748b",
    fontWeight: "800",
  },
  progressTitle: {
    color: "#0f172a",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 5,
  },
  progressText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 6,
  },
  addTodayBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingVertical: 13,
    marginTop: 14,
  },
  addTodayText: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 24,
    padding: 17,
  },
  statIcon: {
    height: 46,
    width: 46,
    borderRadius: 16,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  statLabel: {
    color: "#64748b",
    fontWeight: "800",
  },
  statValue: {
    color: "#0f172a",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 7,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "900",
  },
  sectionSub: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 14,
  },
  quickGrid: {
    gap: 12,
    marginBottom: 18,
  },
  quickCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 24,
    padding: 18,
  },
  quickIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  quickTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
  quickText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 7,
  },
  miniSection: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },
  miniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  miniTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  miniIcon: {
    height: 42,
    width: 42,
    borderRadius: 15,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  miniTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
  },
  viewAll: {
    color: "#ea580c",
    fontWeight: "900",
  },
  miniItem: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  miniItemTitle: {
    color: "#0f172a",
    fontWeight: "900",
  },
  miniItemSub: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 4,
  },
  premiumActive: {
    backgroundColor: "#f0fdf4",
    borderRadius: 18,
    padding: 16,
  },
  premiumBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 16,
  },
  premiumStatus: {
    color: "#15803d",
    fontWeight: "900",
  },
  premiumStatusOrange: {
    color: "#ea580c",
    fontWeight: "900",
  },
  premiumTitle: {
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 6,
  },
  premiumText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 7,
  },
  featureCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 22,
    padding: 17,
    marginBottom: 12,
  },
  featureIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  featureTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 18,
  },
  featureText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 7,
  },
  emptyBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontWeight: "800",
    textAlign: "center",
  },
});