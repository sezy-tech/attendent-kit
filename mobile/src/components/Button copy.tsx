import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'
import Text from './Text'
import theme from '../styles/theme.style'

interface ButtonProps {
    onPress?: () => any
    label?: string
    textStyle?: TextStyle
    prefix?: ReactNode,
    suffix?: ReactNode,
    // children: JSX.Element
}

function Button({
    onPress,
    label,
    textStyle,
    children,
    prefix,
    suffix,
    ...viewProps
}: ButtonProps & TouchableOpacityProps) {
    return (
        <TouchableOpacity onPress={onPress}
            {...viewProps}
            style={{
                backgroundColor: viewProps.disabled ? theme.btn.disabled.backgroundColor : theme.primary.backgroundColor,
                paddingHorizontal: theme.btn.wrapper.ph,
                paddingVertical: theme.btn.wrapper.pv,
                borderRadius: theme.btn.wrapper.borderRadius,
                justifyContent: 'center',
                
                width: '100%',
                // height: 100,
                ...(viewProps.style as any),
            }}
        >
            {prefix}
            {
                children
                || <Text style={{
                    color: theme.btn.wrapper.color,
                    fontSize: theme.btn.wrapper.fontSize,
                    flex: 0,
                    alignItems: 'center',
                    textAlign: 'center',
                    ...(textStyle as any),
                }}>{label}</Text>
            }
            {suffix}
        </TouchableOpacity>
    )
}


export default Button