import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps } from 'react-native'

interface ButtonProps {
    onPress: () => any
    text: string
    textStyle?: StyleProp<TextStyle>
    // children: JSX.Element
}

function Button({
    onPress,
    text,
    textStyle,
    children,
    ...viewProps
}: ButtonProps & ViewProps) {
    return (
        <View
            onTouchStart={onPress}
            {...viewProps}
            style={{
                ...(viewProps.style as any),
                justifyContent: 'center',
            }}
        >
            {
                children
                || <Text style={{
                    ...(textStyle as any),
                    flex: 0,
                    alignItems: 'center',
                    textAlign:'center'
                }}>{text}</Text>
            }

        </View>
    )
}


export default Button