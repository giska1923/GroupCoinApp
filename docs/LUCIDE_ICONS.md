# Lucide Icons in GroupCoin Mobile

This project uses [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) for consistent, beautiful icons throughout the application.

## Installation

Already installed in this project:
```bash
npm install lucide-react-native
```

## Usage Methods

### 1. Direct Import (Recommended for specific icons)

```tsx
import { Users, Plus, Settings } from 'lucide-react-native';

export default function MyComponent() {
  return (
    <View>
      <Users size={24} color="#0ea5e9" />
      <Plus size={20} color="#ffffff" />
      <Settings size={16} color="#64748b" />
    </View>
  );
}
```

### 2. Using the Icon Component (For dynamic icon names)

```tsx
import { Icon } from '@/src/components/ui/Icon';

export default function MyComponent() {
  return (
    <View>
      <Icon name="users" size={24} color="#0ea5e9" />
      <Icon name="plus" size={20} color="#ffffff" />
      <Icon name="settings" size={16} color="#64748b" />
    </View>
  );
}
```

## Common Icon Categories

### Navigation Icons
- `Users` - Groups/People
- `FileText` - Documents/Expenses
- `User` - Profile/Account
- `Home` - Home screen
- `ChevronRight`, `ChevronLeft`, `ChevronUp`, `ChevronDown` - Navigation arrows

### Action Icons
- `Plus` - Add/Create
- `Edit` - Edit/Modify
- `Trash2` - Delete
- `Search` - Search functionality
- `Filter` - Filter data
- `Settings` - Settings/Configuration

### Financial Icons
- `Coins` - App logo/Money
- `DollarSign` - Currency/Money
- `Calculator` - Calculations
- `Receipt` - Expenses/Bills
- `Wallet` - Balance/Payments
- `CreditCard` - Payment methods
- `TrendingUp`, `TrendingDown` - Analytics

### Status Icons
- `CheckCircle` - Success states
- `AlertCircle` - Warning states
- `XCircle` - Error states
- `Info` - Information

### User Management
- `UserPlus` - Add member
- `UserMinus` - Remove member
- `LogIn` - Sign in
- `LogOut` - Sign out

## Color Guidelines

Use these colors consistently with icons:

```tsx
// Brand color (primary actions)
color="#0ea5e9"

// Success states
color="#16a34a"

// Warning states
color="#ca8a04"

// Error states
color="#dc2626"

// Neutral/Secondary
color="#64748b"

// Muted/Disabled
color="#94a3b8"

// White (on colored backgrounds)
color="#ffffff"
```

## Size Guidelines

Standard sizes used in the app:

- **16px**: Small icons (in buttons, inline text)
- **20px**: Medium icons (menu items, secondary actions)
- **24px**: Standard icons (primary actions, navigation)
- **32px**: Large icons (headers, prominent features)
- **48px+**: Hero icons (empty states, main features)

## Examples from the App

### Tab Navigation
```tsx
// In app/(app)/_layout.tsx
import { Users, FileText, User } from 'lucide-react-native';

<Tabs.Screen
  name="groups"
  options={{
    title: 'Groups',
    tabBarIcon: ({ color, size }) => (
      <Users size={size} color={color} />
    ),
  }}
/>
```

### Button with Icon
```tsx
// In welcome screen
import { LogIn, UserPlus } from 'lucide-react-native';

<TouchableOpacity style={styles.primaryButton}>
  <LogIn size={20} color="#ffffff" />
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>
```

### Status Indicators
```tsx
// In home screen
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react-native';

<View style={styles.statusItem}>
  <CheckCircle size={24} color="#16a34a" />
  <Text>Payment completed</Text>
</View>
```

### Menu Items
```tsx
// In account screen
import { Settings, ChevronRight } from 'lucide-react-native';

<TouchableOpacity style={styles.menuItem}>
  <Settings size={20} color="#64748b" />
  <Text style={styles.menuText}>Settings</Text>
  <ChevronRight size={16} color="#64748b" />
</TouchableOpacity>
```

## Best Practices

1. **Consistency**: Use the same icon for the same concept throughout the app
2. **Size Harmony**: Stick to the standard size scale (16, 20, 24, 32, 48+)
3. **Color Meaning**: Use colors consistently (green for success, red for errors, etc.)
4. **Accessibility**: Ensure sufficient color contrast
5. **Performance**: Import only the icons you need to keep bundle size small

## Available Icons

The project includes a curated set of commonly used icons in `src/components/ui/Icon.tsx`. To add more icons:

1. Import from `lucide-react-native`
2. Add to the `iconMap` in the Icon component
3. Update the `IconName` type
4. Export from the Icon component for direct use

## Resources

- [Lucide Icon Library](https://lucide.dev/icons/) - Browse all available icons
- [React Native Documentation](https://lucide.dev/guide/packages/lucide-react-native) - Package-specific docs
- [Design System](../src/theme/tokens.ts) - Color and sizing tokens