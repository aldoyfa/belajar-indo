import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/Card.';
import { CustomModal } from '../../components/CustomModal';
import { GradientButton } from '../../components/GradientButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { quizService } from '../../services/api';

// Sample quiz data
const QUIZ_DATA = [
  {
    question: 'Apa arti dari "Selamat pagi"?',
    options: ['Good morning', 'Good night', 'Good afternoon', 'Good evening'],
    correct: 0,
  },
  {
    question: 'Bagaimana cara mengatakan "Thank you" dalam bahasa Indonesia?',
    options: ['Maaf', 'Terima kasih', 'Permisi', 'Tolong'],
    correct: 1,
  },
  {
    question: 'Apa arti dari "Apa kabar"?',
    options: ['What is your name?', 'How are you?', 'Where are you?', 'When?'],
    correct: 1,
  },
  {
    question: 'Bagaimana cara mengatakan "I love you" dalam bahasa Indonesia?',
    options: ['Saya suka kamu', 'Saya cinta kamu', 'Saya rindu kamu', 'Saya sayang kamu'],
    correct: 1,
  },
  {
    question: 'Apa arti dari "Sampai jumpa"?',
    options: ['Hello', 'Goodbye', 'Please', 'Sorry'],
    correct: 1,
  },
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning'>('success');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progressResponse = await quizService.getProgress();
      if (progressResponse.ok && progressResponse.data.progress) {
        const progress = progressResponse.data.progress;
        if (progress.currentQuestion) {
          setCurrentQuestion(progress.currentQuestion);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const progress = Math.round(((currentQuestion + 1) / QUIZ_DATA.length) * 100);
      await quizService.saveProgress({
        quizCategory: 'vocab',
        progress,
        currentQuestion: currentQuestion + 1,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === QUIZ_DATA[currentQuestion].correct;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: index,
      isCorrect,
    };
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (selectedAnswer === null) {
      Alert.alert('Peringatan', 'Silakan pilih jawaban terlebih dahulu');
      return;
    }

    await saveProgress();

    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null && !showResult) {
      Alert.alert('Peringatan', 'Silakan jawab pertanyaan terakhir');
      return;
    }

    setLoading(true);
    
    const totalQuestions = QUIZ_DATA.length;
    const correctAnswers = score + (selectedAnswer === QUIZ_DATA[currentQuestion].correct ? 1 : 0);
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    const quizData = {
      quizType: 'vocab',
      score: finalScore,
      totalQuestions,
      correctAnswers,
      timeSpent,
    };

    const result = await quizService.submitQuiz(quizData);
    setLoading(false);

    if (result.ok) {
      setModalTitle('Quiz Berhasil!');
      setModalMessage(
        `Skor Anda: ${finalScore}%\nJawaban Benar: ${correctAnswers}/${totalQuestions}\nWaktu: ${timeSpent} detik`
      );
      setModalType('success');
      setModalVisible(true);
    } else {
      setModalTitle('Error');
      setModalMessage('Gagal menyimpan hasil quiz. Silakan coba lagi.');
      setModalType('error');
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      router.push('/(tabs)/profile');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentQuizItem = QUIZ_DATA[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_DATA.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.header}>
        <View style={styles.headerWithButton}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Quiz - Vocabulary</Text>
            <Text style={styles.headerSubtitle}>
              Question {currentQuestion + 1} of {QUIZ_DATA.length}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => router.push('/(tabs)/quiz-history')}
          >
            <Text style={styles.historyButtonIcon}>📊</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Question Card */}
        <Card style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Pertanyaan {currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>{currentQuizItem.question}</Text>
        </Card>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuizItem.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuizItem.correct;
            const showCorrect = selectedAnswer !== null && isCorrect;
            const showWrong = isSelected && !isCorrect && selectedAnswer !== null;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
              >
                <Card
                  style={StyleSheet.flatten([
                    styles.optionCard,
                    isSelected && styles.selectedOption,
                    showCorrect && styles.correctOption,
                    showWrong && styles.wrongOption,
                  ])}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionNumber}>
                      <Text style={styles.optionNumberText}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                    {showCorrect && <Text style={styles.checkMark}>✓</Text>}
                    {showWrong && <Text style={styles.crossMark}>✗</Text>}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Score Display */}
        <Card style={styles.scoreCard}>
          <Text style={styles.scoreText}>
            Skor Saat Ini: {score} / {currentQuestion + (selectedAnswer !== null ? 1 : 0)}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {currentQuestion < QUIZ_DATA.length - 1 ? (
            <GradientButton
              title="Next Question"
              onPress={handleNext}
              colors={['#4facfe', '#00f2fe']}
              style={styles.button}
            />
          ) : (
            <GradientButton
              title="Submit Quiz"
              onPress={handleSubmit}
              colors={['#f093fb', '#f5576c']}
              loading={loading}
              style={styles.button}
            />
          )}
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  historyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  historyButtonIcon: {
    fontSize: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    marginBottom: 20,
    padding: 20,
  },
  questionNumber: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#667eea',
    backgroundColor: '#eff6ff',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  wrongOption: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  checkMark: {
    fontSize: 24,
    color: '#10b981',
    fontWeight: 'bold',
  },
  crossMark: {
    fontSize: 24,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  scoreCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#eff6ff',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 15,
  },
});
