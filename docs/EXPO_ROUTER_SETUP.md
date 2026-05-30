# Expo Router Setup

This document explains how the GroupCoin mobile app is structured using Expo Router for navigation.

## 🗂️ File-Based Routing Structure

```
app/
├── _layout.tsx              # Root layout with ThemeProvider
├── index.tsx               # Entry point with auth routing logic
├── (auth)/                 # Unauthenticated routes
│   ├── _layout.tsx         # Auth stack layout
│   ├── welcome.tsx         # Welcome/landing screen
│   ├── login.tsx           # Login form
│   └── register.tsx        # Registration form
├── (app)/                  # Authenticated routes
│   ├── _layout.tsx         # Tab navigator with auth guard
│   ├── groups/
│   │   ├── index.tsx       # Main dashboard (home screen)
│   │   ├── new.tsx         # Create group modal
│   │   └── [id]/           # Dynamic group routes
│   │       ├── _layout.tsx # Group detail layout
│   │       ├── index.tsx   # Group expenses
│   │       ├── balances.tsx
│   │       ├── activity.tsx
│   │       ├── settings.tsx
│   │       └── members/
│   ├── expenses/
│   │   └── [id].tsx        # Individual expense detail
│   └── account/
│       ├── index.tsx       # Account settings
│       └── edit.tsx        # Edit profile
└── +not-found.tsx          # 404 screen
```

## 🚀 Entry Points

### index.ts
The main entry point that initializes Expo Router:
```ts
import 'expo-router/entry';
```

### app/_layout.tsx
Root layout providing theme context and basic navigation setup:
```tsx
export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
```

### app/index.tsx
Root screen that handles authentication routing:
```tsx
export default function IndexScreen() {
  const { token, status, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (status === 'loading') {
    return null; // Could show splash screen
  }

  if (token && status === 'authenticated') {
    return <Redirect href="/(app)/groups" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
```

## 🔐 Authentication Flow

1. **App Launch**: `app/index.tsx` initializes auth store
2. **Check Token**: Reads stored token from SecureStore
3. **Route Decision**: 
   - If authenticated → `/(app)/groups` (main dashboard)
   - If not authenticated → `/(auth)/welcome`

### Auth Guard
The `(app)/_layout.tsx` includes an auth guard:
```tsx
export default function AppLayout() {
  const token = useAuthStore(state => state.token);
  
  if (!token) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Tabs>...</Tabs>;
}
```

## 📱 Navigation Structure

### Unauthenticated Stack `(auth)`
- Stack navigation for login flow
- No tabs, linear progression
- Screens: welcome → login/register

### Authenticated Tabs `(app)`
- Tab navigator with 3 main sections:
  - **Groups**: Main dashboard with net flow and activity
  - **Expenses**: Cross-group expense overview  
  - **Account**: Profile and settings

### Deep Linking
URLs map directly to file structure:
- `groupcoin://groups/123` → `app/(app)/groups/[id]/index.tsx`
- `groupcoin://expenses/456` → `app/(app)/expenses/[id].tsx`
- `groupcoin://auth/login` → `app/(auth)/login.tsx`

## 🎨 Component Integration

### Using New Component System
All screens now use the new component system:

```tsx
import { Screen } from '@/src/components/layout/Screen';
import { Typography, Card, Button } from '@/src/components/ui';

export default function MyScreen() {
  return (
    <Screen variant="scroll" padding="lg">
      <Card variant="elevated" padding="lg">
        <Typography variant="title">Title</Typography>
        <Button variant="primary">Action</Button>
      </Card>
    </Screen>
  );
}
```

### Theme Access
Every screen has access to the dark theme:
```tsx
import { useTheme } from '@/src/theme/ThemeProvider';

export default function MyScreen() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface.primary }}>
      {/* Content */}
    </View>
  );
}
```

## 🛠️ Configuration

### app.json
Basic Expo configuration with router setup:
```json
{
  "expo": {
    "scheme": "groupcoin",
    "plugins": ["expo-router", "expo-secure-store"],
    "experiments": {
      "typedRoutes": false
    }
  }
}
```

### app.config.ts
Dynamic configuration for different environments:
```ts
export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || 'dev';
  
  return {
    ...config,
    name: 'GroupCoin',
    plugins: ['expo-router', 'expo-secure-store'],
    extra: {
      apiUrl: getApiUrl(appEnv),
      appEnv,
    },
  };
};
```

## 🏃‍♂️ Running the App

1. **Start Development Server**:
   ```bash
   npm start
   ```

2. **Platform-Specific**:
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

3. **Environment Variables**:
   ```bash
   APP_ENV=staging npm start  # Staging environment
   APP_ENV=prod npm start     # Production environment
   ```

## 🚨 Key Differences from Old Setup

### Before (React Navigation + App.tsx)
- Manual navigation setup
- Separate App.tsx component
- Imperative navigation
- Complex routing configuration

### After (Expo Router)
- File-based routing
- No separate App.tsx needed
- Declarative navigation via file structure
- Built-in deep linking
- Type-safe routing (when enabled)

### Migration Benefits
- ✅ Cleaner file organization
- ✅ Automatic deep linking
- ✅ Better developer experience
- ✅ Built-in navigation optimizations
- ✅ Easier to understand routing logic

The app now uses a modern, scalable routing structure that makes navigation intuitive and maintainable!