import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";

const { width } = Dimensions.get("window");

// Motivational quotes (matching web app)
const motivations = [
  "Learning a language is like opening a door to a new world.",
  "Every word you learn brings you closer to understanding a culture.",
  "Practice makes perfect - start your Indonesian journey today.",
  "The best time to learn Indonesian was yesterday. The second best time is now.",
  "Language learning is not a race, it's a journey of discovery.",
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [motivation, setMotivation] = useState(motivations[0]);
  const [refreshing, setRefreshing] = useState(false);

  const showRandomMotivation = () => {
    const randomIndex = Math.floor(Math.random() * motivations.length);
    setMotivation(motivations[randomIndex]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    showRandomMotivation();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Navbar / Header - matching web app */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.navbar}
      >
        <View style={styles.navContent}>
          <View style={styles.navBrand}>
            <Image
              source={require("../../assets/images/icon/Belajar.png")}
              style={styles.navLogo}
              contentFit="contain"
            />
            <Text style={styles.navTitle}>Belajar Indo</Text>
          </View>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.navProfileBtn}
              onPress={() => router.push("/profile")}
            >
              <Text style={styles.navProfileText}>Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navLoginBtn}
              onPress={() => router.push("/login")}
            >
              <LinearGradient
                colors={["#ff8c8c", "#ffb6b9"]}
                style={styles.navLoginGradient}
              >
                <Text style={styles.navLoginText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Hero Section - matching web app */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Welcome to Indonesian Virtual Lab
          </Text>
          <Text style={styles.heroSubtitle}>"{motivation}"</Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => {/* scroll to about */}}
            >
              <LinearGradient
                colors={["#ff8c8c", "#ffb6b9"]}
                style={styles.aboutButtonGradient}
              >
                <Text style={styles.aboutButtonText}>About Us</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.motivationButton}
              onPress={showRandomMotivation}
            >
              <Text style={styles.motivationButtonText}>New Motivation</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={require("../../assets/images/icon/Belajar.png")}
          style={styles.heroImage}
          contentFit="contain"
        />
      </View>

      {/* About Section - matching web app */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.aboutText}>
          Belajar Indo is here as a comprehensive solution for students,
          university learners, and the international community who want to
          master the Indonesian language. With an intuitive interface,
          interactive features, and well-structured learning materials, we aim
          to make your Indonesian learning journey enjoyable and accessible
          anytime, anywhere.
        </Text>
      </View>

      {/* Features Section - Virtual Lab Modules (matching web app) */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Virtual Lab Modules</Text>
        <Text style={styles.sectionSubtitle}>
          Interactive laboratory for Indonesian language experimentation and analysis
        </Text>

        {/* Vocabulary Feature Card */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push("/vocabulary")}
          activeOpacity={0.9}
        >
          <View style={styles.featureCardInner}>
            <Image
              source={require("../../assets/images/icon/Belajar.png")}
              style={styles.featureImage}
              contentFit="cover"
            />
            <Text style={styles.featureTitle}>Vocabulary</Text>
            <Text style={styles.featureDescription}>
              Master thousands of Indonesian words with ease! Our interactive Vocabulary
              section features audio pronunciation, visual flashcards, and engaging exercises
              to make learning effective and enjoyable.
            </Text>
            <View style={styles.featureButtons}>
              <TouchableOpacity
                style={styles.tryNowButton}
                onPress={() => router.push("/vocabulary")}
              >
                <Text style={styles.tryNowButtonText}>Try Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quiz Feature Card */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push("/quiz")}
          activeOpacity={0.9}
        >
          <View style={styles.featureCardInner}>
            <Image
              source={require("../../assets/images/icon/Belajar.png")}
              style={styles.featureImage}
              contentFit="cover"
            />
            <Text style={styles.featureTitle}>Interactive Quiz</Text>
            <Text style={styles.featureDescription}>
              Test and improve your Indonesian language skills with our fun, interactive
              quizzes! Challenge yourself with various difficulty levels and track your progress.
            </Text>
            <View style={styles.featureButtons}>
              <TouchableOpacity
                style={styles.tryNowButton}
                onPress={() => router.push("/quiz")}
              >
                <Text style={styles.tryNowButtonText}>Try Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => router.push("/profile")}
              >
                <Text style={styles.historyButtonText}>View History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Profile Card */}
        {isAuthenticated && (
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/profile")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#10b981", "#34d399"]}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>👤</Text>
              <Text style={styles.featureTitleWhite}>Your Profile</Text>
              <Text style={styles.featureDescriptionWhite}>
                View your learning progress, quiz history, and performance
                statistics. Track your Indonesian journey!
              </Text>
              <View style={styles.featureButtonWhite}>
                <Text style={styles.featureButtonTextWhite}>View Profile →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer - matching web app */}
      <LinearGradient
        colors={["#dc2626", "#ef4444"]}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          🇮🇩 BelajarIndo - Learn Indonesian with Joy
        </Text>
        <Text style={styles.footerSubtext}>
          Indonesian Virtual Lab © 2024
        </Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // Navbar styles
  navbar: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  navLogo: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 10,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  navProfileBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navProfileText: {
    color: "#fff",
    fontWeight: "600",
  },
  navLoginBtn: {
    borderRadius: 8,
    overflow: "hidden",
  },
  navLoginGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navLoginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Hero styles
  heroSection: {
    backgroundColor: "#fff",
    padding: 24,
    marginBottom: 16,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: "row",
    gap: 12,
  },
  aboutButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  aboutButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  aboutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  motivationButton: {
    borderWidth: 2,
    borderColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  motivationButtonText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 16,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  // About section
  aboutSection: {
    padding: 24,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
    textAlign: "center",
  },
  // Features section
  featuresSection: {
    padding: 20,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  featureCardInner: {
    padding: 16,
  },
  featureImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f3f4f6",
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureButtons: {
    flexDirection: "row",
    gap: 12,
  },
  tryNowButton: {
    backgroundColor: "#FA8072",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryNowButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  historyButton: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Gradient feature card
  featureGradient: {
    padding: 24,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitleWhite: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  featureDescriptionWhite: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureButtonWhite: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  featureButtonTextWhite: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  // Footer
  footer: {
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
});
