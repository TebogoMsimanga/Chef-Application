import * as React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { Colors } from "../utils/Colors";

export default function HappySVG({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Face */}
      <Circle cx="80" cy="80" r="60" fill={Colors.primary} />
      {/* Eyes */}
      <Ellipse cx="60" cy="75" rx="7" ry="10" fill="#fff" />
      <Ellipse cx="100" cy="75" rx="7" ry="10" fill="#fff" />
      <Ellipse cx="60" cy="78" rx="3" ry="4" fill="#222" />
      <Ellipse cx="100" cy="78" rx="3" ry="4" fill="#222" />
      {/* Happy mouth */}
      <Path
        d="M60 100 Q80 120 100 100"
        stroke="#fff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
