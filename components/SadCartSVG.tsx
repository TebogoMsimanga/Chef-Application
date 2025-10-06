import * as React from "react";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { Colors } from "../utils/Colors";

export default function SadCartSVG({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Cart body */}
      <Rect
        x="30"
        y="60"
        width="100"
        height="50"
        rx="16"
        fill={Colors.primary}
      />
      {/* Wheels */}
      <Circle cx="50" cy="120" r="12" fill="#fff" />
      <Circle cx="110" cy="120" r="12" fill="#fff" />
      <Circle cx="50" cy="120" r="5" fill="#222" />
      <Circle cx="110" cy="120" r="5" fill="#222" />
      {/* Sad face */}
      <Ellipse cx="80" cy="90" rx="18" ry="18" fill="#fff" />
      <Ellipse cx="74" cy="88" rx="2.5" ry="3.5" fill="#222" />
      <Ellipse cx="86" cy="88" rx="2.5" ry="3.5" fill="#222" />
      <Path
        d="M74 98 Q80 92 86 98"
        stroke="#222"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
