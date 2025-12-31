import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/api';
import CustomModal from '../components/CustomModal';
import GradientButton from '../components/GradientButton';

const LoginScreen = ({ navigation }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModal = (title, message, type = 'success') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Error', 'Please fill all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showModal('Login Gagal!', 'Password harus minimal 6 karakter.', 'error');
      return;
    }

    setLoading(true);
    const result = await authService.login(email.trim(), password);
    setLoading(false);

    if (result.ok) {
      showModal('Login Berhasil!', `Selamat datang kembali, ${result.data.user.name}!`, 'success');
      // Navigate to Home after modal is closed
      setTimeout(() => {
        setModalVisible(false);
        navigation.replace('MainTabs');
      }, 1500);
    } else {
      showModal('Login Gagal!', 'Email atau password salah. Silakan daftar akun terlebih dahulu.', 'error');
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showModal('Error', 'Please fill all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showModal('Error', 'Password harus minimal 6 karakter.', 'error');
      return;
    }

    setLoading(true);
    const result = await authService.register(name, email.trim(), password);
    setLoading(false);

    if (result.ok) {
      showModal('Account Created!', `Selamat bergabung, ${name}! Akun berhasil dibuat.`, 'success');
      // Switch to Sign In after success
      setTimeout(() => {
        setModalVisible(false);
        setIsSignIn(true);
        setName('');
        setPassword('');
      }, 1500);
    } else {
      showModal('Cannot Create Account!', `Pembuatan akun gagal! ${result.error}`, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../../belajarindo-frontend/assets/icon/bi.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>BelajarIndo</Text>
          <Text style={styles.subtitle}>Learn Indonesian language easily</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isSignIn && styles.activeTab]}
            onPress={() => setIsSignIn(true)}
          >
            <Text style={[styles.tabText, isSignIn && styles.activeTabText]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isSignIn && styles.activeTab]}
            onPress={() => setIsSignIn(false)}
          >
            <Text style={[styles.tabText, !isSignIn && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {!isSignIn && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <GradientButton
            title={isSignIn ? 'Sign In' : 'Sign Up'}
            onPress={isSignIn ? handleLogin : handleRegister}
            loading={loading}
            style={styles.button}
          />
        </View>

        {/* Image slider placeholder */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../belajarindo-frontend/assets/images/Login.png')}
            style={styles.image}
            resizeMode="contain"
          />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c7a89',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: '#6c7a89',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: 'bold',
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
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default LoginScreen;
