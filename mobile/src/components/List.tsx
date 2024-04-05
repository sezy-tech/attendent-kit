import React, { useState } from 'react'
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, Touchable, TouchableHighlight, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import Icon from './Icon';
import { useRouter } from '../store/router.store';
import theme from '../styles/theme.style';

export interface ListItem extends PressableProps {
    title: string
    icon?: string
    route?: string
    style?: ViewStyle
}
interface ListProps {
    data: ListItem[]
    itemStyle?: ViewStyle
    gap?: number
    hasLine?: boolean
    hasIcon?:boolean
}

function List({
    data,
    itemStyle,
    gap,
    hasLine,
    hasIcon,
    ...viewProps
}: ListProps & ViewProps) {
    const router = useRouter()
    const onItemPress = (item: ListItem) => {
        item.route && router.navigate(item.route)
        item.onPress?.(null as any)
    }
    const renderItems = (items: ListItem[]) => items.map((item, index) => (
        <View
            key={index}
            style={[styles.itemWrapper]}
        >
            <TouchableHighlight
                onPress={() => onItemPress(item)}
                style={[styles.item, itemStyle, item.style, hasLine && index < items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: `${item.style?.borderBottomColor?.toString() ?? '#00000011'}`
                }]}
                underlayColor='#00000022'
            >
                <View
                    style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }]}
                >
                    {
                        hasIcon && <Icon name={item.icon as any} width={theme.collapse.icon.size} style={{ marginRight: 8 }} />
                    }
                    <Text
                        style={[styles.title]}
                    >
                        {item.title}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    ))

    return (
        <View
            style={styles.container}
            {...viewProps}
        >
            {renderItems(data)}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    },
    itemWrapper: {
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: theme.btn.wrapper.ph,
        minHeight: theme.btn.wrapper.height,
    },
    title: {
        fontSize: theme.btn.wrapper.fontSize,
        color: theme.primary.color,
    }
});


export default List