import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const bannerImages = [
  require("../assets/images/banner.png"),
  require("../assets/images/banner.png"),
  require("../assets/images/banner.png"),
];

export default function Banner() {
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1 >= bannerImages.length ? 0 : prev + 1;
        // Use scrollToOffset for smoother animation
        flatListRef.current?.scrollToOffset({
          offset: next * width,
          animated: true,
        });
        return next;
      });
    }, 8000); // 7 seconds for slower slide
    return () => clearInterval(interval);
  }, [width]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={bannerImages}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            style={[styles.bannerImage, { width }]}
            source={item}
            resizeMode="cover"
          />
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
    overflow: "hidden",
  },
  bannerImage: {
    height: 120,
    borderRadius: 10,
  },
});
