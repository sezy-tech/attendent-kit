import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

export const getCurrentWeekNumber = () => {
    dayjs.extend(weekOfYear);
    return dayjs().week();
}
