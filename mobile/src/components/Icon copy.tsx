import React from 'react'
import { SvgProps } from 'react-native-svg'
import { View } from 'react-native'

import arrow_left from '../../../assets/icons/arrow_left.svg'
import menu from '../../../assets/icons/menu.svg'
import chevron_left from '../../../assets/icons/chevron_left.svg'
import plus from '../../../assets/icons/plus.svg'
import picture from '../../../assets/icons/picture.svg'
import book from '../../../assets/icons/book.svg'
import document from '../../../assets/icons/document.svg'
import cloud_download from '../../../assets/icons/cloud_download.svg'
import next from '../../../assets/icons/next.svg'
import home from '../../../assets/icons/home.svg'
import global_variable from '../../../assets/icons/global_variable.svg'
import control from '../../../assets/icons/control.svg'
import gallery from '../../../assets/icons/gallery.svg'
import alert_on from '../../../assets/icons/alert_on.svg'
import sensor from '../../../assets/icons/sensor.svg'
import iot_platform from '../../../assets/icons/iot_platform.svg'
import cloud_sun_rain from '../../../assets/icons/cloud_sun_rain.svg'
import chart_line_up from '../../../assets/icons/chart_line_up.svg'
import seedling from '../../../assets/icons/seedling.svg'
import google from '../../../assets/icons/google.svg'
import microsoft from '../../../assets/icons/microsoft.svg'
import theme from '../styles/theme.style'

const icons = {
    arrow_left,
    menu,
    chevron_left,
    picture,
    plus,
    book,
    document,
    cloud_download,
    next,
    home,
    global_variable,
    control,
    gallery,
    alert_on,
    sensor,
    iot_platform,
    cloud_sun_rain,
    chart_line_up,
    seedling,
    google,
    microsoft,
}

interface IconProps {
    name: keyof typeof icons
}

function Icon({
    name,
    style,
    ...svgProps
}: IconProps & SvgProps) {
    const IconElement = icons[name]
    return IconElement
        ? <IconElement
            {...style as any}
            {...svgProps}
            width={svgProps.width ?? theme.header.height}
            height={svgProps.height ?? theme.header.height}
        />
        : <View style={{ ...style as any, width: theme.collapse.icon.size }} />
}


export default Icon