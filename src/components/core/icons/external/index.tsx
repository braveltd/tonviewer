import useDarkMode from 'use-dark-mode';
import ExternalIconLight from './external-light.svg';
import ExternalIconDark from './external-dark.svg';
import { InternalImage } from '../../image';

export const ExternalIcon = () => {
  const darkMode = useDarkMode();

  return (
    <InternalImage
      alt='external'
      height={18}
      src={darkMode.value ? ExternalIconDark : ExternalIconLight}
      width={16}
    />
  );
};
