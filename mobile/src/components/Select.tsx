import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Dimensions, LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import List from './List';
import Input from './Input';
import Icon from './Icon';
import theme from '../styles/theme.style';

type Placement = 'bl' | 'br'

interface Measurement {
    x: number
    y: number
    width: number
    height: number
}

interface SelectOption {
    label: string
    value: string | number
    prefix?: ReactNode
    suffix?: ReactNode
}

interface SelectProps {
    title?: string,
    hasChevron?: boolean,
    selectValueFormatter?: (selectOption: SelectOption) => string
    options: SelectOption[]
    defaultValue?: string | number
    placeholder?: string
    onChange?: (value: string | number) => void
    placement?: Placement
    style?: ViewStyle,
    optionsStyle?: ViewStyle,
}
const Select = ({
    title,
    hasChevron = true,
    selectValueFormatter,
    options,
    defaultValue,
    placeholder,
    onChange,
    placement = 'bl',
    style,
    optionsStyle,
}: SelectProps) => {
    const ref = useRef(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedOption, setSelectedOption] = useState(findOption(defaultValue))
    const measurement = useRef<Measurement>({ x: 0, y: 0, width: 0, height: 0 })

    function findOption(value: any) { return options.find(option => option.value === value) }

    const selectOptions = options?.map((option, optionIndex) => ({
        title: option.label,
        prefix: option.prefix,
        suffix: option.suffix,
        onPress: () => {
            setSelectedOption(option)
            onChange?.(option.value)
            setModalVisible(false)
        },
        style: selectedOption?.value === option.value ? {
            backgroundColor: `${theme.primary.backgroundColor}55`
        } : {}
    }))
    useEffect(() => {
        setSelectedOption(findOption(defaultValue))
    }, [defaultValue])

    // const onLayout = (event: LayoutChangeEvent) => {
    //     // console.log(layout)

    //     // (event.target as any).measureInWindow(a => {
    //     // console.log(a)
    // });
    //     // console.log('onLayout: ',x,y,w,h)
    // }
    return (
        <>
            <View style={[styles.wrapper, style]} ref={ref} collapsable={false}>
                <Pressable
                    onPress={() => {
                        (ref.current as any)?.measureInWindow((x: number, y: number, width: number, height: number) => {
                            measurement.current = {
                                x,
                                y,
                                width,
                                height,
                            }
                            setModalVisible(true);
                        });

                    }}
                >
                    <Input
                        title={title}
                        editable={false}
                        placeholder={placeholder}
                        value={selectValueFormatter && selectedOption ? selectValueFormatter(selectedOption) : String(selectedOption?.label ?? '')}
                        prefix={selectedOption?.prefix}
                        // style={[styles.input]}
                        suffix={hasChevron && <Icon name='chevron_left' width={18} rotation={modalVisible ? 90 : -90} />}
                    />
                </Pressable >
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
            // ref={ref as any}
            >
                <View style={styles.modalContainer}>
                    <Pressable
                        style={styles.closeSide}
                        onPress={() => setModalVisible(false)}
                    />
                    <View style={[styles.modal, calPosition(placement, measurement)]}>

                        <View style={[styles.options, optionsStyle]}>
                            <ScrollView>
                                <List data={selectOptions} itemStyle={{
                                    backgroundColor: theme.collapse.item.backgroundColor,
                                    maxHeight: 200
                                }} />
                            </ScrollView>
                        </View>
                        {/* <List data={selectOptions} hasLine itemStyle={{
                        // backgroundColor: theme.collapse.item.backgroundColor,
                    }} /> */}
                    </View>
                </View>
            </Modal>
        </>
    )
}

const calPosition = (placement: Placement, { current: { x, y, width, height } }: React.MutableRefObject<Measurement>) => {
    const window = Dimensions.get('window');

    if (placement === 'br')
        return {
            top: y + height + 4,
            right: window.width - x - width,
            minWidth: width,
        }


    return {
        top: y + height + 4,
        left: x,
        minWidth: width,
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        backgroundColor: '#fff',
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
    options: {

    },
    closeSide: {
        ...theme.select.closeSide,
        width: '100%',
        height: '100%',
    },
});


export default Select