import {View, Text, Button} from 'react-native'
import React from 'react'
import {router} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>SignIn</Text>
            <Button title={"Sign Up"} onPress={() => router.push("/sign-in")}></Button>
        </View>
    )
}
export default SignUp
