import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { quizService } from '../../services/api';

interface QuizResult {
  id: number;
  userId: number;
  category: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers?: any[];
}

export default function QuizHistoryScreen() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await quizService.getResults();
      
      if (response.ok && response.data.results) {
        setResults(response.data.results);
      } else {
        setError('Failed to load quiz history');
      }
    } catch (err) {
      console.error('Error loading quiz history:', err);
      setError('Error loading history');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const renderResultCard = ({ item }: { item: QuizResult }) => {
    const percentage = Math.round((item.score / item.totalQuestions) * 100);
    const scoreColor = getScoreColor(item.score, item.totalQuestions);
    const grade = getScoreGrade(item.score, item.totalQuestions);

    return (
      <View style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <Ionicons name="bookmark" size={16} color="#667eea" />
            <Text style={styles.categoryText}>{item.category || 'General'}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.scoreContainer}>
            <View style={[styles.gradeBadge, { backgroundColor: scoreColor }]}>
              <Text style={styles.gradeText}>{grade}</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreText}>
                {item.score} / {item.totalQuestions}
              </Text>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${percentage}%`, backgroundColor: scoreColor }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <View style={styles.headerWithBack}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz History</Text>
          </View>
        </LinearGradient>

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <View style={styles.headerWithBack}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz History</Text>
          </View>
        </LinearGradient>

        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerWithBack}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz History</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {results.length} quiz{results.length !== 1 ? 'zes' : ''} completed
        </Text>
      </LinearGradient>

      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Quiz History</Text>
          <Text style={styles.emptyText}>
            Complete quizzes to see your history here
          </Text>
          <TouchableOpacity
            style={styles.takeQuizButton}
            onPress={() => router.push('/(tabs)/quiz')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.takeQuizButtonGradient}
            >
              <Text style={styles.takeQuizButtonText}>Take a Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#667eea',
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardBody: {
    gap: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gradeBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  takeQuizButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  takeQuizButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  takeQuizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
