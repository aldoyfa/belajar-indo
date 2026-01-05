import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: "🏠",
    vocabulary: "📚",
    quiz: "🎯",
    profile: "👤",
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name] || "📱"}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, 12), height: 60 + Math.max(insets.bottom, 12) }
        ],
        tabBarActiveTintColor: "#667eea",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: "Kosakata",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="vocabulary" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Kuis",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="quiz" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});
