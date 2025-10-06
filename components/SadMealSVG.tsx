import * as React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { Colors } from "../utils/Colors";

export default function SadMealSVG({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Plate */}
      <Ellipse cx="80" cy="130" rx="60" ry="18" fill="#f2f3f2" />
      {/* Face (meal) */}
      <Circle cx="80" cy="80" r="60" fill={Colors.primary} />
      {/* Eyes */}
      <Ellipse cx="60" cy="75" rx="7" ry="10" fill="#fff" />
      <Ellipse cx="100" cy="75" rx="7" ry="10" fill="#fff" />
      <Ellipse cx="60" cy="78" rx="3" ry="4" fill="#222" />
      <Ellipse cx="100" cy="78" rx="3" ry="4" fill="#222" />
      {/* Sad mouth */}
      <Path
        d="M60 110 Q80 95 100 110"
        stroke="#fff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
