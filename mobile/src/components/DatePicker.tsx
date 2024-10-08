import moment from "moment";
import React, { useRef, useState } from "react";
import { Calendar } from "react-native-calendars";
import Popup from "./Popup";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { Dimensions, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Button from "./Button";
import Input from "./Input";
import Icon from "./Icon";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import theme from "../styles/theme.style";

interface DatePickerData {
    startDay: null | moment.Moment
    endDay: null | moment.Moment
    markedDates: MarkedDates
}

interface DatePicker {
    title?: string
    // visible?: boolean
    onChange?: (from: number, to: number) => void
    onClose?: () => void
    labelFormater?: (from: number, to: number) => string
    dateFormat?: string
    range?: boolean
}

const DatePicker = ({
    title,
    onChange,
    onClose,
    labelFormater,
    dateFormat = 'YYYY-MM-DD',
    range,
    ...viewProps
}: DatePicker & ViewProps) => {
    const [data, setData] = useState<DatePickerData>({
        startDay: null,
        endDay: null,
        markedDates: {},
    })
    const popupRef = useRef<any>(null)

    const onPopupClose = () => {
        onClose?.()
        popupRef.current?.close()
    }

    const onApply = () => {
        popupRef.current?.close()
        onChange?.(data.startDay?.valueOf() ?? 0, data.endDay?.valueOf() ?? 0)
    }

    const dates = [data.startDay?.valueOf() ?? 0, data.endDay?.valueOf() ?? 0]


    const onDayPress = (day: DateData) => {
        const selectedDate = moment(day.dateString)

        function getMarkedDates(data: DatePickerData): MarkedDates {
            const dateString = (data.startDay as any)?.format(dateFormat)
            return dateString ? {
                [dateString]: {
                    color: theme.primary.backgroundColor,
                    textColor: '#fff',
                }
            } : {}
        }
        data.startDay = selectedDate
        data.endDay = selectedDate

        setData(state => ({
            ...state,
            markedDates: getMarkedDates(data),
        }))
    }

    const onDayRangePress = (day: DateData) => {
        const selectedDate = moment(day.dateString)

        function getMarkedDates(data: DatePickerData): MarkedDates {
            if (!data.startDay || !data.endDay) {
                const dateString = (data.startDay || data.endDay)?.format(dateFormat)
                return dateString ? {
                    [dateString]: {
                        color: theme.primary.backgroundColor,
                        textColor: '#fff',
                        startingDay: true,
                    }
                } : {}
            }

            const date = {} as MarkedDates
            for (const d = data.startDay.clone(); d.isSameOrBefore(day.dateString); d.add(1, 'days')) {
                const dateString = d.format(dateFormat)
                date[dateString] = {
                    color: `${theme.primary.backgroundColor}33`,
                    textColor: '#fff'
                }

                if (d.format(dateFormat) === data.startDay.format(dateFormat)) {
                    date[dateString].color = theme.primary.backgroundColor
                    // date[d.format(dateFormat)].startingDay = true
                }
                if (d.format(dateFormat) === data.endDay.format(dateFormat)) {
                    date[d.format(dateFormat)].color = theme.primary.backgroundColor
                    // date[d.format(dateFormat)].endingDay = true;
                }
            }
            return date
        }

        if (!data.startDay || selectedDate.isBefore(data.startDay)) {
            data.startDay = selectedDate
        }
        if (!data.endDay || selectedDate.isAfter(data.endDay)) {
            data.endDay = selectedDate
        }

        if (selectedDate.isBetween(data.startDay, data.endDay)) {
            data.startDay = selectedDate
            data.endDay = selectedDate
        }

        setData(state => ({
            ...state,
            markedDates: getMarkedDates(data),
        }))
    }
    const getPopupContent = () => {
        return (
            <View style={[styles.popupBody, {
                width: Dimensions.get("window").width * 0.8
            }]}>
                <Calendar
                    onDayPress={range ? onDayRangePress : onDayPress}
                    monthFormat={"yyyy MMM"}
                    hideDayNames={false}
                    markingType={'period'}
                    markedDates={data.markedDates}
                    theme={{
                        // selectedDayBackgroundColor: '#646464',
                        // selectedDayTextColor: 'white',
                        // monthTextColor: 'blue',
                        // dayTextColor: 'black',
                        // textMonthFontSize: 18,
                        // textDayHeaderFontSize: 16,
                        arrowColor: theme.primary.backgroundColor,
                        // dotColor: 'black'
                    }}
                />
                <View style={styles.actions}>
                    {/* <Button label="Cancel" style={styles.cancelButton} onPress={onPopupClose} />
                    <Button label="Apply" style={styles.applyButton} onPress={onApply} disabled={!data.startDay || !data.endDay} /> */}
                </View>
            </View>
        )
    }
    return (
        <>
            <View style={[styles.wrapper, viewProps.style]} collapsable={false}>
                <Pressable
                    onPress={() => popupRef.current?.open()}
                >
                    <Input
                        title={title}
                        editable={false}
                        placeholder={''}
                        value={(labelFormater ?? defaulLabelFormatter)(dates[0], dates[1])}
                    // style={[styles.input]}
                    // suffix={<Icon name='chevron_left' width={18} rotation={modalVisible ? 90 : -90} />}
                    />
                </Pressable >
            </View>
            <Popup
                ref={popupRef}
                content={getPopupContent}
            />
        </>
    )
}

function defaulLabelFormatter(from: number, to: number) {
    return `${from}->${to}`
}
const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        backgroundColor: '#fff',
    },
    popupBody: {
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        padding: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#aaa',
    },
    applyButton: {
        flex: 1,
    },
});

export default DatePicker