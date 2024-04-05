import React from 'react'
import { Modal, ModalProps, Pressable, StyleSheet, View } from 'react-native';
import theme from '../styles/theme.style';

interface DrawerProps {

}

function Drawer({
    children,
    ...modelProps
}: DrawerProps & ModalProps) {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            {...modelProps}
        >
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    {children}
                </View>
                <Pressable
                    style={styles.closeSide}
                    onPress={modelProps.onRequestClose}
                />
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    container: {
        right: 0,
        width: '75%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width:2,height:2},
        elevation: 5,
    },
    closeSide: {
        ...theme.drawer.closeSide,
        flex: 1,
    },
});


export default Drawer