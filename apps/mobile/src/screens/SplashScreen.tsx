import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://iskconahmedabad.com/images/gallery/gallery2.jpg",
      }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Image
          source={{
            uri: "https://iskconahmedabad.com/images/logo.png",
          }}
          style={styles.logo}
        />

        <Text style={styles.title}>
          ISKCON Ahmedabad
        </Text>

        <Text style={styles.subtitle}>
          Hare Krishna 🙏
        </Text>

        <Text style={styles.text}>
          Awaken Your Spiritual Journey
        </Text>

        <View style={styles.loader}>
          <View style={styles.loaderFill} />
        </View>

        <Text style={styles.bottomText}>
          Events • Courses • Yatras • Journals
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(26,10,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 60,
    padding: 10,
  },

  title: {
    marginTop: 24,
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#d4a853",
  },

  text: {
    marginTop: 14,
    textAlign: "center",
    color: "#f5e8c8",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },

  loader: {
    width: 220,
    height: 8,
    backgroundColor: "#ffffff33",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 40,
  },

  loaderFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#d4a853",
  },

  bottomText: {
    position: "absolute",
    bottom: 60,
    color: "#d4a853",
    fontWeight: "800",
    letterSpacing: 1,
  },
});