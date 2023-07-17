import { useTheme } from 'styled-components';
import vkQr from '@vkontakte/vk-qr';
import parse from 'html-react-parser';
import { FC, ReactElement } from 'react';
import useDarkMode from 'use-dark-mode';

type TQRProps = {
  value: string
  size: number
}

const QR: FC<TQRProps> = ({ value, size }) => {
  const darkMode = useDarkMode();
  const theme = useTheme();

  const svg = vkQr.createQR(value, {
    qrSize: size,
    foregroundColor: darkMode.value ? theme.colors.icon.white : theme.colors.icon.black,
    ecc: 0
  });

  return parse(svg) as ReactElement;
};

export default QR;
