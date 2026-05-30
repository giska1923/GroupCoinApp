import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type RowJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type RowAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch';
type RowGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface RowProps {
  justify?: RowJustify;
  align?: RowAlign;
  gap?: RowGap;
  wrap?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Row: React.FC<RowProps> = ({
  justify = 'flex-start',
  align = 'center',
  gap = 'md',
  wrap = false,
  style,
  children,
}) => {
  const theme = useTheme();

  const getGapValue = () => {
    switch (gap) {
      case 'xs':
        return theme.spacing.xs;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
    }
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: justify,
    alignItems: align,
    gap: getGapValue(),
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  };

  return <View style={rowStyle}>{children}</View>;
};

// Column component for vertical layouts
interface ColumnProps {
  justify?: RowJustify;
  align?: RowAlign;
  gap?: RowGap;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({
  justify = 'flex-start',
  align = 'stretch',
  gap = 'md',
  style,
  children,
}) => {
  const theme = useTheme();

  const getGapValue = () => {
    switch (gap) {
      case 'xs':
        return theme.spacing.xs;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
    }
  };

  const columnStyle: ViewStyle = {
    flexDirection: 'column',
    justifyContent: justify,
    alignItems: align,
    gap: getGapValue(),
    ...style,
  };

  return <View style={columnStyle}>{children}</View>;
};
