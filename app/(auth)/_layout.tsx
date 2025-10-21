import {Text, View} from 'react-native'
import React, {Component} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Slot} from "expo-router";

export default class AuthLayout extends Component {
    render() {
        return (
            <SafeAreaView>
                <Text>AuthLayout</Text>
                <Slot />
            </SafeAreaView>
        )
    }
}
