import React, { ReactNode } from 'react'
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'
import theme from '../styles/theme.style'

interface TableRow extends Record<string, any> {
    key?: string,
}
interface TableColumn {
    key?: string
    dataIndex: string
    title: string
    width: number
    render?: (row: TableRow) => ReactNode
}

interface TableProps {
    // onPress: () => any
    columns: TableColumn[]
    data: TableRow[]
}

function Table({
    // onPress,
    columns,
    data,
    ...tableProps
}: TableProps) {
    return (
        <View style={[theme.table.wrapper]}>
            <ScrollView horizontal stickyHeaderIndices={[0]}>
                <View style={{ width: '100%', flex: 1 }}>
                    <View style={[theme.table.thead]}>
                        <View style={[theme.table.tr]}>
                            {
                                columns.map((column, columnIndex) => (
                                    <View key={column.key ?? columnIndex} style={[theme.table.th, { width: column.width }]}>
                                        <Text style={{ fontWeight: '500', }}>{column.title}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                    <View style={[theme.table.tbody]}>
                        {
                            data.map((row, rowIndex) => (
                                <View key={row.key ?? rowIndex} style={[theme.table.tr]}>
                                    {
                                        columns.map((column, columnIndex) => (
                                            <View key={column.key ?? columnIndex} style={[theme.table.td, { width: column.width }]}>
                                                {column.render?.(row) ?? <Text>{row[column.dataIndex]}</Text>}
                                            </View>
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}


export default Table