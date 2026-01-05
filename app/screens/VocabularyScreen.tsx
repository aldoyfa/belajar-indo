import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { VocabCategory, vocabularyData, VocabWord } from "../_data/vocabulary";

// Try to import expo-speech, but handle gracefully if not available
let Speech: any = null;
try {
  Speech = require("expo-speech");
} catch (e) {
  console.warn("expo-speech not available");
}

const { width } = Dimensions.get("window");

type ViewMode = "categories" | "flashcards";

export default function VocabularyScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const speakIndonesian = (text: string) => {
    if (Speech) {
      Speech.speak(text, {
        language: "id-ID",
        rate: 0.8,
        pitch: 1.0,
      });
    } else {
      Alert.alert("Audio", `🔊 ${text}`, [{ text: "OK" }]);
    }
  };

  const speakEnglish = (text: string) => {
    if (Speech) {
      Speech.speak(text, {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
      });
    } else {
      Alert.alert("Audio", `🔊 ${text}`, [{ text: "OK" }]);
    }
  };

  const handleCategorySelect = (category: VocabCategory) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setViewMode("flashcards");
  };

  const handleBack = () => {
    if (viewMode === "flashcards") {
      setViewMode("categories");
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  const nextCard = () => {
    if (selectedCategory && currentIndex < selectedCategory.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentWord: VocabWord | undefined = selectedCategory?.words[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {viewMode === "categories"
              ? "Kosakata Indonesia"
              : selectedCategory?.name}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {viewMode === "categories" ? (
        // Category Selection View
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Pilih Kategori</Text>
          <Text style={styles.sectionSubtitle}>
            Pilih kategori untuk mulai belajar kosakata
          </Text>

          {vocabularyData.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#6b46c1", "#7c3aed"]}
                style={styles.categoryGradient}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDesc}>{category.description}</Text>
                  <Text style={styles.categoryCount}>
                    {category.words.length} words
                  </Text>
                </View>
                <Text style={styles.categoryArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      ) : (
        // Flashcard View
        <View style={styles.flashcardContainer}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((currentIndex + 1) / (selectedCategory?.words.length || 1)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Kartu {currentIndex + 1} dari {selectedCategory?.words.length}
            </Text>
          </View>

          {/* Flashcard */}
          {currentWord && (
            <View style={styles.flashcard}>
              {/* Indonesian (Top) */}
              <LinearGradient
                colors={["#6b46c1", "#7c3aed"]}
                style={styles.flashcardTop}
              >
                <TouchableOpacity
                  style={styles.audioButton}
                  onPress={() => speakIndonesian(currentWord.word)}
                >
                  <Text style={styles.audioButtonText}>🔊</Text>
                </TouchableOpacity>
                <Text style={styles.indonesianWord}>{currentWord.word}</Text>
                <Text style={styles.exampleId}>{currentWord.example_id}</Text>
                <Text style={styles.languageLabel}>Indonesia</Text>
              </LinearGradient>

              {/* English (Bottom) */}
              <LinearGradient
                colors={["#9f7aea", "#c4b5fd"]}
                style={styles.flashcardBottom}
              >
                <TouchableOpacity
                  style={styles.audioButtonDark}
                  onPress={() => speakEnglish(currentWord.meaning)}
                >
                  <Text style={styles.audioButtonText}>🔊</Text>
                </TouchableOpacity>
                <Text style={styles.englishWord}>{currentWord.meaning}</Text>
                <Text style={styles.exampleEn}>{currentWord.example}</Text>
                <Text style={styles.languageLabelDark}>English</Text>
              </LinearGradient>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={prevCard}
              disabled={currentIndex === 0}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                ← Sebelumnya
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                currentIndex === (selectedCategory?.words.length || 0) - 1 &&
                  styles.navButtonDisabled,
              ]}
              onPress={nextCard}
              disabled={
                currentIndex === (selectedCategory?.words.length || 0) - 1
              }
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.navButtonTextPrimary,
                  currentIndex === (selectedCategory?.words.length || 0) - 1 &&
                    styles.navButtonTextDisabled,
                ]}
              >
                Selanjutnya →
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setViewMode("categories")}
          >
            <Text style={styles.exitButtonText}>Keluar Flashcard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6b46c1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  categoryIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  categoryArrow: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 40,
  },
  flashcardContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },
  flashcard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6b46c1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  flashcardTop: {
    padding: 28,
    alignItems: "center",
    minHeight: 180,
    justifyContent: "center",
    position: "relative",
  },
  flashcardBottom: {
    padding: 28,
    alignItems: "center",
    minHeight: 180,
    justifyContent: "center",
    position: "relative",
  },
  audioButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  audioButtonDark: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  audioButtonText: {
    fontSize: 20,
  },
  indonesianWord: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },
  exampleId: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontStyle: "italic",
  },
  languageLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
  },
  englishWord: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
  },
  exampleEn: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    fontStyle: "italic",
  },
  languageLabelDark: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  navButtonPrimary: {
    backgroundColor: "#667eea",
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  navButtonTextPrimary: {
    color: "#fff",
  },
  navButtonTextDisabled: {
    color: "#9ca3af",
  },
  exitButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  exitButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
