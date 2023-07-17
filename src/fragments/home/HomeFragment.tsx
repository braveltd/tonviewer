import React, { memo, useEffect, useState } from 'react';
import { css } from '@linaria/core';
import { Logo } from 'tonviewer-web/components/Home/Logo';
import { HomeStatistic, StatisticProps } from 'tonviewer-web/components/Home/Statistic';
import { Layout } from 'tonviewer-web/components/core/layout';
import { GlobalSearch } from 'tonviewer-web/components/GlobalSearch/GlobalSearch';

const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 928px;
  width: 100%;
  gap: 48px;
  height: calc(100vh - 230px);

  @media (max-height: 600px) {
    height: auto;
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 40px 0 240px 0;
  }
`;

const titleStyle = css`
  font-style: normal;
  font-weight: 700;
  font-size: 52px;
  text-align: center;

  span {
    background: var(--titleLinearColor);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: blue;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const HomeFragment = memo((props: { data: StatisticProps | null }) => {
  const [isPlay, setIsPlay] = useState(false);

  const handlePlay = () => {
    setIsPlay(true);
    setTimeout(() => setIsPlay(false), 10);
  };

  useEffect(() => {
    setIsPlay(false);

    handlePlay();
  }, []);

  return (
    <Layout>
      <div className={container}>
        <Logo isPlay={isPlay} />
        <div className={titleStyle}>
          <span>Tonviewer</span> — the only explorer <br />
          you need for TON
        </div>
        <GlobalSearch onClick={handlePlay} />
      </div>
      {!!props.data && <HomeStatistic {...props.data} />}
    </Layout>
  );
});
