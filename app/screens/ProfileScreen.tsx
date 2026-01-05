import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { quizAPI } from "../../src/config/api";
import { useAuth } from "../../src/context/AuthContext";

interface QuizResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  quizCategory: string;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  bestScore: number;
}

export default function ProfileScreen() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch stats first
      const statsRes = await quizAPI.getStats(token);
      
      console.log("Stats response:", JSON.stringify(statsRes, null, 2));

      // Parse stats - web app expects { stats: {...} }
      if (statsRes.ok && statsRes.data) {
        const responseData = statsRes.data as any;
        const statsData = responseData.stats || responseData;
        
        console.log("Stats data:", statsData);
        
        setStats({
          totalQuizzes: statsData.totalQuizzes || 0,
          averageScore: statsData.averageScore || 0,
          bestScore: statsData.bestScore || 0,
          totalTimeSpent: statsData.totalTimeSpent || 0,
        });
      }

      // Try /api/quiz/history first (like web app), fallback to /api/quiz/results
      let historyRes = await quizAPI.getHistory(token);
      console.log("History response (from /api/quiz/history):", JSON.stringify(historyRes, null, 2));
      
      // If history endpoint fails, try results endpoint
      if (!historyRes.ok) {
        console.log("History endpoint failed, trying results endpoint...");
        historyRes = await quizAPI.getResults(token);
        console.log("Results response (from /api/quiz/results):", JSON.stringify(historyRes, null, 2));
      }

      // Parse history/results - expects { results: [...] }
      if (historyRes.ok && historyRes.data) {
        const responseData = historyRes.data as any;
        // Handle both { results: [...] } and direct array formats
        const items = Array.isArray(responseData) 
          ? responseData 
          : (Array.isArray(responseData.results) ? responseData.results : []);
        
        console.log("Parsed quiz history items:", items.length);
        if (items.length > 0) {
          console.log("First item sample:", JSON.stringify(items[0], null, 2));
        }
        setQuizResults(items);
        setFetchError(null);
      } else {
        console.log("Both history and results fetch failed:", historyRes);
        setQuizResults([]);
        setFetchError(`API Error: ${historyRes.error || historyRes.status || 'Unknown'}`);
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
      setQuizResults([]);
      setFetchError(`Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <View style={styles.headerSpacer} />
        </LinearGradient>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginIcon}>🔒</Text>
          <Text style={styles.loginTitle}>Silakan Masuk</Text>
          <Text style={styles.loginDesc}>
            Anda harus masuk untuk melihat profil dan riwayat kuis Anda.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.profileHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
          <Text style={styles.userId}>User ID: {user?.id || "N/A"}</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Memuat statistik Anda...</Text>
          </View>
        ) : (
          <>
            {/* Summary Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📊</Text>
                <Text style={styles.statValue}>{stats?.totalQuizzes || 0}</Text>
                <Text style={styles.statLabel}>Total Kuis</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>
                  {stats?.averageScore?.toFixed(0) || 0}%
                </Text>
                <Text style={styles.statLabel}>Rata-rata</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>{stats?.bestScore || 0}%</Text>
                <Text style={styles.statLabel}>Skor Terbaik</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statValue}>{formatTime(stats?.totalTimeSpent || 0)}</Text>
                <Text style={styles.statLabel}>Total Waktu</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aksi Cepat</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push("/quiz")}
                >
                  <LinearGradient
                    colors={["#FA8072", "#FFB6C1"]}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionIcon}>🎯</Text>
                    <Text style={styles.actionText}>Mulai Kuis</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push("/vocabulary")}
                >
                  <LinearGradient
                    colors={["#6b46c1", "#7c3aed"]}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionIcon}>📚</Text>
                    <Text style={styles.actionText}>Belajar Kosakata</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quiz History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Riwayat Kuis ({quizResults.length})</Text>
              {fetchError ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>⚠️</Text>
                  <Text style={styles.emptyText}>Gagal memuat riwayat</Text>
                  <Text style={styles.emptySubtext}>{fetchError}</Text>
                  <TouchableOpacity 
                    style={[styles.loginButton, { marginTop: 16 }]}
                    onPress={onRefresh}
                  >
                    <Text style={styles.loginButtonText}>Coba Lagi</Text>
                  </TouchableOpacity>
                </View>
              ) : quizResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyText}>Belum ada kuis yang diselesaikan</Text>
                  <Text style={styles.emptySubtext}>
                    Ambil kuis untuk melihat riwayat Anda di sini
                  </Text>
                </View>
              ) : (
                quizResults.slice(0, 10).map((result, index) => {
                  // Handle score - might be decimal (0.8) or percentage (80)
                  const displayScore = result.score > 1 ? Math.round(result.score) : Math.round(result.score * 100);
                  return (
                  <View key={result.id || index} style={styles.historyCard}>
                    <View style={styles.historyLeft}>
                      <View
                        style={[
                          styles.scoreCircle,
                          { borderColor: getScoreColor(displayScore) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.historyScore,
                            { color: getScoreColor(displayScore) },
                          ]}
                        >
                          {displayScore}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={styles.historyCategory}>
                        {result.quizCategory === "vocab" ? "Kuis Kosakata" : (result.quizCategory || "Kuis Kosakata")}
                      </Text>
                      <Text style={styles.historyDetails}>
                        {result.correctAnswers || 0}/{result.totalQuestions || 10} benar •{" "}
                        {formatTime(result.timeSpent || 0)}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDate(result.completedAt)}
                      </Text>
                    </View>
                  </View>
                  );
                })
              )}
            </View>

            {/* Performance Insights */}
            {stats && stats.totalQuizzes > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Wawasan Performa</Text>
                <View style={styles.insightsCard}>
                  {stats.averageScore >= 80 ? (
                    <>
                      <Text style={styles.insightEmoji}>🏆</Text>
                      <Text style={styles.insightText}>
                        Performa luar biasa! Anda menguasai kosakata Bahasa Indonesia!
                      </Text>
                    </>
                  ) : stats.averageScore >= 60 ? (
                    <>
                      <Text style={styles.insightEmoji}>📈</Text>
                      <Text style={styles.insightText}>
                        Kemajuan bagus! Terus berlatih untuk meningkatkan skor Anda.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.insightEmoji}>💪</Text>
                      <Text style={styles.insightText}>
                        Terus belajar! Tinjau flashcard sebelum mengikuti kuis.
                      </Text>
                    </>
                  )}
                </View>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  profileHeader: {
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 60,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  logoutButton: {
    position: "absolute",
    right: 16,
    top: 10,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  actionGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyLeft: {
    marginRight: 16,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  historyScore: {
    fontSize: 14,
    fontWeight: "bold",
  },
  historyRight: {
    flex: 1,
    justifyContent: "center",
  },
  historyCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  historyDetails: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  insightsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loginIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  loginDesc: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 40,
  },
});
