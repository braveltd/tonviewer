import React, { memo, useMemo } from 'react';
import { useMedia } from 'react-use';
import { css, cx } from '@linaria/core';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { unixTimeToMonth } from 'tonviewer-web/utils/dateTimeFormatter';
import { Body2, TitleH3 } from 'tonviewer-web/utils/textStyles';

const container = css`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: 1;
  background: rgba(44, 126, 219, 0.04);
  border: 1px solid rgba(131, 137, 143, 0.16);
  border-radius: 12px;
`;

const topContent = css`
  padding-top: 20px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const titleStyle = cx(
  Body2,
  css`
    color: var(--iconSecondary);
  `
);

const textStyle = cx(
  TitleH3,
  css`
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: var(--textPrimary);
  `
);

type ChartCompProps = {
  value: {
    date: string;
    value: number;
  }[];
  currentPrice: string;
};

const ChartComp = memo((props: ChartCompProps) => {
  const isMobile = useMedia('(max-width: 768px)');
  return (
    <div className={container}>
      <div className={topContent}>
        <div className={titleStyle}>Toncoin Price</div>
        <div className={textStyle}>${props.currentPrice}</div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={500}
          height={200}
          data={props.value}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 14
          }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#2E84E5" stopOpacity={1} />
              <stop offset="90%" stopColor="#2E84E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide={true} domain={['dataMin', 'dataMax']} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fontWeight: 400, fill: 'var(--iconSecondary)' }}
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            minTickGap={isMobile ? 20 : 90}
          />
          <Area type="linear" dataKey="value" strokeWidth={2} stroke="#2E84E5" fill="url(#colorGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

type Props = {
  data: { x: number; y: number }[];
};

export const PriceChart = memo((props: Props) => {
  const memoizedData = useMemo(() => {
    const currentPrice = props.data[props.data.length - 1].y.toFixed(5);
    const parsed = props.data.map(i => ({ date: unixTimeToMonth(i.x), value: i.y }));
    return {
      value: parsed,
      currentPrice
    };
  }, [props.data]);

  return <ChartComp {...memoizedData} />;
});
