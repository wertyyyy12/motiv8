import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function CustomModal({
  isVisible,
  children,
  icon,
  onClose,
  title,
}: {
  isVisible: boolean;
  children: React.ReactElement;
  icon?: React.ReactElement;
  onClose: () => void;
  title: string;
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose}>
            {icon}
            {/* <MaterialIcons name="close" color="#fff" size={22} /> */}
            <Text style={{ color: "#fff" }}>Close</Text>
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    height: "25%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
