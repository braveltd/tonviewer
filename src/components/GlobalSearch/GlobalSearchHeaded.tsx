import React from 'react';
import { css, cx } from '@linaria/core';
import { HitsPopup } from './HitsPopup';
import { useOutsideClick } from 'tonviewer-web/hooks/useOutsideClick';
import { useGlobalSearchController } from './GlobalSearchController';
import { GlobalSearchSmall } from './GlobalSearchSmall';

const container = css`
  display: flex;
  flex-direction: column;
  position: relative;
  align-self: stretch;
  flex-grow: 1;

  &.headed {
    max-width: 572px;
  }
`;

export const GlobalSearchHeaded = React.memo((props: { inHead?: boolean }) => {
  const {
    activeIndex,
    setActiveIndex,
    isFocused,
    setIsFocused,
    val,
    handleChange,
    hits,
    reqHits,
    handleHitClick,
    handleHitDelete
  } = useGlobalSearchController();

  const ref = useOutsideClick(() => {
    setIsFocused(false);
    setActiveIndex(-1);
  });

  return (
    <div className={cx(container, props.inHead && 'headed')} ref={ref}>
      <GlobalSearchSmall
        value={val}
        inHead={props.inHead}
        onChange={(v) => {
          handleChange(v);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsFocused(true)}
      />
      {!!hits.length && isFocused && (
        <HitsPopup
          items={hits}
          type={reqHits ? 'remote' : 'local'}
          onClick={handleHitClick}
          onDelete={handleHitDelete}
          activeIndex={activeIndex}
          inHead={props.inHead}
        />
      )}
    </div>
  );
});
