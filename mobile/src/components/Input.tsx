import React, { ReactNode } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import theme from '../styles/theme.style';


// interface InputOption {
//     label: string
//     value: string | number
// }

interface InputProps {
    title?: string
    wrapperStyle?: ViewStyle,
    prefix?: ReactNode,
    suffix?: ReactNode,
}
const Input = ({
    title,
    wrapperStyle,
    prefix,
    suffix,
    ...textInputProps
}: InputProps & TextInputProps) => {
    return (
        <View style={[styles.wrapper, wrapperStyle]}>
            {prefix}
            <View style={[styles.container]}>
                <TextInput
                    {...textInputProps}
                    style={[styles.input, textInputProps.style]}
                />
            </View>

            {suffix}

            {title && <View style={styles.titleWrapper}><View style={styles.titleBg} /><Text style={styles.title}>{title}</Text></View>}
        </View>


    )
}


const styles = StyleSheet.create({
    wrapper: {
        ...theme.input.wrapper,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
    },
    titleWrapper: {
        position: 'absolute',
        top: -12,
        left: theme.input.wrapper.paddingHorizontal,
    },
    title: {
    },
    titleBg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        height: '45%',
        width: '100%',

    },
    container: {
        ...theme.input.container,
        flex: 1,
    },
    input: {
        color: theme.primary.color,
        ...theme.input.input,
    }
});


export default Input