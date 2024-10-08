import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import theme from '../styles/theme.style';

type Placement = 'bl' | 'br'

interface Measurement {
    x: number
    y: number
    width: number
    height: number
}


interface PopoverProps {
    visible?: boolean
    placement?: Placement
    style?: ViewStyle,
    content: () => ReactNode
    onClose?: () => void
}
const Popover = forwardRef(({
    visible,
    placement = 'bl',
    style,
    content,
    onClose,
    ...viewProps
}: PopoverProps & ViewProps, ref) => {
    const targetRef = useRef<any>(null)
    const [modalVisible, setModalVisible] = useState(!!visible)

    const [measurement, setMeasurement] = useState<Measurement>({ x: 0, y: 0, width: 0, height: 0 })

    // console.log(measurement)
    // const measurement = useMemo<{ current: Measurement }>(() => ({ current: { x: 0, y: 0, width: 0, height: 0 } }), [])

    useLayoutEffect(() => {
        (targetRef.current as any)?.measureInWindow((x: number, y: number, width: number, height: number) => {
            console.log({
                x,
                y,
                width,
                height,
            })
            // console.log(measurement.current);
            // setModalVisible(true);
        });
    }, [modalVisible])


    useImperativeHandle(ref, () => ({
        visible: modalVisible,
        setVisible: setModalVisible,
    }), [])

    return (
        <>
            <View style={[styles.wrapper, style]} ref={targetRef} collapsable={false} onLayout={(target) => {
                // console.log('================2');
                setMeasurement(target.nativeEvent.layout)
                // (target.nativeEvent.layout. as any)?.measureInWindow((x: number, y: number, width: number, height: number) => {
                //     setMeasurement({
                //         x,
                //         y,
                //         width,
                //         height,
                //     })
                //     // console.log(measurement.current);
                //     // setModalVisible(true);
                // });
            }}>
                {
                    viewProps.children
                }
            </View>

            {
                viewProps.children
            }
            {modalVisible && <Modal
                transparent={true}
                // visible={true}
                visible={modalVisible}
            // ref={ref as any}
            >
                <View style={styles.modalContainer}>
                    <Pressable
                        style={styles.closeSide}
                        onPress={() => {
                            onClose?.()
                            setModalVisible(false)
                        }}
                    />
                    <View style={[styles.modal, calPosition(placement, measurement)]}>
                        {/* <View style={[styles.modal, calPosition(placement, targetRef)]}> */}
                        {
                            content()
                        }
                    </View>
                </View>
            </Modal>}
        </>
    )
})

// const calPosition = (placement: Placement, targetRef: React.MutableRefObject<any>) => {
const calPosition = (placement: Placement, { x, y, width, height }: Measurement) => {

    const window = Dimensions.get('window');
    if (placement === 'br') {
        console.log('++++++++++++++')
        console.log(x)
        console.log(y)
        console.log(width)
        console.log(height)
        console.log({
            top: y + height + 4,
            right: window.width - x - width,
            minWidth: width,
        })
        return {
            top: y + height + 4,
            left: 0,
            minWidth: 400,
        }
    }
    // return {
    //     top: y + height + 4,
    //     right: window.width - x - width,
    //     minWidth: width,
    // }}


    return {
        top: y + height + 4,
        left: x,
        minWidth: width,
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        // backgroundColor: '#fff',
        // borderRadius: theme.input.wrapper.borderRadius,
    },
    modal: {
        ...theme.select.modal,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        elevation: 5,
        position: 'absolute',
        borderRadius: theme.primary.borderRadius,
        overflow: 'hidden',
        height: 'auto',
        minWidth: 200,
    },
    modalContainer: {
        position: 'relative',
        borderRadius: theme.input.wrapper.borderRadius,
    },
    closeSide: {
        backgroundColor: '#00000033',
        width: '100%',
        height: '100%',
    },
});


export default Popover