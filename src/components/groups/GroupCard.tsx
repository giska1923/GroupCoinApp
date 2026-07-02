import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { ArrowRight, Users } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../ui';
import type { GroupDTO } from '../../types/api';

interface GroupCardProps {
  group: GroupDTO;
  onPress: () => void;
}

const AVATAR_SIZE = 64;

/**
 * Group name rendered as gradient-masked uppercase text (SVG text with a
 * gradient fill — same lavender family as the "groupcoin" header title).
 */
const GradientName: React.FC<{ name: string }> = ({ name }) => {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const label = name.toUpperCase();
  // Outfit Bold uppercase averages ~0.64 * fontSize per character; scale the
  // font down so long names still fit on one line.
  const maxFontSize = theme.fontSize['3xl'];
  const fitted = width > 0 ? width / (0.64 * label.length) : maxFontSize;
  const fontSize = Math.max(theme.fontSize.md, Math.min(maxFontSize, fitted));
  const height = Math.ceil(fontSize * 1.2);

  return (
    <View
      style={{ alignSelf: 'stretch' }}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id='groupNameGradient' x1='0' y1='0' x2='0' y2='1'>
              <Stop offset='0' stopColor={theme.colors.brand[200]} />
              <Stop offset='0.55' stopColor={theme.colors.text.accent} />
              <Stop offset='1' stopColor={theme.colors.brand[500]} />
            </LinearGradient>
          </Defs>
          <SvgText
            fill='url(#groupNameGradient)'
            x={0}
            y={fontSize}
            fontSize={fontSize}
            fontFamily='Outfit_700Bold'
            letterSpacing='1'
          >
            {label}
          </SvgText>
        </Svg>
      )}
    </View>
  );
};

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = !!group.imageUrl && !imageFailed;
  const memberCount = group.memberCount;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        borderRadius: theme.components.card.radius,
        // Opaque fill (matches the old group buttons) so the elevation shadow
        // can't bleed through as a dark inner rectangle.
        backgroundColor: 'rgb(20, 20, 26)',
        borderWidth: 1,
        borderColor: 'rgba(138, 137, 255, 0.28)',
        shadowColor: theme.colors.brand[400],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View
        style={{
          borderRadius: theme.components.card.radius,
          overflow: 'hidden',
        }}
      >
        {/* Decorative concentric arcs sweeping in from the right edge. */}
        <Svg
          pointerEvents='none'
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0 }}
          width={160}
          height='100%'
        >
          {[46, 72, 98, 124].map(r => (
            <Circle
              key={r}
              cx={170}
              cy={60}
              r={r}
              stroke={theme.colors.brand[400]}
              strokeOpacity={0.14}
              strokeWidth={1.5}
              fill='none'
            />
          ))}
        </Svg>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.lg,
            padding: theme.spacing.lg,
            minHeight: 112,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              backgroundColor: theme.colors.surface.tertiary,
              borderWidth: 1,
              borderColor: 'rgba(138, 137, 255, 0.25)',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {showImage ? (
              <Image
                source={{ uri: group.imageUrl! }}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                resizeMode='cover'
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Users size={30} color={theme.colors.brand[300]} />
            )}
          </View>

          {/* Name / members / status */}
          <View style={{ flex: 1, gap: 4 }}>
            <GradientName name={group.name} />
            {memberCount !== undefined && (
              <Typography variant='caption' color='secondary'>
                {memberCount} member{memberCount === 1 ? '' : 's'}
              </Typography>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 6,
                marginTop: 2,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 3,
                borderRadius: theme.radius.full,
                backgroundColor: 'rgba(129, 140, 248, 0.14)',
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.colors.brand[400],
                }}
              />
              <Typography
                variant='label'
                weight='semibold'
                style={{
                  color: theme.colors.brand[300],
                  letterSpacing: 1,
                }}
              >
                ACTIVE
              </Typography>
            </View>
          </View>

          {/* Arrow affordance */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: 'rgba(138, 137, 255, 0.45)',
              backgroundColor: 'rgba(138, 137, 255, 0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRight size={20} color={theme.colors.brand[300]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
