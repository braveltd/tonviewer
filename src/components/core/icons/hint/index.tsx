import useDarkMode from 'use-dark-mode';
import HintIconLight from './hint-light.svg';
import HintIconDark from './hint-dark.svg';
import { InternalImage } from '../../image';

export const HintIcon = () => {
  const darkMode = useDarkMode();

  return (
    <InternalImage
      alt='hint'
      height={16}
      src={darkMode.value ? HintIconDark : HintIconLight}
      width={16}
    />
  );
};
