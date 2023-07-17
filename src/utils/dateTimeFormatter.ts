import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const unixTimeToMonth = (date: number) => {
  return dayjs.unix(date).format('MMM');
};

export const unixTimeToTimestamp = (date: number) => {
  return dayjs.unix(date).format('DD MM YYYY, HH:mm:ss');
};

export const unixTimeFromNow = (date: number) => {
  const now = new Date();
  const dt = new Date(date * 1000);

  const conf = {
    sameDay: '[Today at] HH:mm',
    lastDay: '[Yesterday at] HH:mm',
    lastWeek: 'DD MMM, HH:mm',
    sameElse: 'DD MMM YYYY'
  };

  if (now.getFullYear() === dt.getFullYear()) {
    conf.sameElse = 'DD MMM, HH:mm';
  }

  return dayjs.unix(date).calendar(null, conf);
};
