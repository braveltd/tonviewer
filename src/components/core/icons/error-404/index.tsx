import useDarkMode from 'use-dark-mode';
import Error404IconLight from './error-404-light.svg';
import Error404IconDark from './error-404-dark.svg';
import { InternalImage } from '../../image';

export const Error404Icon = () => {
  const darkMode = useDarkMode();

  return (
    <InternalImage
      alt='error-404'
      height={100}
      src={darkMode.value ? Error404IconDark : Error404IconLight}
      width={270}
    />
  );
};
