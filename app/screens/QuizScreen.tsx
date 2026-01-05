import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { quizAPI } from "../../src/config/api";
import { useAuth } from "../../src/context/AuthContext";
import { generateQuizQuestions, QuizQuestion } from "../../src/data/vocabulary";

type QuizState = "start" | "playing" | "result";

export default function QuizScreen() {
  const { token } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>("start");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startQuiz = useCallback(() => {
    const newQuestions = generateQuizQuestions(10);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(Date.now());
    setQuizState("playing");
  }, []);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizState("result");

    // Submit results to server
    if (token) {
      setIsSubmitting(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      try {
        await quizAPI.submit(token, {
          score: Math.round((score / questions.length) * 100),
          totalQuestions: questions.length,
          correctAnswers: score + (selectedAnswer === questions[currentQuestionIndex]?.correctAnswer ? 1 : 0),
          timeSpent,
          quizType: "vocab",
        });
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getScoreMessage = () => {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    if (percentage >= 90) return { emoji: "🏆", message: "Luar biasa! Anda seorang ahli!" };
    if (percentage >= 70) return { emoji: "🎉", message: "Kerja bagus! Terus semangat!" };
    if (percentage >= 50) return { emoji: "👍", message: "Usaha bagus! Terus berlatih!" };
    return { emoji: "💪", message: "Jangan menyerah! Coba lagi!" };
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Start Screen
  if (quizState === "start") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kuis Bahasa Indonesia</Text>
          <View style={styles.headerSpacer} />
        </LinearGradient>

        <View style={styles.startContainer}>
          <View style={styles.startCard}>
            <Text style={styles.startIcon}>🎯</Text>
            <Text style={styles.startTitle}>Tantangan Kuis Indonesia</Text>
            <Text style={styles.startDesc}>
              Uji pengetahuan kosakata Bahasa Indonesia Anda dengan 10 pertanyaan.
              Tantang diri Anda dan pantau kemajuan Anda!
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📝</Text>
                <Text style={styles.infoText}>10 Pertanyaan</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoText}>Tanpa batas waktu</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📊</Text>
                <Text style={styles.infoText}>Pantau kemajuan</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <LinearGradient
                colors={["#FA8072", "#FFB6C1"]}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Mulai Kuis 🚀</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Result Screen
  if (quizState === "result") {
    const { emoji, message } = getScoreMessage();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasil Kuis</Text>
          <View style={styles.headerSpacer} />
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>{emoji}</Text>
            <Text style={styles.resultMessage}>{message}</Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scorePercentage}>{percentage}%</Text>
              <Text style={styles.scoreLabel}>Skor</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{score}</Text>
                <Text style={styles.statLabel}>Benar</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{questions.length - score}</Text>
                <Text style={styles.statLabel}>Salah</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{questions.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            {isSubmitting && (
              <View style={styles.submittingBox}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.submittingText}>Menyimpan kemajuan Anda...</Text>
              </View>
            )}

            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.retryButton} onPress={startQuiz}>
                <Text style={styles.retryButtonText}>Coba Lagi 🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.back()}
              >
                <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz Playing Screen
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Keluar Kuis", "Apakah Anda yakin ingin keluar? Kemajuan Anda akan hilang.", [
              { text: "Batal", style: "cancel" },
              { text: "Keluar", style: "destructive", onPress: () => setQuizState("start") },
            ]);
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>✕ Keluar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Pertanyaan {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <View style={styles.headerSpacer}>
          <Text style={styles.scoreText}>Skor: {score}</Text>
        </View>
      </LinearGradient>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.quizContainer}>
        {currentQuestion && (
          <View style={styles.questionCard}>
            <Text style={styles.wordBadge}>{currentQuestion.word}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                let optionStyle = styles.optionButton;
                let textStyle = styles.optionText;

                if (showResult) {
                  if (option === currentQuestion.correctAnswer) {
                    optionStyle = { ...styles.optionButton, ...styles.optionCorrect };
                    textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
                  } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                    optionStyle = { ...styles.optionButton, ...styles.optionWrong };
                    textStyle = { ...styles.optionText, ...styles.optionTextWrong };
                  }
                } else if (option === selectedAnswer) {
                  optionStyle = { ...styles.optionButton, ...styles.optionSelected };
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={optionStyle}
                    onPress={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    activeOpacity={0.7}
                  >
                    <Text style={textStyle}>{option}</Text>
                    {showResult && option === currentQuestion.correctAnswer && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                      <Text style={styles.crossMark}>✗</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {showResult && (
              <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                <LinearGradient
                  colors={["#10b981", "#34d399"]}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < questions.length - 1
                      ? "Pertanyaan Selanjutnya →"
                      : "Lihat Hasil 🎉"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
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
  backButton: {
    padding: 8,
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
    width: 70,
    alignItems: "flex-end",
  },
  scoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  startCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  startIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  startDesc: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  infoItem: {
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
  },
  startButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizContainer: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  wordBadge: {
    alignSelf: "center",
    backgroundColor: "#667eea",
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    overflow: "hidden",
  },
  questionText: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  optionSelected: {
    borderColor: "#667eea",
    backgroundColor: "#f0f0ff",
  },
  optionCorrect: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  optionWrong: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  optionText: {
    fontSize: 16,
    color: "#4b5563",
  },
  optionTextCorrect: {
    color: "#059669",
    fontWeight: "600",
  },
  optionTextWrong: {
    color: "#dc2626",
    fontWeight: "600",
  },
  checkMark: {
    color: "#10b981",
    fontSize: 20,
    fontWeight: "bold",
  },
  crossMark: {
    color: "#ef4444",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
    textAlign: "center",
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0f0ff",
    borderWidth: 6,
    borderColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#667eea",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
  },
  submittingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f0f0ff",
    borderRadius: 8,
  },
  submittingText: {
    marginLeft: 8,
    color: "#667eea",
    fontSize: 14,
  },
  resultButtons: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
