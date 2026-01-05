import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_context/AuthContext";

type TabType = "login" | "signup";
type ModalType = "success" | "error" | "warning";

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  type: ModalType;
}

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Modal state (matching web app)
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const showModal = (title: string, message: string, type: ModalType = "success") => {
    setModal({ visible: true, title, message, type });
  };

  const closeModal = () => {
    const { title } = modal;
    setModal({ ...modal, visible: false });

    if (title === "Login Berhasil!") {
      router.replace("/(tabs)");
    } else if (title === "Account Created!") {
      setActiveTab("login");
      setLoginEmail(signupEmail);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      showModal("Login Gagal!", "Silakan isi semua kolom.", "error");
      return;
    }

    if (!validateEmail(loginEmail)) {
      showModal("Login Gagal!", "Masukkan alamat email yang valid.", "error");
      return;
    }

    if (loginPassword.length < 6) {
      showModal("Login Gagal!", "Password harus minimal 6 karakter.", "error");
      return;
    }

    setIsLoading(true);
    const result = await login(loginEmail.trim(), loginPassword);
    setIsLoading(false);

    if (result.success) {
      showModal("Login Berhasil!", `Selamat datang kembali!`, "success");
    } else {
      showModal(
        "Login Gagal!",
        "Email atau password salah. Silakan daftar akun terlebih dahulu.",
        "error"
      );
    }
  };

  const handleSignup = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      showModal("Pendaftaran Gagal!", "Silakan isi semua kolom.", "error");
      return;
    }

    if (!validateEmail(signupEmail)) {
      showModal("Pendaftaran Gagal!", "Masukkan alamat email yang valid.", "error");
      return;
    }

    if (signupPassword.length < 6) {
      showModal("Pendaftaran Gagal!", "Password harus minimal 6 karakter.", "error");
      return;
    }

    setIsLoading(true);
    const result = await register(signupName.trim(), signupEmail.trim(), signupPassword);
    setIsLoading(false);

    if (result.success) {
      showModal(
        "Account Created!",
        "Akun berhasil dibuat! Silakan masuk dengan akun baru Anda.",
        "success"
      );
    } else {
      showModal(
        "Pendaftaran Gagal!",
        result.error || "Tidak dapat membuat akun. Silakan coba lagi.",
        "error"
      );
    }
  };

  const getModalIcon = () => {
    switch (modal.type) {
      case "error":
        return { icon: "✗", colors: ["#f44336", "#e57373"] };
      case "warning":
        return { icon: "!", colors: ["#ff9800", "#ffb74d"] };
      default:
        return { icon: "✓", colors: ["#4CAF50", "#66BB6A"] };
    }
  };

  const modalStyle = getModalIcon();

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Title - matching web app */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/icon/Belajar.png")}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
            <Text style={styles.title}>BelajarIndo</Text>
            <Text style={styles.subtitle}>Belajar Bahasa Indonesia dengan Mudah</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Tab Buttons */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "login" && styles.activeTab]}
                onPress={() => setActiveTab("login")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "login" && styles.activeTabText,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "signup" && styles.activeTab]}
                onPress={() => setActiveTab("signup")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "signup" && styles.activeTabText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Form */}
            {activeTab === "login" && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan email Anda"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan password Anda"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan nama Anda"
                    placeholderTextColor="#999"
                    value={signupName}
                    onChangeText={setSignupName}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan email Anda"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Buat password (min. 6 karakter)"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Modal - matching web app style */}
      <Modal
        visible={modal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={modalStyle.colors as [string, string]}
              style={styles.modalIcon}
            >
              <Text style={styles.modalIconText}>{modalStyle.icon}</Text>
            </LinearGradient>
            <Text style={styles.modalTitle}>{modal.title}</Text>
            <Text style={styles.modalMessage}>{modal.message}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Lanjutkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: "#667eea",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    color: "#333",
  },
  button: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  modalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalIconText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#667eea",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
