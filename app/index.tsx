// import {
//   GoogleSignin,
//   GoogleSigninButton,
// } from "@react-native-google-signin/google-signin";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { maybeAddUser } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // const [text, setText] = useState("");
  // const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "621039869296-koc0e6464qdal8jp6cgiiie8mj2u139m.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      console.log(response.authentication.accessToken);
      if (token) getUserInfo();
    }
  }, [response, token]);

  const router = useRouter();
  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
      console.log(user);
      const createdUser = await maybeAddUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.id,
      });
      console.log(createdUser);
      console.log("Created id = ", createdUser.id);
      router.push("/navigateToGroup");
      router.setParams({
        uid: createdUser.id,
      });
    } catch (error) {
      // Add your own error handler here
    }
  };
  // const router = useRouter();
  return (
    <View style={styles.container}>
      {/* <TextInput
        placeholder="Enter your name"
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
        style={styles._1}
      ></TextInput> */}
      {userInfo === null && (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  _1: {
    padding: "10px",
    backgroundColor: "#e2e8f0",
  },
});
