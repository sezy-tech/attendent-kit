import React from 'react';
import { SvgProps } from 'react-native-svg';
import { View } from 'react-native';
import arrow_left from '../../assets/icons/arrow_left.svg';
import menu from '../../assets/icons/menu.svg';
import chevron_left from '../../assets/icons/chevron_left.svg';
import plus from '../../assets/icons/plus.svg';
import picture from '../../assets/icons/picture.svg';
import book from '../../assets/icons/book.svg';
import document from '../../assets/icons/document.svg';
import cloud_download from '../../assets/icons/cloud_download.svg';
import next from '../../assets/icons/next.svg';
import home from '../../assets/icons/home.svg';
import control from '../../assets/icons/control.svg';
import gallery from '../../assets/icons/gallery.svg';
import alert_on from '../../assets/icons/alert_on.svg';
import chart_line_up from '../../assets/icons/chart_line_up.svg';
import seedling from '../../assets/icons/seedling.svg';
import chat_round_call from '../../assets/icons/chat_round_call.svg';
import game from '../../assets/icons/game.svg';
import math from '../../assets/icons/math.svg';
import music_note from '../../assets/icons/music_note.svg';
import music from '../../assets/icons/music.svg';
import night_story from '../../assets/icons/night_story.svg';
import pause from '../../assets/icons/pause.svg';
import piano from '../../assets/icons/piano.svg';
import play from '../../assets/icons/play.svg';
import playlist_add from '../../assets/icons/playlist_add.svg';
import playlist from '../../assets/icons/playlist.svg';
import repeat from '../../assets/icons/repeat.svg';
import shuffle from '../../assets/icons/shuffle.svg';
import sound from '../../assets/icons/sound.svg';
import record from '../../assets/icons/record.svg';
import stop from '../../assets/icons/stop.svg';
import times from '../../assets/icons/times.svg';
import check from '../../assets/icons/check.svg';
import check_w from '../../assets/icons/check_w.svg';
import good_job_hand from '../../assets/icons/good_job_hand.svg';
import tap from '../../assets/icons/tap.svg';
import copy from '../../assets/icons/copy.svg';
import loading from '../../assets/icons/loading.svg';
import relationship from '../../assets/icons/relationship.svg';
import warning_triangle from '../../assets/icons/warning-triangle.svg';
import progress from '../../assets/icons/progress.svg';
import calender from '../../assets/icons/calender.svg';
import classicon from '../../assets/icons/class.svg';
import userplus from '../../assets/icons/userplus.svg';
import room from '../../assets/icons/room.svg';
import edit from '../../assets/icons/edit.svg';
import deleteitem from '../../assets/icons/delete.svg';
import key from '../../assets/icons/key.svg';
import email from '../../assets/icons/email.svg';
import clock from '../../assets/icons/clock.svg';
import facescan from '../../assets/icons/facescan.svg';
import voice from '../../assets/icons/voice.svg';
import { get } from 'lodash';
import theme from '../styles/theme.style'
const icons = {
  facescan,
  voice,
  clock,
  edit,
  deleteitem,
  room,
  userplus,
  classicon,
  calender,
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
  control,
  gallery,
  alert_on,
  chart_line_up,
  seedling,
  chat_round_call,
  game,
  math,
  music_note,
  music,
  night_story,
  pause,
  piano,
  play,
  playlist_add,
  playlist,
  repeat,
  shuffle,
  sound,
  record,
  stop,
  times,
  check,
  check_w,
  good_job_hand,
  tap,
  copy,
  loading,
  relationship,
  warning_triangle,
  progress,
  key,
  email,
};

interface IconProps {
  name: TrimDot<DeepKeyOf<typeof icons>>;
}

function Icon({ name, style, ...svgProps }: IconProps & SvgProps) {
  const IconElement = get(icons, name);
  if (!IconElement || typeof IconElement == 'number')
    return (
      <View style={{ ...(style as any), width: theme.collapse.icon.size }} />
    );
  return (
    <IconElement
      {...(style as any)}
      {...svgProps}
      width={svgProps.width ?? theme.header.height}
      height={svgProps.height ?? theme.header.height}
    />
  );
}

export default Icon;

type DeepKeyOf<T> = T extends object
  ? T extends React.FC<any>
    ? ''
    : { [K in keyof T]: `${K & string}.${DeepKeyOf<T[K]>}` }[keyof T]
  : '';

type TrimDot<T extends string> = T extends `${infer U}.` ? U : T;
