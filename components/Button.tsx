import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Button({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <Text
          style={{
            padding: "5px",
            backgroundColor: "#d1d5db",
            marginTop: "3px",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    color: "#000",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#000",
    fontSize: 16,
  },
});
