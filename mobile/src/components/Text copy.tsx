import React from 'react'
import { Text as RNText, TextStyle } from 'react-native'
import { TextProps as RNTextProps } from 'react-native-svg'

interface TextProps {
    style?: TextStyle
}

function Text({
    style,
    ...textProps
}: TextProps & RNTextProps) {
    return (
        <RNText
            {...textProps}
            style={{
                fontFamily: 'Poppins-Regular',
                // fontFamily: getFontFamily(style.fontWeight),
                ...style,
            }}
        >{textProps.children}</RNText>
    )
}

function getFontFamily(fontWeight: FontWeight) {
    switch (fontWeight) {
        case '100':

    }
}

type FontWeight =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;

export default Text