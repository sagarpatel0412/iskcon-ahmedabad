import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ArrowLeft,
  Bell,
  Menu,
  Sparkles,
} from "lucide-react-native";

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onProfile?: () => void;
};

export default function AppHeader({
  title = "ISKCON Ahmedabad",
  subtitle = "Hare Krishna",
  showBack = false,
  onBack,
  onMenu,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={showBack ? onBack : onMenu} style={styles.iconBtn}>
        {showBack ? (
          <ArrowLeft size={22} color="#ea580c" strokeWidth={2.7} />
        ) : (
          <Menu size={24} color="#ea580c" strokeWidth={2.7} />
        )}
      </Pressable>

      <View style={styles.textBox}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.subRow}>
          <Sparkles size={12} color="#c2410c" />
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Pressable style={styles.bellBtn}>
        <Bell size={19} color="#ea580c" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fed7aa",
    shadowColor: "#431407",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  textBox: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0f172a",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 11,
    color: "#c2410c",
    fontWeight: "800",
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
});