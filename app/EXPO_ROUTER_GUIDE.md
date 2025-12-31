# 📱 Expo Router Guide - BelajarIndo Mobile

## 🎯 Apa itu Expo Router?

Expo Router adalah sistem routing file-based untuk React Native yang menggunakan struktur folder untuk mendefinisikan routes. Mirip dengan Next.js untuk web.

## 🏗️ Struktur Aplikasi

### File-Based Routing
```
app/
├── _layout.tsx              # Root layout (Stack Navigator)
├── index.tsx                # Splash screen / Auth check
├── login.tsx                # Login & Register screen
│
├── (tabs)/                  # Tab navigator group (parentheses = layout group)
│   ├── _layout.tsx          # Bottom tabs configuration
│   ├── index.tsx            # Home tab (/)
│   ├── vocabulary.tsx       # Vocabulary tab (/vocabulary)
│   ├── quiz.tsx             # Quiz tab (/quiz)
│   └── profile.tsx          # Profile tab (/profile)
│
├── components/              # Shared components
│   ├── Card.js
│   ├── CustomModal.js
│   ├── GradientButton.js
│   └── LoadingSpinner.js
│
└── services/                # API services
    └── api.js
```

## 🔄 Navigation Flow

```
index.tsx (Splash)
    ↓
Check Auth
    ↓
├─→ login.tsx (if not authenticated)
│       ↓
│   User Login
│       ↓
└─→ (tabs)/ (if authenticated)
        ├─→ index.tsx (Home)
        ├─→ vocabulary.tsx
        ├─→ quiz.tsx
        └─→ profile.tsx
```

## 📂 Layout Groups dengan (parentheses)

### Mengapa `(tabs)/`?

Folder dengan **parentheses `()`** adalah **layout group** yang:
- ✅ Tidak membuat URL segment
- ✅ Mengelompokkan routes dengan layout yang sama
- ✅ Perfect untuk bottom tabs
- ✅ Mobile-friendly navigation

**Tanpa parentheses:**
```
app/tabs/index.tsx  →  URL: /tabs/
```

**Dengan parentheses:**
```
app/(tabs)/index.tsx  →  URL: /
```

## 🎯 Keunggulan untuk Poin Bonus

### 1. ✅ File-Based Routing (Modern)
```typescript
// Tidak perlu mendefinisikan routes manual
// Struktur folder = routing otomatis
app/
  (tabs)/
    index.tsx     // Otomatis jadi route "/"
    quiz.tsx      // Otomatis jadi route "/quiz"
```

### 2. ✅ Bottom Tabs Native
```typescript
// app/(tabs)/_layout.tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#667eea',
    tabBarStyle: { height: 60 },
  }}
>
  <Tabs.Screen name="index" />
  <Tabs.Screen name="vocabulary" />
  <Tabs.Screen name="quiz" />
  <Tabs.Screen name="profile" />
</Tabs>
```

### 3. ✅ TypeScript Support
```typescript
// Type-safe navigation
router.push('/(tabs)/profile');  // ✅ Autocomplete
router.push('/invalid');         // ❌ Type error
```

### 4. ✅ Deep Linking Built-in
```bash
# Buka app langsung ke quiz
belajarindo://quiz

# Atau dengan parameters
belajarindo://quiz?id=123
```

### 5. ✅ Mobile-Optimized
- Native transitions
- Hardware back button support (Android)
- Gesture navigation support (iOS)
- Tab bar di bottom (native feel)

## 🚀 Navigation API

### Menggunakan `router` dari `expo-router`

```typescript
import { router } from 'expo-router';

// Navigate to route
router.push('/(tabs)/profile');

// Replace current route
router.replace('/login');

// Go back
router.back();

// Navigate with params
router.push({
  pathname: '/quiz',
  params: { id: '123' }
});
```

### Menggunakan `Link` Component

```typescript
import { Link } from 'expo-router';

<Link href="/(tabs)/vocabulary">
  Go to Vocabulary
</Link>
```

## 📱 Layout Configuration

