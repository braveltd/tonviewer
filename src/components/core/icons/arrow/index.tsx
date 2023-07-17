import styled from 'styled-components';
import useDarkMode from 'use-dark-mode';
import ArrowIconLight from './arrow-light.svg';
import ArrowIconDark from './arrow-dark.svg';
import { InternalImage } from '../../image';

export const ArrowTopIcon = ({ w = 10, h = 6 }) => {
  const darkMode = useDarkMode();

  return <InternalImage alt="arrow" height={h} src={darkMode.value ? ArrowIconDark : ArrowIconLight} width={w} />;
};

const sideToAngle = {
  bottom: '180deg',
  left: '270deg',
  right: '90deg',
  top: '0deg'
};

type RotateProps = {
  side: keyof typeof sideToAngle;
};

const RotateArrow = styled.div<RotateProps>`
  display: flex;
  transform: ${(props) => `rotate(${sideToAngle[props.side] ?? sideToAngle.top})`};
`;

export const ArrowLeftIcon = () => (
  <RotateArrow side="left">
    <ArrowTopIcon />
  </RotateArrow>
);
