/**
 * Virtual Lab Screen
 * Fitur untuk interactive learning melalui virtual experiments
 * Status: Planning stage - ready untuk implementasi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import LabModule from '../../components/LabModule';
import LoadingSpinner from '../../components/LoadingSpinner';
import { labService } from '../../services/lab';
import { Colors } from '../../constants/Color';

interface LabModuleData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress?: number;
  duration?: number;
}

interface SectionData {
  title: string;
  data: LabModuleData[];
}

export default function LabScreen() {
  const [modules, setModules] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadLabData();
  }, []);

  const loadLabData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load modules dari API
      const modulesResult = await labService.getModules();
      if (modulesResult.ok && modulesResult.data) {
        // Group modules by category
        const grouped = groupByCategory(modulesResult.data);
        setModules(grouped);
      }

      // Load statistics
      const statsResult = await labService.getStats();
      if (statsResult.ok) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading lab data:', error);
      setError('Gagal memuat data virtual lab');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLabData();
    setRefreshing(false);
  };

  const groupByCategory = (
    modulesData: LabModuleData[]
  ): SectionData[] => {
    const grouped: { [key: string]: LabModuleData[] } = {};

    modulesData.forEach((module) => {
      if (!grouped[module.category]) {
        grouped[module.category] = [];
      }
      grouped[module.category].push(module);
    });

    return Object.entries(grouped)
      .map(([category, items]) => ({
        title: category,
        data: items,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const handleModulePress = (moduleId: string) => {
    // Navigate ke detail lab module (akan diimplementasikan di masa depan)
    console.log('Opening lab module:', moduleId);
    // router.push(`/(tabs)/lab/${moduleId}`);
  };

  if (loading && !modules.length) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Ionicons name="flask" size={32} color={Colors.white} />
            <View style={styles.titleText}>
              <Text style={styles.title}>Virtual Lab</Text>
              <Text style={styles.subtitle}>Interactive Learning</Text>
            </View>
          </View>
          {stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {stats.totalModules || 0}
                </Text>
                <Text style={styles.statLabel}>Modul</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {stats.completedModules || 0}
                </Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLabData}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : modules.length > 0 ? (
        <SectionList
          sections={modules}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <LabModule
              {...item}
              onPress={() => handleModulePress(item.id)}
              style={styles.moduleCard}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>Belum Ada Modul</Text>
          <Text style={styles.emptyMessage}>
            Modul virtual lab akan segera tersedia
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  headerContent: {
    gap: 16,
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  titleText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },

  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },

  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },

  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  moduleCard: {
    marginBottom: 12,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 12,
  },

  errorMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },

  retryText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
  },

  emptyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
