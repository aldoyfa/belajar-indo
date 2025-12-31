import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
// FIX: Import dari root, naik 2 level
import { authService } from '../../services/api';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning'>('success');

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showModal('Error', 'Mohon isi semua field', 'error');
      return;
    }

    if (password.length < 6) {
      showModal('Error', 'Password harus minimal 6 karakter.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showModal('Error', 'Password dan konfirmasi password tidak cocok.', 'error');
      return;
    }

    setLoading(true);
    const result = await authService.register(name, email.trim(), password);
    setLoading(false);

    if (result.ok) {
      showModal('Akun Berhasil Dibuat!', `Selamat bergabung, ${name}! Silakan login untuk melanjutkan.`, 'success');
      // Navigate to login after success
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/(auth)/login');
      }, 1500);
    } else {
      showModal('Gagal Membuat Akun!', `Pembuatan akun gagal. ${result.error || 'Silakan coba lagi.'}`, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Akun</Text>
          <Text style={styles.subtitle}>Buat akun baru untuk mulai belajar</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email Anda"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ulangi password Anda"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
          </View>

          <GradientButton
            title="Daftar"
            onPress={handleRegister}
            loading={loading}
            colors={['#f093fb', '#f5576c']}
            style={styles.button}
          />

          {/* Link to Login */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkButton}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f093fb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c7a89',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    marginTop: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#6c7a89',
  },
  linkButton: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: 'bold',
  },
});