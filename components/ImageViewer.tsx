import { Image, StyleSheet } from "react-native";
export default function ImageViewer({ src }) {
  return <Image source={src} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
