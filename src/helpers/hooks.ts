import { useState, useEffect, useMemo } from 'react';
import { addressToBase64, formatAddress } from './index';

export const useWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

export const getAddressHalfLength = (width, coef) => {
  for (let i = 20; i >= 3; i--) {
    if (width > coef * (i + 2)) return i;
  }
};

// TODO: avoid using this hook
// возвращает длину сжатой половины адреса отностельно текущего размера экрана,
// используется в formatAddress(). Например если 3, то EQa..x4k
export const useFormattedAddressLength = ({ fullOnDesktop = true, coef = 60 }) => {
  const width = useWidth() || window.innerWidth;
  const [addressHalfLength, setAddressHalfLength] = useState(getAddressHalfLength(width, coef));

  useEffect(() => {
    if (fullOnDesktop) setAddressHalfLength(99);
    if (width < 768) setAddressHalfLength(getAddressHalfLength(width, coef));
  }, [width, coef, fullOnDesktop]);

  return addressHalfLength;
};

type UsePrettyAddressOptions = Partial<{
  fullOnDesktop: boolean;
  coef: number;
}>;

export const usePrettyAddress = (address: string, options: UsePrettyAddressOptions = {}, isRaw: boolean = false) => {
  const addressHalfLength = useFormattedAddressLength(options);
  return useMemo(() => {
    return formatAddress(isRaw ? address : addressToBase64(address), addressHalfLength);
  }, [address, addressHalfLength]);
};
