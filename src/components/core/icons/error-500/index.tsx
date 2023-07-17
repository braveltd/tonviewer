import useDarkMode from 'use-dark-mode';
import Error500IconDark from './error-500-dark.svg';
import Error500IconLight from './error-500-light.svg';
import { InternalImage } from '../../image';

export const Error500Icon = () => {
  const darkMode = useDarkMode();

  return (
    <InternalImage
      alt='error-500'
      height={167}
      src={darkMode.value ? Error500IconDark : Error500IconLight}
      width={838}
    />
  );
};
