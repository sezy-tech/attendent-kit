import React, { useState } from 'react'
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, TouchableHighlight, View, ViewStyle } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import Icon from './Icon';
import List, { ListItem } from './List';
import { useRouter } from '../store/router.store';
import theme from '../styles/theme.style';

interface CollapseItem extends ListItem {
    title: string
    active?: boolean
    icon?: string
    items?: CollapseItem[]
    route?: string
    titleStyle?: TextStyle
}
interface CollapseProps {
    data: CollapseItem[]
    titleStyle?: TextStyle
    accordion?: boolean
    gap?: number
    canOpen?: boolean,
}

function Collapse({
    data,
    titleStyle,
    accordion,
    gap,
    canOpen,
    ...viewProps
}: CollapseProps & ViewProps) {
    const router = useRouter()
    const [rerender, setRerender] = useState(false)
    const onItemPress = (item: CollapseItem) => {
        if (item.items?.length) {
            !item.active && accordion && data.forEach(d => d !== item && (d.active = false))
            item.active = !item.active
            setRerender(state => !state)
        }
        else {
            item.onPress?.(null as any)
            item.route && router.navigate(item.route)
        }
    }

    const renderItems = (items: CollapseItem[]) => items.map((item, index) => {
        const backgroundColor = item.titleStyle?.backgroundColor || theme.collapse[item.items?.length ? 'title' : 'item'].backgroundColor
        return (
            <View
                key={index}
                style={[styles.itemWrapper, item.active || styles.inActive, gap && {
                    marginBottom: gap,
                }]}

            >
                <TouchableHighlight
                    style={[styles.item, {
                        backgroundColor,
                    }, item.style]}
                    onPress={() => onItemPress(item)}
                    underlayColor={!!item.items ? backgroundColor : '#00000022'}
                >
                    <>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {
                                item.icon && <Icon name={item.icon as any} width={theme.collapse.icon.size} style={{ marginRight: 8 }} />
                            }
                            <Text
                                style={[styles.title, titleStyle]}
                            >
                                {item.title}
                            </Text>
                        </View>
                        {
                            !!item.items && <Icon
                                name='chevron_left'
                                width={theme.collapse.chevron.size}
                                height={theme.collapse.chevron.size}
                                rotation={item.active ? -90 : 0}
                            />
                        }
                    </>
                </TouchableHighlight>
                {
                    !!item.items && <List data={item.items.map(item=>({...item, style: item.titleStyle}))} hasLine hasIcon itemStyle={{
                        backgroundColor: theme.collapse.item.backgroundColor,
                    }} />
                }
            </View>
        )
    })
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
        // flex: 1,
        // backgroundColor: 'blue'
    },
    itemWrapper: {
        // flex:1
    },
    item: {

        // height: theme.btn.wrapper.height,
        // height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: theme.btn.wrapper.ph,
        minHeight: theme.btn.wrapper.height,
    },
    inActive: {
        height: theme.btn.wrapper.height,
        overflow: 'hidden',
    },
    title: {
        flex: 1,
        fontSize: theme.btn.wrapper.fontSize,
        color: theme.primary.color,
    }
});


export default Collapse