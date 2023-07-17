import useDarkMode from 'use-dark-mode';
import CompIconLight from './comp-light.svg';
import CompIconDark from './comp-dark.svg';

export const ComputerIcon = () => {
  const darkMode = useDarkMode();

  return !darkMode.value ? <CompIconDark /> : <CompIconLight />;
};
