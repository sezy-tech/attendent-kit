import React, { ReactNode, useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, TextInput, TextInputProps, View, ViewProps, ViewStyle } from 'react-native';
import theme from '../styles/theme.style';
import Icon from './Icon';


interface LoadingIconProps {
}
const LoadingIcon = ({
    ...viewProps
}: LoadingIconProps & ViewProps) => {

    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Create an infinite rotation loop
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1000, // 1 second for a full rotation
                easing: Easing.linear, // Make the animation linear to rotate smoothly
                useNativeDriver: true, // Use native driver for better performance
            })
        ).start();
    }, [rotateValue]);

    // Interpolate the rotation value into degrees
    const rotateAnimation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
    });

    return (
        <View>
            <Animated.View style={{ transform: [{ rotate: rotateAnimation }] }}>
                <Icon name="progress"/>
            </Animated.View>
        </View>
    )
}

export default LoadingIcon