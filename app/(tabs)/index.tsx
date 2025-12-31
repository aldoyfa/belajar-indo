import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ FIXED: Import dari root menggunakan ../../
import { Card } from '../../components/Card.';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Selamat Datang!</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <Text style={styles.heroTitle}>Indonesian Virtual Lab</Text>
          <Text style={styles.heroSubtitle}>
            Pelajari bahasa Indonesia dengan mudah dan menyenangkan
          </Text>
        </Card>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/vocabulary')}
            activeOpacity={0.7}
          >
            <Card gradient colors={['#667eea', '#764ba2']} style={styles.featureCard}>
              <View style={styles.featureCardContent}>
                <Text style={styles.featureIcon}>📚</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Vocabulary</Text>
                  <Text style={styles.featureDescription}>
                    Pelajari kosakata bahasa Indonesia dengan flashcard interaktif
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/quiz')}
            activeOpacity={0.7}
          >
            <Card gradient colors={['#f093fb', '#f5576c']} style={styles.featureCard}>
              <View style={styles.featureCardContent}>
                <Text style={styles.featureIcon}>📝</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Quiz</Text>
                  <Text style={styles.featureDescription}>
                    Uji pemahaman Anda dengan berbagai kuis menarik
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.7}
          >
            <Card gradient colors={['#4facfe', '#00f2fe']} style={styles.featureCard}>
              <View style={styles.featureCardContent}>
                <Text style={styles.featureIcon}>📊</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Progress</Text>
                  <Text style={styles.featureDescription}>
                    Lihat statistik dan riwayat pembelajaran Anda
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Card style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              BelajarIndo adalah platform pembelajaran bahasa Indonesia yang 
              dirancang untuk membantu Anda menguasai bahasa dengan cara yang 
              interaktif dan menyenangkan.
            </Text>
          </Card>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={['#ff8c8c', '#ffb6b9']}
            style={styles.logoutGradient}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  heroCard: {
    marginBottom: 30,
    padding: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6c7a89',
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  aboutCard: {
    padding: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#6c7a89',
    lineHeight: 24,
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});