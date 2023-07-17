import { css } from '@linaria/core';
import Lottie from 'lottie-react';
import TonviewerLottie from 'tonviewer-web/assets/animations/logo.json';

const logoContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Logo = ({ w = 84, h = 96, isPlay = false }: { w?: number; h?: number; isPlay?: boolean }) => {
  return (
    <div className={logoContainer} style={{ width: w, height: h }}>
      <Lottie
        loop={isPlay}
        autoPlay={isPlay}
        width={w}
        height={h}
        className={'animation-logo'}
        animationData={TonviewerLottie}
        style={{ width: w, height: h }}
      />
    </div>
  );
};
