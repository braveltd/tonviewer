import moment, { Moment } from 'moment';

export function timeDiff (start: Moment, end: Moment) {
  const duration = moment.duration(moment(end).diff(moment(start)));

  // Get Days
  const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
  const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all

  // Get Hours
  const hours = duration.hours();
  const hoursFormatted = hours ? `${hours}h ` : '';

  // Get Minutes
  const minutes = duration.minutes();
  const minutesFormatted = minutes && !days ? `${minutes}m` : '';

  // Get Minutes
  const seconds = duration.seconds();
  const secondsFormatted = seconds && !hours ? `${seconds}s` : '';

  return [daysFormatted, hoursFormatted, minutesFormatted, secondsFormatted].filter(Boolean).join(' ');
}

export const ONE_SECOND = 1000;
export const TWO_SECONDS = ONE_SECOND * 2;
