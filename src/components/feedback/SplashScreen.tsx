import React from 'react';
import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../ui';
import { Spinner } from './Spinner';

// The native splash (app.json) uses a #000000 background with nobg.png; this
// JS splash keeps the same black so the hand-off while auth initializes is
// seamless, then adds the branded footer the native splash can't render.
const SPLASH_BG = '#000000';

const logo = require('../../../assets/nobg.png');

/**
 * Loading screen shown while the app initializes. Displays the logo centered
 * with a spinner, plus a black, shadowed footer badge (icon + wordmark) pinned
 * to the bottom of the screen.
 */
export const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: SPLASH_BG }}>
      {/* Centered logo + loading indicator */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={logo}
          style={{ width: 140, height: 140 }}
          resizeMode='contain'
        />
        <View style={{ marginTop: theme.spacing.xl }}>
          <Spinner />
        </View>
      </View>

      {/* Branded footer badge — black background with shadow */}
      <View
        style={{
          alignItems: 'center',
          paddingBottom: insets.bottom + theme.spacing.xl,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            backgroundColor: SPLASH_BG,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radius.full,
            ...theme.shadow.lg,
          }}
        >
          <Image
            source={logo}
            style={{ width: 28, height: 28 }}
            resizeMode='contain'
          />
          <Typography
            variant='subheading'
            color='accent'
            weight='bold'
            style={{ fontFamily: 'Outfit_700Bold' }}
          >
            groupcoin
          </Typography>
        </View>
      </View>
    </View>
  );
};
