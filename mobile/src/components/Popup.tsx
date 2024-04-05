import React, { ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Modal, ModalProps, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../styles/theme.style';

interface PopupProps {
    contentStyle?: ViewStyle,
    content?: () => ReactNode
}
const Popup = forwardRef(({
    content,
    children,
    contentStyle,
    ...modelProps
}: PopupProps & ModalProps, ref) => {
    const [popupVisible, setPopupVisible] = useState(!!modelProps.visible)

    const open = (callback?: () => void) => {
        callback?.()
        setPopupVisible(true)
    }
    const close = (callback?: () => void) => {
        callback?.()
        setPopupVisible(false)
    }

    useImperativeHandle(ref, () => ({
        open,
        close,
    }));

    return (
        <Modal
            transparent={true}
            {...modelProps}
            visible={popupVisible}
            ref={ref as any}
        >
            <View style={styles.wrapper}>
                <Pressable
                    style={styles.closeSide}
                    onPress={() => close(modelProps.onRequestClose as any)}
                />
                <View style={[styles.container, contentStyle]}>
                    {content ? content() : children}
                </View>
            </View>
        </Modal>
    )
})


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        ...theme.popup.container,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        elevation: 5,
        position: 'absolute',
        borderRadius: theme.primary.borderRadius,
        overflow: 'hidden',
    },
    closeSide: {
        ...theme.popup.closeSide,
        width: '100%',
        height: '100%',
    },
});


export default Popup