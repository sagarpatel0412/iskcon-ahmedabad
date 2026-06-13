import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  BookMarked,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  ChartNoAxesColumn,
  Crown,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  Luggage,
  MapPinned,
  Newspaper,
  PlusCircle,
  QrCode,
  Route,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react-native";

import { useCurrentUser } from "../hooks/useCurrentUser";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  navigation: any;
};

export default function SideMenu({
  visible,
  onClose,
  onLogout,
  navigation,
}: Props) {
  const { user, isSeeker, isDevotee, isAdmin, isVerifiedDevotee } =
    useCurrentUser();

  if (!visible) return null;

  const canDevotee = isDevotee || isAdmin;

  const goTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerContent}
        >
          <View style={styles.brandCard}>
            <Image
              source={{
                uri: "https://iskconahmedabad.com/images/logo.png",
              }}
              style={styles.logo}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.brandTitle}>ISKCON Ahmedabad</Text>
              <Text style={styles.brandSub}>
                Hare Krishna{user?.first_name ? `, ${user.first_name}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.roleRow}>
            <View style={styles.roleBadge}>
              <Sparkles size={13} color="#c2410c" />
              <Text style={styles.roleBadgeText}>
                {canDevotee ? "Devotee" : "Seeker"}
              </Text>
            </View>

            {isAdmin && (
              <View style={styles.roleBadgeDark}>
                <Crown size={13} color="#ffffff" />
                <Text style={styles.roleBadgeDarkText}>Admin</Text>
              </View>
            )}
          </View>

          <MenuItem icon={Home} label="Dashboard" onPress={() => goTo("Home")} />

          {canDevotee && (
            <>
              <SectionTitle title="Event Management" />

              <MenuItem
                icon={CalendarPlus}
                label="Create Event"
                onPress={() => goTo("CreateEvent")}
              />

              <MenuItem
                icon={CalendarDays}
                label="My Events"
                onPress={() => goTo("MyEvents")}
              />

              <MenuItem
                icon={UsersRound}
                label="Event Registrations"
                onPress={() => goTo("EventRegistrationManage")}
              />

              {(isVerifiedDevotee || isAdmin) && (
                <MenuItem
                  icon={QrCode}
                  label="Scan QR"
                  onPress={() => goTo("ScanQr")}
                />
              )}
            </>
          )}

          {isSeeker && (
            <>
              <SectionTitle title="Events" />

              <MenuItem
                icon={CalendarDays}
                label="Browse Events"
                onPress={() => goTo("BrowseEvents")}
              />

              <MenuItem
                icon={QrCode}
                label="My Registrations"
                onPress={() => goTo("MyRegistrations")}
              />
            </>
          )}

          <SectionTitle title="Progress" />

          <MenuItem
            icon={ChartNoAxesColumn}
            label="Daily Progress"
            onPress={() => goTo("DailyProgress")}
          />

          <MenuItem
            icon={BookOpen}
            label="Progress History"
            onPress={() => goTo("ProgressHistory")}
          />

          <SectionTitle title="Content" />

          <MenuItem
            icon={BookOpen}
            label="Journals"
            onPress={() => goTo("Journals")}
          />

          <MenuItem
            icon={Newspaper}
            label="Newsletters"
            onPress={() => goTo("Newsletters")}
          />

          <SectionTitle title="Trips & Yatras" />

          {canDevotee && (
            <>
              <MenuItem
                icon={Route}
                label="Browse Trips"
                onPress={() => goTo("Trips")}
              />

              <MenuItem
                icon={PlusCircle}
                label="Create Trip"
                onPress={() => goTo("CreateTrip")}
              />

              <MenuItem
                icon={MapPinned}
                label="My Created Trips"
                onPress={() => goTo("MyCreatedTrips")}
              />

              <MenuItem
                icon={UsersRound}
                label="Trip Registrations"
                onPress={() => goTo("TripRegistrationManage")}
              />
            </>
          )}

          {isSeeker && (
            <>
              <MenuItem
                icon={Route}
                label="Browse Trips"
                onPress={() => goTo("Trips")}
              />

              <MenuItem
                icon={Luggage}
                label="My Registered Trips"
                onPress={() => goTo("RegisteredTrips")}
              />
            </>
          )}

          <SectionTitle title="Courses" />

          {canDevotee && (
            <>
              <MenuItem
                icon={BookOpen}
                label="Browse Courses"
                onPress={() => goTo("Courses")}
              />

              <MenuItem
                icon={PlusCircle}
                label="Create Course"
                onPress={() => goTo("CreateCourse")}
              />

              <MenuItem
                icon={BookMarked}
                label="My Created Courses"
                onPress={() => goTo("MyCreatedCourses")}
              />

              <MenuItem
                icon={UsersRound}
                label="Course Registrations"
                onPress={() => goTo("CourseRegistrationManage")}
              />
            </>
          )}

          {isSeeker && (
            <>
              <MenuItem
                icon={BookOpen}
                label="Browse Courses"
                onPress={() => goTo("Courses")}
              />

              <MenuItem
                icon={GraduationCap}
                label="My Registered Courses"
                onPress={() => goTo("RegisteredCourses")}
              />
            </>
          )}

          <SectionTitle title="Account" />

          <MenuItem
            icon={UserRound}
            label="Profile"
            onPress={() => goTo("Profile")}
          />

          <SectionTitle title="Spiritual Calender" />

          <MenuItem
            icon={CalendarDays}
            label="Festival Calendar"
            onPress={() => goTo("FestivalCalendar")}
          />

          <SectionTitle title="Donation" />

          <MenuItem
            icon={Heart}
            label="Donate"
            onPress={() => goTo("Donate")}
          />
        </ScrollView>

        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <LogOut size={19} color="#ffffff" strokeWidth={2.6} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backdrop} onPress={onClose} />
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.parentWrap}>
      <Text style={styles.parent}>{title}</Text>
    </View>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Icon size={20} color="#ea580c" strokeWidth={2.5} />
      </View>

      <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: "row",
  },
  drawer: {
    width: 320,
    backgroundColor: "#fff7ed",
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 18,
    borderTopRightRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: "#431407",
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 16,
  },
  drawerContent: {
    paddingBottom: 24,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  brandCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 26,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  logo: {
    width: 58,
    height: 58,
    resizeMode: "contain",
  },
  brandTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  brandSub: {
    color: "#ea580c",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffedd5",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  roleBadgeText: {
    color: "#c2410c",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  roleBadgeDark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  roleBadgeDarkText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  parentWrap: {
    marginTop: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#fed7aa",
    paddingTop: 14,
  },
  parent: {
    fontSize: 11,
    fontWeight: "900",
    color: "#ea580c",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  menuLabel: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "900",
    flex: 1,
  },
  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#ea580c",
    paddingVertical: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  logoutText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },
});