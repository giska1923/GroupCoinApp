# GroupCoin Component System

This document describes the comprehensive component system built for GroupCoin mobile app, inspired by the dark-themed Equinox Flow design.

## 🎨 Theme System

### Dark Theme Colors
Based on the screenshot, we've implemented a sophisticated dark theme:

```tsx
// Primary surfaces
surface: {
  primary: '#0f0f23',    // Main background
  secondary: '#1a1a2e',  // Card backgrounds  
  tertiary: '#16213e',   // Elevated surfaces
  border: '#252545',     // Borders and dividers
}

// Brand colors
brand: {
  500: '#6366f1', // Primary purple/blue
  // ... full scale
}

// Financial colors
positive: '#10b981', // Money owed to you (green)
negative: '#ef4444', // Money you owe (red)  
warning: '#f59e0b',  // Pending amounts
```

### Theme Provider Usage
```tsx
import { ThemeProvider, useTheme } from '@/src/theme/ThemeProvider';

// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>

// Use in components
const theme = useTheme();
```

## 🧩 Core UI Components

### Typography
Consistent text rendering with semantic variants:

```tsx
import { Typography } from '@/src/components/ui';

<Typography variant="title" color="primary" weight="semibold">
  Equinox Flow
</Typography>

<Typography variant="caption" color="secondary">
  You are owed: $1,420
</Typography>
```

**Variants:** `display`, `title`, `heading`, `subheading`, `body`, `caption`, `label`
**Colors:** `primary`, `secondary`, `muted`, `accent`, `positive`, `negative`, `warning`

### Cards
Flexible container components with multiple variants:

```tsx
import { Card } from '@/src/components/ui';

<Card variant="elevated" padding="lg">
  <Amount value={124050} variant="display" type="positive" />
</Card>
```

**Variants:** `default`, `elevated`, `outlined`, `filled`
**Padding:** `none`, `sm`, `md`, `lg`, `xl`

### Buttons
Comprehensive button system with icons and loading states:

```tsx
import { Button } from '@/src/components/ui';

<Button
  variant="primary"
  size="lg" 
  icon={<Plus size={20} color={theme.colors.text.primary} />}
  onPress={() => {}}
>
  Create Group
</Button>

// Floating Action Button
<Button
  variant="primary"
  size="fab"
  icon={<Plus size={24} color={theme.colors.text.primary} />}
/>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
**Sizes:** `sm`, `md`, `lg`, `fab`

### Amount Display
Financial amount rendering with proper formatting and colors:

```tsx
import { Amount } from '@/src/components/ui';

<Amount 
  value={124050}        // Amount in cents
  variant="display"     // Size variant
  type="positive"       // Color type
  showSign={true}       // Show +/- prefix
  currency="USD"        // Currency code
/>
```

**Variants:** `small`, `default`, `large`, `display`
**Types:** `positive`, `negative`, `neutral` (auto-detected from value)

### Avatars
User and group avatars with status rings:

```tsx
import { Avatar, GroupAvatar } from '@/src/components/ui';

// User avatar
<Avatar
  size="md"
  initials="JD"
  showStatusRing={true}
  statusRingColor="positive"
/>

// Group avatar with member count
<GroupAvatar
  name="Roommates"
  memberCount={4}
  status="active"
  onPress={() => navigate()}
/>
```

## 📐 Layout Components

### Screen
Root screen wrapper with scroll and padding options:

```tsx
import { Screen } from '@/src/components/layout';

<Screen variant="scroll" padding="lg">
  {/* Your content */}
</Screen>
```

**Variants:** `scroll`, `fixed`
**Padding:** `none`, `sm`, `md`, `lg`

### Section
Organized content sections with headers and actions:

```tsx
import { Section } from '@/src/components/layout';

<Section
  title="Popular Groups"
  showSeeAll={true}
  onSeeAllPress={() => {}}
>
  {/* Section content */}
