import React from 'react'
import {Redirect, Slot} from "expo-router";

export default function RootLayout() {
    const isAuthenticated = false;

    if(isAuthenticated) return <Redirect href={"/sign-in"} />
    return <Slot />
}
