/**
 * LabModule Component
 * Komponen untuk menampilkan sebuah modul lab
 * Siap untuk implementasi di masa depan
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Color';

export interface LabModuleProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress?: number; // 0-100
  icon?: string;
  image?: string;
  duration?: number; // minutes
  onPress?: () => void;
  style?: ViewStyle;
}

export function LabModule({
  id,
  title,
  description,
  category,
  difficulty,
  progress = 0,
  icon = 'flask',
  image,
  duration,
  onPress,
  style,
}: LabModuleProps): JSX.Element {
  const difficultyColor = {
    easy: Colors.success,
    medium: Colors.warning,
    hard: Colors.error,
  }[difficulty];

  const difficultyLabel = {
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Sulit',
  }[difficulty];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image atau Icon Section */}
      <View style={styles.imageSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={48} color={Colors.primary} />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.category}>{category}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>{difficultyLabel}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Progress Bar */}
        {progress > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          {duration && (
            <View style={styles.footerItem}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.footerText}>{duration} menit</Text>
            </View>
          )}
          {progress === 100 && (
            <View style={styles.footerItem}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={[styles.footerText, { color: Colors.success }]}>Selesai</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  imageSection: {
    width: 100,
    height: 120,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
  },

  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  } as TextStyle,

  category: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },

  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },

  progressSection: {
    marginBottom: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },

  progressText: {
    fontSize: 11,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default LabModule;
