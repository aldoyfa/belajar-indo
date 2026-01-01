import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Welcome to Indonesian Virtual Lab
          </Text>
          <Text style={styles.heroSubtitle}>
            Your comprehensive virtual laboratory for mastering Indonesian language through interactive experiments and simulations.
          </Text>
          <TouchableOpacity 
            style={styles.heroButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff8c8c', '#ffb6b9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.heroButtonGradient}
            >
              <Text style={styles.heroButtonText}>About Us</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Belajar Indo is here as a comprehensive solution for students, university learners, and the international community who want to master the Indonesian language. With an intuitive interface, interactive features, and well-structured learning materials, we aim to make your Indonesian learning journey enjoyable and accessible anytime, anywhere.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Virtual Lab Modules</Text>
          <Text style={styles.featuresSubtitle}>
            Interactive laboratory for Indonesian language experimentation and analysis
          </Text>

          {/* Vocabulary Feature */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/vocabulary')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.featureCard}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureIcon}>📚</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Vocabulary</Text>
                  <Text style={styles.featureDescription}>
                    Master thousands of Indonesian words with ease! Our interactive Vocabulary section features audio pronunciation, visual flashcards, and engaging exercises to make learning effective and enjoyable.
                  </Text>
                </View>
              </View>
              <View style={styles.featureButtons}>
                <View style={styles.tryButton}>
                  <Text style={styles.tryButtonText}>Try Now</Text>
                </View>
                <View style={styles.learnButton}>
                  <Text style={styles.learnButtonText}>Learn More</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Quiz Feature */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/quiz')}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.featureCard}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureIcon}>📝</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Interactive Quiz</Text>
                  <Text style={styles.featureDescription}>
                    Test and improve your Indonesian language skills with our fun, interactive quizzes! Challenge yourself with various difficulty levels and track your progress.
                  </Text>
                </View>
              </View>
              <View style={styles.featureButtons}>
                <View style={styles.tryButton}>
                  <Text style={styles.tryButtonText}>Try Now</Text>
                </View>
                <View style={styles.historyButton}>
                  <Text style={styles.historyButtonText}>View History</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <View style={styles.footerLogo}>
                <View style={styles.footerLogoCircle}>
                  <Text style={styles.footerLogoText}>BI</Text>
                </View>
                <Text style={styles.footerLogoTitle}>Learn Indonesian</Text>
              </View>
              <Text style={styles.footerDescription}>
                Your comprehensive platform for mastering Indonesian language. Interactive lessons, vocabulary building, and cultural insights.
              </Text>
            </View>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLinksTitle}>Navigation</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/')}>
                <Text style={styles.footerLink}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/vocabulary')}>
                <Text style={styles.footerLink}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.footerLink}>About Us</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContact}>
              <Text style={styles.footerContactTitle}>Contact Us</Text>
              <Text style={styles.footerContactText}>
                📧 support@learnindonesian.com
              </Text>
              <Text style={styles.footerContactText}>
                📱 +62 (021) 1962 2391 118
              </Text>
              <Text style={styles.footerContactText}>
                📍 Jakarta, Indonesia
              </Text>
            </View>
          </View>

          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>
              © Copyright by Belajar Indo 2025, All Rights Reserved
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },

  // Hero Section
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 34 : 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: Platform.OS === 'web' ? 42 : 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 600,
  },
  heroButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // About Section
  aboutSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 26,
    textAlign: 'center',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuresSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  featureContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  featureButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  tryButton: {
    backgroundColor: '#FA8072',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  tryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  learnButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  learnButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Footer
  footer: {
    backgroundColor: '#dc2626',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  footerContent: {
    ...Platform.select({
      web: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      },
      default: {},
    }),
  },
  footerSection: {
    marginBottom: 30,
    ...Platform.select({
      web: { flex: 1, marginRight: 20 },
      default: {},
    }),
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerLogoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footerLogoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footerDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
  },
  footerLinks: {
    marginBottom: 30,
    ...Platform.select({
      web: { flex: 1, marginRight: 20 },
      default: {},
    }),
  },
  footerLinksTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  footerContact: {
    marginBottom: 30,
    ...Platform.select({
      web: { flex: 1 },
      default: {},
    }),
  },
  footerContactTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  footerContactText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  copyright: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 20,
    alignItems: 'center',
  },
  copyrightText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
});