</Section>
```

### Row & Column
Flexible layout primitives:

```tsx
import { Row, Column } from '@/src/components/layout';

<Row justify="space-between" align="center" gap="md">
  <Typography>Label</Typography>
  <Amount value={5000} />
</Row>

<Column gap="lg" align="center">
  <Icon />
  <Typography>Title</Typography>
</Column>
```

## 🎯 Home Screen Recreation

The home screen from the screenshot has been recreated using our component system:

### Features Implemented:
- **Header:** "Equinox Flow" title with notification bell
- **Net Flow Card:** Prominent balance display with subtitle
- **Popular Groups:** Horizontal scrolling group avatars with status rings
- **Recent Activity:** Transaction list with user avatars and amounts
- **Floating Action Button:** Primary purple FAB with plus icon
- **Dark Theme:** Complete dark mode matching the screenshot

### Key Components Used:
```tsx
// Net Flow Display
<Card variant="elevated" padding="lg">
  <Amount value={netFlow} variant="display" type="positive" />
</Card>

// Group Avatars
<GroupAvatar
  name="Roommates"
  memberCount={4}
  status="active"
  onPress={() => navigate()}
/>

// Activity Items
<Card variant="default" padding="md">
  <Row justify="space-between">
    <Row gap="md">
      <Avatar size="sm" initials="A" />
      <Column gap="xs">
        <Typography variant="body">Dinner at Nobu</Typography>
        <Typography variant="caption" color="secondary">
          Added by Alex
        </Typography>
      </Column>
    </Row>
    <Amount value={5100} type="positive" />
  </Row>
</Card>
```

## 📁 File Structure

```
src/
├── theme/
│   ├── ThemeProvider.tsx     # Theme context and hook
│   └── tokens.ts            # Design tokens and constants
├── components/
│   ├── ui/                  # Core UI components
│   │   ├── Typography.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Avatar.tsx
│   │   ├── Amount.tsx
│   │   ├── GroupAvatar.tsx
│   │   ├── Icon.tsx
│   │   └── index.ts
│   └── layout/              # Layout components
│       ├── Screen.tsx
│       ├── Section.tsx
│       ├── Row.tsx
│       └── index.ts
```

## 🚀 Usage Guidelines

### Best Practices
1. **Consistent Theme Usage:** Always use theme tokens instead of hardcoded values
2. **Component Composition:** Combine simple components to build complex UIs
3. **Semantic Variants:** Use semantic typography and color variants for meaning
4. **Responsive Sizing:** Use the spacing and sizing scales consistently
5. **Accessibility:** Components include proper accessibility props

### Example Implementation
```tsx
import React from 'react';
import { useTheme } from '@/src/theme/ThemeProvider';
import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { Row, Column } from '@/src/components/layout/Row';
import { 
  Typography, 
  Card, 
  Button, 
  Amount, 
  Avatar 
} from '@/src/components/ui';

export default function MyScreen() {
  const theme = useTheme();

  return (
    <Screen variant="scroll" padding="lg">
      <Section title="Balance Overview">
        <Card variant="elevated" padding="lg">
          <Column align="center" gap="sm">
            <Typography variant="caption" color="secondary">
              Net Flow
            </Typography>
            <Amount value={124050} variant="display" type="positive" />
          </Column>
        </Card>
      </Section>

      <Section title="Recent Activity">
        <Column gap="sm">
          {activities.map(activity => (
            <Card key={activity.id} variant="default" padding="md">
              <Row justify="space-between" align="center">
                <Row gap="md">
                  <Avatar size="sm" initials={activity.user} />
                  <Typography variant="body">
                    {activity.description}
                  </Typography>
                </Row>
                <Amount value={activity.amount} />
              </Row>
            </Card>
          ))}
        </Column>
      </Section>
    </Screen>
  );
}
```

This component system provides a solid foundation for building consistent, beautiful, and maintainable UI components throughout the GroupCoin mobile app.