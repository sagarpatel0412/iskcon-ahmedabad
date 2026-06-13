import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import AppHeader from "../../components/AppHeader";
import { getContentPostByUuid } from "../../api/contentApi";
import {
  createPostPurchaseOrder,
  createSubscriptionOrder,
  getSubscriptionPlans,
  verifyPostPurchase,
  verifySubscriptionPayment,
} from "../../api/contentPaymentApi";

const FALLBACK_IMAGE =
  "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

export default function ContentDetailsScreen({ navigation, route }: any) {
  const { uuid } = route.params;

  const [post, setPost] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getContentPostByUuid(uuid);
      const postData = res.data?.post || res.data;

      setPost(postData);

      if (postData?.is_locked) {
        const plansRes = await getSubscriptionPlans();
        setPlans(Array.isArray(plansRes.data) ? plansRes.data : []);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load content"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  const readingTime = useMemo(() => {
    const words = stripHtml(post?.content || post?.excerpt || "")
      .split(/\s+/)
      .filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  const buyPost = async () => {
    try {
      if (!post) return;

      setPaying(true);

      const orderRes = await createPostPurchaseOrder(post.uuid);
      const { key, order, payment_uuid } = orderRes.data;

      const paymentResponse: any = await RazorpayCheckout.open({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ISKCON Ahmedabad",
        description: post.title,
        image: "https://iskconahmedabad.com/images/logo.png",
        theme: {
          color: "#c8902a",
        },
      });

      await verifyPostPurchase({
        payment_uuid,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      Alert.alert("Success", "Content unlocked successfully 🙏");
      await load();
    } catch (error: any) {
      Alert.alert(
        "Payment Failed",
        error?.response?.data?.message ||
          error?.description ||
          "Payment failed"
      );
    } finally {
      setPaying(false);
    }
  };

  const subscribe = async (planUuid: string) => {
    try {
      setPaying(true);

      const orderRes = await createSubscriptionOrder(planUuid);
      const { key, order, payment_uuid, plan } = orderRes.data;

      const paymentResponse: any = await RazorpayCheckout.open({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ISKCON Ahmedabad",
        description: plan?.name || "Premium Subscription",
        image: "https://iskconahmedabad.com/images/logo.png",
        theme: {
          color: "#c8902a",
        },
      });

      await verifySubscriptionPayment({
        payment_uuid,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      Alert.alert("Success", "Subscription activated successfully 🙏");
      await load();
    } catch (error: any) {
      Alert.alert(
        "Subscription Failed",
        error?.response?.data?.message ||
          error?.description ||
          "Subscription failed"
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderPage}>
        <ActivityIndicator size="large" color="#c8902a" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.loaderPage}>
        <Text style={styles.errorText}>Content not found</Text>
      </View>
    );
  }

  const commonProps = {
    post,
    readingTime,
    navigation,
    plans,
    paying,
    onBuyPost: buyPost,
    onSubscribe: subscribe,
  };

  if (post.type === "journal") {
    return <JournalDetails {...commonProps} />;
  }

  return <NewsletterDetails {...commonProps} />;
}

function JournalDetails({
  post,
  readingTime,
  navigation,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: any) {
  const isPaid = post.visibility === "paid" || post.access_type !== "free";

  const banner =
    post.banner_image_url ||
    post.cover_image_url ||
    post.thumbnail_url ||
    FALLBACK_IMAGE;

  const cover =
    post.cover_image_url ||
    post.thumbnail_url ||
    post.banner_image_url ||
    FALLBACK_IMAGE;

  return (
    <View style={styles.page}>
      <AppHeader
        title="Journal"
        subtitle="Sacred reading"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.journalShell}>
          <ImageBackground
            source={{ uri: banner }}
            style={styles.journalBanner}
            imageStyle={styles.journalBannerImage}
          >
            <View style={styles.journalBannerOverlay}>
              <View style={styles.badgeRow}>
                <View style={styles.journalBadge}>
                  <Text style={styles.journalBadgeText}>Journal</Text>
                </View>

                <View style={isPaid ? styles.paidBadge : styles.freeBadge}>
                  <Text
                    style={isPaid ? styles.paidBadgeText : styles.freeBadgeText}
                  >
                    {isPaid ? "Premium" : "Free"}
                  </Text>
                </View>
              </View>

              <Text style={styles.mantra}>✦ ॐ नमो भगवते वासुदेवाय ✦</Text>
              <Text style={styles.journalHeroTitle}>{post.title}</Text>
            </View>
          </ImageBackground>

          <View style={styles.journalInfoArea}>
            <Image source={{ uri: cover }} style={styles.journalCover} />

            <View style={styles.metaGrid}>
              <MiniInfo label="Views" value={post.view_count || 0} />
              <MiniInfo label="Read" value={`${readingTime} min`} />
              <MiniInfo label="Status" value={post.status || "-"} />
              <MiniInfo
                label="Access"
                value={isPaid ? `₹${post.price_amount || 0}` : "Free"}
              />
            </View>

            <View style={styles.identityCard}>
              <Text style={styles.sectionLabel}>Content Identity</Text>

              <InfoRow label="Type" value={post.type} />
              <InfoRow label="Visibility" value={post.visibility} />
              <InfoRow label="Access Type" value={post.access_type} />
              <InfoRow label="Currency" value={post.currency || "INR"} />
            </View>
          </View>
        </View>

        {!!post.excerpt && (
          <View style={styles.journalExcerptCard}>
            <Text style={styles.sectionLabelAmber}>Journal Excerpt</Text>
            <Text style={styles.excerptText}>{stripHtml(post.excerpt)}</Text>
          </View>
        )}

        {post.is_locked ? (
          <LockedBox
            post={post}
            plans={plans}
            paying={paying}
            onBuyPost={onBuyPost}
            onSubscribe={onSubscribe}
          />
        ) : (
          <View style={styles.readingCard}>
            <Text style={styles.sectionLabel}>Journal Content</Text>
            <Text style={styles.contentText}>{stripHtml(post.content)}</Text>
          </View>
        )}

        <MediaGallery post={post} />
        <AuthorCard post={post} />
      </ScrollView>
    </View>
  );
}

function NewsletterDetails({
  post,
  readingTime,
  navigation,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: any) {
  const isPaid = post.visibility === "paid" || post.access_type !== "free";

  const banner =
    post.banner_image_url ||
    post.cover_image_url ||
    post.thumbnail_url ||
    FALLBACK_IMAGE;

  return (
    <View style={styles.page}>
      <AppHeader
        title="Newsletter"
        subtitle="Krishna Wisdom"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ImageBackground
          source={{ uri: banner }}
          style={styles.newsletterHero}
          imageStyle={styles.newsletterHeroImage}
        >
          <View style={styles.newsletterOverlay}>
            <View style={styles.badgeRow}>
              <View style={isPaid ? styles.paidBadge : styles.freeBadge}>
                <Text
                  style={isPaid ? styles.paidBadgeText : styles.freeBadgeText}
                >
                  {isPaid ? "Premium" : "Free"}
                </Text>
              </View>
            </View>

            <Text style={styles.newsletterTitle}>{post.title}</Text>

            <Text style={styles.newsletterAuthor}>
              By {post.author?.first_name || "ISKCON"}{" "}
              {post.author?.last_name || ""}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.metaGrid}>
          <MiniInfo label="Views" value={post.view_count || 0} />
          <MiniInfo label="Read" value={`${readingTime} min`} />
          <MiniInfo label="Type" value={post.type} />
          <MiniInfo
            label="Access"
            value={isPaid ? `₹${post.price_amount || 0}` : "Free"}
          />
        </View>

        {!!post.excerpt && (
          <View style={styles.newsletterExcerptCard}>
            <Text style={styles.sectionLabelBlue}>Excerpt</Text>
            <Text style={styles.excerptText}>{stripHtml(post.excerpt)}</Text>
          </View>
        )}

        {post.is_locked ? (
          <LockedBox
            post={post}
            plans={plans}
            paying={paying}
            onBuyPost={onBuyPost}
            onSubscribe={onSubscribe}
          />
        ) : (
          <View style={styles.readingCard}>
            <Text style={styles.sectionLabel}>Content</Text>
            <Text style={styles.contentText}>{stripHtml(post.content)}</Text>
          </View>
        )}

        <MediaGallery post={post} />
        <AuthorCard post={post} />
      </ScrollView>
    </View>
  );
}

function LockedBox({
  post,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: any) {
  const canBuySingle =
    post.access_type === "one_time" ||
    post.access_type === "subscription_or_one_time";

  const canSubscribe =
    post.access_type === "subscription" ||
    post.access_type === "subscription_or_one_time";

  return (
    <View style={styles.lockedCard}>
      <Text style={styles.lockIcon}>🔒</Text>
      <Text style={styles.lockLabel}>Premium Content</Text>

      <Text style={styles.lockTitle}>Unlock this {post.type}</Text>

      <Text style={styles.lockText}>
        {post.lock_message ||
          "This content requires purchase or active subscription."}
      </Text>

      {canBuySingle && (
        <View style={styles.unlockPlanCard}>
          <Text style={styles.unlockPlanTitle}>Buy Once</Text>
          <Text style={styles.unlockPlanText}>
            Unlock only this journal/newsletter forever.
          </Text>

          <Text style={styles.unlockPrice}>
            ₹{Number(post.price_amount || 0)}
          </Text>

          <Pressable
            style={[styles.unlockButton, paying && styles.disabledButton]}
            disabled={paying}
            onPress={onBuyPost}
          >
            <Text style={styles.unlockButtonText}>
              {paying ? "Processing..." : "Unlock This Content"}
            </Text>
          </Pressable>
        </View>
      )}

      {canSubscribe && (
        <View style={styles.unlockPlanCard}>
          <Text style={styles.unlockPlanTitle}>Subscribe</Text>
          <Text style={styles.unlockPlanText}>
            Unlock all premium journals and newsletters.
          </Text>

          {plans.length === 0 ? (
            <Text style={styles.noPlanText}>
              No subscription plans available.
            </Text>
          ) : (
            plans.map((plan: any) => (
              <Pressable
                key={plan.uuid}
                style={[styles.planButton, paying && styles.disabledButton]}
                disabled={paying}
                onPress={() => onSubscribe(plan.uuid)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planType}>
                    {plan.billing_cycle || plan.plan_type || "Plan"}
                  </Text>
                </View>

                <Text style={styles.planPrice}>
                  ₹{Number(plan.price_amount || plan.amount || 0)}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

function MediaGallery({ post }: { post: any }) {
  if (!post.media?.length) return null;

  return (
    <View style={styles.gallerySection}>
      <Text style={styles.galleryTitle}>Media Attachments</Text>

      {post.media.map((item: any) => (
        <View key={item.uuid} style={styles.mediaCard}>
          {item.media_type === "image" ? (
            <Image source={{ uri: item.file_url }} style={styles.mediaImage} />
          ) : (
            <View style={styles.fileBox}>
              <Text style={styles.fileIcon}>📎</Text>
              <Text style={styles.fileText}>{item.media_type}</Text>
            </View>
          )}

          <View style={styles.mediaBody}>
            <Text style={styles.mediaTitle}>{item.title || "Media"}</Text>
            <Text style={styles.mediaType}>{item.media_type}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function AuthorCard({ post }: { post: any }) {
  return (
    <View style={styles.authorCard}>
      <View style={styles.authorAvatar}>
        <Text style={styles.authorAvatarText}>
          {post.author?.first_name?.charAt(0)?.toUpperCase() || "I"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.authorLabel}>Author</Text>
        <Text style={styles.authorName}>
          {post.author?.first_name || "ISKCON"} {post.author?.last_name || ""}
        </Text>
        <Text style={styles.authorSub}>ISKCON Ahmedabad Contributor</Text>
      </View>
    </View>
  );
}

function MiniInfo({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.miniInfo}>
      <Text style={styles.miniLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.miniValue}>
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  );
}

function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 48,
  },
  loaderPage: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  journalShell: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  journalBanner: {
    height: 270,
  },
  journalBannerImage: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  journalBannerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(15,23,42,0.55)",
  },
  mantra: {
    alignSelf: "flex-start",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 12,
    overflow: "hidden",
  },
  journalHeroTitle: {
    color: "#ffffff",
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 36,
  },
  journalInfoArea: {
    padding: 18,
    backgroundColor: "#f8fafc",
  },
  journalCover: {
    width: "100%",
    height: 360,
    borderRadius: 26,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },
  newsletterHero: {
    height: 390,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 18,
  },
  newsletterHeroImage: {
    borderRadius: 30,
  },
  newsletterOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  newsletterTitle: {
    color: "#ffffff",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 38,
  },
  newsletterAuthor: {
    color: "#e2e8f0",
    fontWeight: "800",
    marginTop: 10,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  journalBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  journalBadgeText: {
    color: "#2563eb",
    fontSize: 11,
    fontWeight: "900",
  },
  paidBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  paidBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  freeBadgeText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "900",
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  miniInfo: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  miniLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  miniValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4,
  },
  identityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionLabel: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  sectionLabelAmber: {
    color: "#92400e",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  sectionLabelBlue: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },
  journalExcerptCard: {
    marginTop: 20,
    backgroundColor: "#fffbeb",
    borderLeftWidth: 5,
    borderLeftColor: "#f59e0b",
    borderRadius: 24,
    padding: 18,
  },
  newsletterExcerptCard: {
    marginTop: 20,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 24,
    padding: 18,
  },
  excerptText: {
    color: "#334155",
    fontSize: 16,
    lineHeight: 27,
    fontWeight: "700",
  },
  readingCard: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  contentText: {
    color: "#334155",
    fontSize: 17,
    lineHeight: 30,
    fontWeight: "600",
  },
  lockedCard: {
    marginTop: 20,
    backgroundColor: "#fdfaf5",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "#c8902a",
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 44,
  },
  lockLabel: {
    marginTop: 16,
    color: "#8b6914",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  lockTitle: {
    color: "#1a0a00",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
    textTransform: "capitalize",
  },
  lockText: {
    color: "#9a7a4a",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
  unlockPlanCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 24,
    padding: 18,
    marginTop: 18,
  },
  unlockPlanTitle: {
    color: "#1a0a00",
    fontSize: 24,
    fontWeight: "900",
  },
  unlockPlanText: {
    color: "#9a7a4a",
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 6,
  },
  unlockPrice: {
    color: "#c8902a",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 14,
  },
  unlockButton: {
    backgroundColor: "#c8902a",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 18,
  },
  unlockButtonText: {
    color: "#1a0a00",
    fontWeight: "900",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  planButton: {
    marginTop: 12,
    backgroundColor: "#fdfaf5",
    borderWidth: 1,
    borderColor: "#ede0c8",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planName: {
    color: "#1a0a00",
    fontWeight: "900",
    fontSize: 15,
  },
  planType: {
    marginTop: 3,
    color: "#9a7a4a",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  planPrice: {
    color: "#c8902a",
    fontSize: 22,
    fontWeight: "900",
  },
  noPlanText: {
    marginTop: 14,
    backgroundColor: "#f5e8c8",
    color: "#8b6914",
    padding: 14,
    borderRadius: 16,
    fontWeight: "800",
  },
  gallerySection: {
    marginTop: 24,
  },
  galleryTitle: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  mediaCard: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  mediaImage: {
    width: "100%",
    height: 250,
  },
  fileBox: {
    height: 180,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  fileIcon: {
    fontSize: 40,
  },
  fileText: {
    color: "#64748b",
    fontWeight: "900",
    marginTop: 6,
  },
  mediaBody: {
    padding: 16,
  },
  mediaTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 17,
  },
  mediaType: {
    color: "#2563eb",
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 4,
    fontSize: 12,
  },
  authorCard: {
    marginTop: 24,
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  authorAvatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  authorAvatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  authorLabel: {
    color: "#2563eb",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  authorName: {
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 3,
  },
  authorSub: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 2,
  },
});