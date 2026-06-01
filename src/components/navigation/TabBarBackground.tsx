import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TabBarBackgroundProps {
  /** Full width of the bar (usually the screen width). */
  width: number;
  /** Full height of the bar, including the bottom safe-area inset. */
  height: number;
  /** Horizontal center of the FAB cradle. */
  notchCenter: number;
  /** Radius of the concave cradle that hugs the FAB. */
  notchRadius: number;
  /** How far the cradle dips below the bar's top edge. */
  notchDepth: number;
  /** Radius of the bar's rounded top corners. */
  cornerRadius: number;
  /** Translucent fill for the bar body. */
  fill: string;
  /** Optional hairline color drawn along the top edge only. */
  stroke?: string;
  strokeWidth?: number;
}

/**
 * Draws the floating tab bar as a single shape: a rounded-top panel whose top
 * edge curves inward to form a cradle for the central FAB. The cradle area is
 * left transparent so the screen content shows through around the button.
 */
export const TabBarBackground: React.FC<TabBarBackgroundProps> = ({
  width,
  height,
  notchCenter,
  notchRadius,
  notchDepth,
  cornerRadius,
  fill,
  stroke,
  strokeWidth = 1,
}) => {
  const cx = notchCenter;
  const r = notchRadius;
  const dip = notchDepth;
  // Smoothing width on each side of the cradle so it blends into the flat edge.
  const shoulder = r * 0.55;

  // The top edge, traced left-to-right with a concave dip in the middle.
  const topEdge = [
    `M0,${cornerRadius}`,
    `Q0,0 ${cornerRadius},0`,
    `L${cx - r - shoulder},0`,
    `C${cx - r},0 ${cx - r},${dip} ${cx},${dip}`,
    `C${cx + r},${dip} ${cx + r},0 ${cx + r + shoulder},0`,
    `L${width - cornerRadius},0`,
    `Q${width},0 ${width},${cornerRadius}`,
  ].join(' ');

  // Close the shape down the sides and across the bottom for the filled body.
  const body = `${topEdge} L${width},${height} L0,${height} Z`;

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents='none'
    >
      <Path d={body} fill={fill} />
      {stroke ? (
        <Path
          d={topEdge}
          fill='none'
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </Svg>
  );
};
