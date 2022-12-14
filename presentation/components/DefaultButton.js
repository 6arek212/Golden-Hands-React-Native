import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";
import { globalStyles, primaryColor, white } from "../styles/global";

const DefaultButton = ({ style, text, onPress, color, textColor, buttonStyles }) => {
  return (
    <TouchableOpacity style={{ ...style }} onPress={onPress}>
      <View
        style={{
          ...styles.button,
          backgroundColor: color ? color : primaryColor,
          ...buttonStyles
        }}
      >
        <Text style={{ ...styles.text, color: textColor ? textColor : white }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DefaultButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: Platform.OS === "android" ? 4 : 8,
    paddingHorizontal: Platform.OS === "android" ? 16 : 20,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...globalStyles.font,
    color: "#fff",
    fontSize: 18,
  },
});