### Root Layout (`_layout.tsx`)
```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

### Tabs Layout (`(tabs)/_layout.tsx`)
```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/* ... tabs lainnya */}
    </Tabs>
  );
}
```

## 🔐 Authentication Flow

### Auth Check di `index.tsx`
```typescript
export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    
    if (token) {
      router.replace('/(tabs)');  // Authenticated
    } else {
      router.replace('/login');   // Not authenticated
    }
  };
  
  return <LoadingSpinner />;
}
```

### Login Success → Navigate to Tabs
```typescript
// login.tsx
const handleLogin = async () => {
  const result = await authService.login(email, password);
  
  if (result.ok) {
    router.replace('/(tabs)');  // Go to home tabs
  }
};
```

### Logout → Navigate to Login
```typescript
// profile.tsx
const handleLogout = async () => {
  await authService.logout();
  router.replace('/login');
};
```

## 🎨 Tab Icons dengan Ionicons

```typescript
import { Ionicons } from '@expo/vector-icons';

<Tabs.Screen
  name="vocabulary"
  options={{
    title: 'Vocabulary',
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons 
        name={focused ? 'book' : 'book-outline'} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
```

### Icon Options
- Home: `home` / `home-outline`
- Vocabulary: `book` / `book-outline`
- Quiz: `clipboard` / `clipboard-outline`
- Profile: `person` / `person-outline`

## 📊 Comparison: React Navigation vs Expo Router

| Feature | React Navigation | Expo Router |
|---------|-----------------|-------------|
| Setup | Manual config | File-based (auto) |
| Routing | Code-based | File-based |
| TypeScript | Manual types | Auto-generated |
| Deep Linking | Manual setup | Built-in |
| Bottom Tabs | Manual config | `(tabs)/` folder |
| URL Support | Limited | Full support |
| Modern | ❌ | ✅ |

## 🏆 Poin Bonus yang Didapat

### ✅ 1. File-Based Routing
Struktur folder langsung jadi routing - modern dan maintainable

### ✅ 2. Bottom Tabs di `(tabs)/`
Native tab navigation dengan layout groups

### ✅ 3. TypeScript Support
Type-safe navigation dengan autocomplete

### ✅ 4. Mobile-Optimized
- Native transitions
- Gesture support
- Hardware back button
- Tab bar positioning

### ✅ 5. Deep Linking Ready
URL-based navigation untuk sharing dan notifications

## 📝 Best Practices

### 1. Gunakan Layout Groups
```typescript
// ✅ Good
app/(tabs)/index.tsx

// ❌ Avoid
app/tabs/index.tsx
```

### 2. Type-Safe Navigation
```typescript
// ✅ Good
router.push('/(tabs)/profile');

// ❌ Avoid
router.push('/profile');  // May break
```

### 3. Use `replace` untuk Auth
```typescript
// ✅ Good - tidak bisa back ke login setelah login
router.replace('/(tabs)');

// ❌ Avoid - user bisa back ke login
router.push('/(tabs)');
```

### 4. Consistent Naming
```typescript
// File names harus lowercase dan match route
vocabulary.tsx  →  /(tabs)/vocabulary
quiz.tsx        →  /(tabs)/quiz
profile.tsx     →  /(tabs)/profile
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'expo-router'"
```bash
npm install expo-router
```

### Error: "Invariant Violation: No routes found"
Pastikan struktur folder benar dan file punya default export

### Tab bar tidak muncul
Cek `(tabs)/_layout.tsx` sudah export Tabs component

### Navigation tidak kerja
```typescript
// Pastikan import dari expo-router
import { router } from 'expo-router';  // ✅

// Bukan dari @react-navigation
import { useNavigation } from '@react-navigation/native';  // ❌
```

## 🎯 Kesimpulan

Expo Router memberikan:
- ✅ Modern file-based routing
- ✅ Bottom tabs native dengan `(tabs)/`
- ✅ TypeScript support
- ✅ Deep linking built-in
- ✅ Mobile-optimized navigation
- ✅ **Perfect untuk poin bonus mobile-friendly!**

## 📚 Resources

- [Expo Router Docs](https://expo.github.io/router/docs/)
- [File-Based Routing](https://expo.github.io/router/docs/features/routing/)
- [Tabs Layout](https://expo.github.io/router/docs/features/tabs/)
- [TypeScript Guide](https://expo.github.io/router/docs/guides/typescript/)
