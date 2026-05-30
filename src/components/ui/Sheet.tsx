import React from 'react';
import {
  Modal,
  View,
  Pressable,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showHandle?: boolean;
  showClose?: boolean;
  /** Right-aligned header action, e.g. a Save button. */
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Sheet: React.FC<SheetProps> = ({
  visible,
  onClose,
  title,
  showHandle = true,
  showClose = false,
  headerRight,
  children,
  contentStyle,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const hasHeader = title || showClose || headerRight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          style={{
            ...StyleSheetAbsoluteFill,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface.secondary,
              borderTopLeftRadius: theme.components.sheet.radius,
              borderTopRightRadius: theme.components.sheet.radius,
              borderWidth: 1,
              borderColor: theme.colors.surface.border,
              paddingBottom: insets.bottom + theme.spacing.lg,
              ...theme.shadow.lg,
            }}
          >
            {showHandle && (
              <View style={{ alignItems: 'center', paddingTop: theme.spacing.md }}>
                <View
                  style={{
                    width: theme.components.sheet.handleWidth,
                    height: theme.components.sheet.handleHeight,
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.colors.surface.border,
                  }}
                />
              </View>
            )}

            {hasHeader && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: theme.spacing.lg,
                  paddingTop: theme.spacing.lg,
                }}
              >
                {showClose ? (
                  <Pressable onPress={onClose} hitSlop={8}>
                    <X size={22} color={theme.colors.text.secondary} />
                  </Pressable>
                ) : (
                  <View style={{ width: 22 }} />
                )}

                {title && (
                  <Typography variant='subheading' weight='semibold'>
                    {title}
                  </Typography>
                )}

                <View style={{ minWidth: 22, alignItems: 'flex-end' }}>
                  {headerRight}
                </View>
              </View>
            )}

            <View
              style={{
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                ...contentStyle,
              }}
            >
              {children}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const StyleSheetAbsoluteFill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
