import useDarkMode from 'use-dark-mode';
import TermIconLight from './term-light.svg';
import TermIconDark from './term-dark.svg';

export const TermIcon = () => {
  const darkMode = useDarkMode();

  return !darkMode.value ? <TermIconDark /> : <TermIconLight />;
};
