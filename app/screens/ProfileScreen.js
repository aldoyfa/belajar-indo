import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { quizService, authService } from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load quiz results
      const resultsResponse = await quizService.getResults();
      if (resultsResponse.ok && resultsResponse.data.results) {
        setQuizHistory(resultsResponse.data.results);
        calculateStats(resultsResponse.data.results);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (results) => {
    if (results.length === 0) {
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
      });
      return;
    }

    const totalQuizzes = results.length;
    const totalScore = results.reduce((sum, quiz) => sum + quiz.score, 0);
    const totalCorrect = results.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
    const totalQuestions = results.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);

    setStats({
      totalQuizzes,
      averageScore: Math.round(totalScore / totalQuizzes),
      totalCorrect,
      totalQuestions,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Prepare chart data
  const chartData = {
    labels: quizHistory.slice(-7).map((_, idx) => `Q${idx + 1}`),
    datasets: [
      {
        data: quizHistory.slice(-7).map((quiz) => quiz.score),
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../belajarindo-frontend/assets/images/profil.jpg')}
            style={styles.profilePic}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            {user?.id && (
              <Text style={styles.profileId}>ID: {user.id}</Text>
            )}
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCorrect}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.headerButton} onPress={onRefresh}>
            <Text style={styles.headerButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.headerButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.headerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Performance Chart */}
        {quizHistory.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.cardTitle}>Your Performance Trend</Text>
            <Text style={styles.cardSubtitle}>Recent quiz scores</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#667eea',
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        )}

        {/* Quiz History */}
        <Card>
          <Text style={styles.cardTitle}>All Quizzes</Text>
          {quizHistory.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada riwayat quiz. Mulai kuis pertama Anda!
            </Text>
          ) : (
            quizHistory.map((quiz, index) => (
              <View key={quiz.id || index} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyType}>{quiz.quizType}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(quiz.createdAt).toLocaleDateString('id-ID')}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyScore}>{quiz.score}%</Text>
                  <Text style={styles.historyDetails}>
                    {quiz.correctAnswers}/{quiz.totalQuestions}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* Performance Insights */}
        <Card>
          <Text style={styles.cardTitle}>Performance Insights</Text>
          {stats.totalQuizzes > 0 ? (
            <View>
              <Text style={styles.insightText}>
                • Anda telah menyelesaikan {stats.totalQuizzes} quiz
              </Text>
              <Text style={styles.insightText}>
                • Skor rata-rata: {stats.averageScore}%
              </Text>
              <Text style={styles.insightText}>
                • Total jawaban benar: {stats.totalCorrect} dari{' '}
                {stats.totalQuestions}
              </Text>
              {stats.averageScore >= 80 && (
                <Text style={[styles.insightText, styles.goodPerformance]}>
                  🎉 Performa Anda sangat baik! Pertahankan!
                </Text>
              )}
              {stats.averageScore < 60 && stats.totalQuizzes >= 3 && (
                <Text style={[styles.insightText, styles.needImprovement]}>
                  💪 Terus berlatih untuk meningkatkan skor!
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Belum ada data untuk ditampilkan.
            </Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
  },
  profileId: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  chartCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c7a89',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  historyLeft: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  historyDate: {
    fontSize: 12,
    color: '#6c7a89',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 3,
  },
  historyDetails: {
    fontSize: 12,
    color: '#6c7a89',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c7a89',
    textAlign: 'center',
    paddingVertical: 20,
  },
  insightText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  goodPerformance: {
    color: '#10b981',
    fontWeight: '600',
  },
  needImprovement: {
    color: '#f59e0b',
    fontWeight: '600',
  },
});

export default ProfileScreen;
