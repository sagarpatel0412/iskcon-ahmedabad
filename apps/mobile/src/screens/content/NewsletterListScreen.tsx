import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Crown,
  Eye,
  Heart,
  Lock,
  Newspaper,
  Search,
  Sparkles,
  Timer,
  Unlock,
} from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import { getContentPosts } from "../../api/contentApi";

const FALLBACK_IMAGE =
  "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

export default function NewsletterListScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getContentPosts("newsletter");
      setPosts(Array.isArray(res.data) ? res.data : res.data?.posts || []);
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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const isPaid = post.visibility === "paid" || post.access_type !== "free";

      const matchesFilter =
        filter === "all" ||
        (filter === "free" && !isPaid) ||
        (filter === "paid" && isPaid);

      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, search]);

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader
        title="Newsletters"
        subtitle="Krishna Wisdom"
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
        <View style={styles.hero}>
          <Text style={styles.heroTag}>Krishna Wisdom</Text>
          <Text style={styles.heroTitle}>Newsletter Library</Text>
          <Text style={styles.heroText}>
            Read free and premium newsletters from ISKCON Ahmedabad.
          </Text>
        </View>

        <View style={styles.filterCard}>
          <View style={styles.filterRow}>
            <FilterButton
              label="All Issues"
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <FilterButton
              label="Free"
              active={filter === "free"}
              onPress={() => setFilter("free")}
            />
            <FilterButton
              label="Premium"
              active={filter === "paid"}
              onPress={() => setFilter("paid")}
            />
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search newsletters..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>
        </View>

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📰</Text>
            <Text style={styles.emptyTitle}>No Newsletter found</Text>
            <Text style={styles.emptyText}>
              Try changing filter or search text.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredPosts.map((post) => (
              <NewsletterCard
                key={post.uuid}
                post={post}
                onPress={() =>
                  navigation.navigate("ContentDetails", {
                    uuid: post.uuid,
                  })
                }
              />
            ))}
          </View>
        )}

        <View style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <Crown size={28} color="#ffffff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>
              Unlock all premium newsletters
            </Text>
            <Text style={styles.premiumText}>
              Get full access to journals, newsletters, deep guides and premium
              spiritual content.
            </Text>
          </View>

          <Pressable style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>Go Premium</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function NewsletterCard({
  post,
  onPress,
}: {
  post: any;
  onPress: () => void;
}) {
  const isPaid = post.visibility === "paid" || post.access_type !== "free";

  const image =
    post.thumbnail_url ||
    post.cover_image_url ||
    post.banner_image_url ||
    FALLBACK_IMAGE;

  const plainExcerpt = stripHtml(post.excerpt || "").slice(0, 130);

  const readingTime = Math.max(
    1,
    Math.ceil(
      stripHtml(post.content || "")
        .split(/\s+/)
        .filter(Boolean).length / 200
    )
  );

  const isFeatured = post.media?.some((m: any) => m.is_featured);

  return (
    <Pressable
      style={[
        styles.card,
        isPaid ? styles.paidCardBorder : styles.freeCardBorder,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.cover} />

        <View style={styles.imageOverlay} />

        <View style={styles.topBadges}>
          <View style={isPaid ? styles.premiumBadge : styles.freeBadge}>
            {isPaid ? (
              <Crown size={12} color="#92400e" />
            ) : (
              <Unlock size={12} color="#166534" />
            )}

            <Text
              style={isPaid ? styles.premiumBadgeText : styles.freeBadgeText}
            >
              {isPaid ? "Premium" : "Free"}
            </Text>
          </View>

          {isFeatured && (
            <View style={styles.featuredBadge}>
              <Sparkles size={12} color="#ffffff" />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          )}
        </View>

        <View style={styles.imageTitleBox}>
          <Text style={styles.typeText}>{post.type || "newsletter"}</Text>

          <Text numberOfLines={2} style={styles.imageTitle}>
            {post.title}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={3} style={styles.excerpt}>
          {plainExcerpt || "No excerpt available."}
        </Text>

        {isPaid && (
          <View style={styles.lockBox}>
            <Lock size={15} color="#92400e" />

            <Text style={styles.lockText}>
              {Number(post.price_amount) > 0
                ? `Unlock for ${post.currency || "INR"} ${post.price_amount}`
                : "Premium members only"}
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <Meta icon={Eye} value={post.view_count || 0} />
          <Meta icon={Heart} value={post.likes_count || 0} />
          <Meta icon={Timer} value={`${readingTime} min`} />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.authorRow}>
            <View style={isPaid ? styles.authorPaid : styles.authorFree}>
              <Text
                style={isPaid ? styles.authorPaidText : styles.authorFreeText}
              >
                {post.author?.first_name?.charAt(0)?.toUpperCase() || "A"}
              </Text>
            </View>

            <Text style={styles.authorName}>
              {post.author?.first_name || "Author"}
            </Text>
          </View>

          <View style={isPaid ? styles.unlockBtn : styles.readBtn}>
            <Text style={isPaid ? styles.unlockBtnText : styles.readBtnText}>
              {isPaid ? "Unlock" : "Read now"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function FilterButton({ label, active, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterBtn, active && styles.filterBtnActive]}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Meta({ icon: Icon, value }: any) {
  return (
    <View style={styles.metaItem}>
      <Icon size={15} color="#94a3b8" />
      <Text style={styles.metaText}>{value}</Text>
    </View>
  );
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
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
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: "#1a0a00",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
  },
  heroTag: {
    color: "#d4a853",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },
  heroText: {
    color: "#d4a853",
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 9,
  },
  filterCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
    marginBottom: 18,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    backgroundColor: "#f8fafc",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterBtnActive: {
    backgroundColor: "#ea580c",
  },
  filterText: {
    color: "#64748b",
    fontWeight: "900",
    fontSize: 12,
  },
  filterTextActive: {
    color: "#ffffff",
  },
  searchBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#334155",
    fontWeight: "800",
  },
  grid: {
    gap: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
  },
  paidCardBorder: {
    borderColor: "#f59e0b",
  },
  freeCardBorder: {
    borderColor: "#e2e8f0",
  },
  imageWrap: {
    height: 210,
    position: "relative",
  },
  cover: {
    height: "100%",
    width: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.38)",
  },
  topBadges: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  premiumBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  premiumBadgeText: {
    color: "#92400e",
    fontWeight: "900",
    fontSize: 11,
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  freeBadgeText: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 11,
  },
  featuredBadge: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featuredBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 11,
  },
  imageTitleBox: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
  typeText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  imageTitle: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 29,
    marginTop: 4,
  },
  cardBody: {
    padding: 18,
  },
  excerpt: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 22,
  },
  lockBox: {
    backgroundColor: "#fffbeb",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  lockText: {
    color: "#92400e",
    fontWeight: "900",
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "900",
  },
  footerRow: {
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  authorPaid: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  authorPaidText: {
    color: "#92400e",
    fontWeight: "900",
  },
  authorFree: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  authorFreeText: {
    color: "#1d4ed8",
    fontWeight: "900",
  },
  authorName: {
    color: "#64748b",
    fontWeight: "800",
  },
  unlockBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  unlockBtnText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
  },
  readBtn: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readBtnText: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyIcon: {
    fontSize: 44,
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  emptyText: {
    marginTop: 8,
    color: "#64748b",
    fontWeight: "800",
    textAlign: "center",
  },
  premiumCard: {
    marginTop: 22,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 28,
    padding: 18,
    gap: 14,
  },
  premiumIcon: {
    height: 56,
    width: 56,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTitle: {
    color: "#0f172a",
    fontSize: 21,
    fontWeight: "900",
  },
  premiumText: {
    color: "#64748b",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 5,
  },
  premiumBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: "center",
  },
  premiumBtnText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});