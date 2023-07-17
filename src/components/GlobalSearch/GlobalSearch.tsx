import React from 'react';
import { css } from '@linaria/core';
import { HitsPopup } from './HitsPopup';
import { GlobalSearchHome } from './GlobalSearchHome';
import { useGlobalSearchController } from './GlobalSearchController';
import { useOutsideClick } from 'tonviewer-web/hooks/useOutsideClick';

const container = css`
  display: flex;
  flex-direction: column;
  position: relative;
  align-self: stretch;
`;

type Props = {
  onClick: () => void;
};

export const GlobalSearch = React.memo((props: Props) => {
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
    handleHitDelete,
    handleSearch
  } = useGlobalSearchController();

  const [active, setActive] = React.useState(false);

  const ref = useOutsideClick(() => {
    setIsFocused(false);
    setActive(false);
    setActiveIndex(-1);
  });

  return (
    <div className={container} ref={ref} onClick={props.onClick}>
      <GlobalSearchHome
        value={val}
        onSearch={handleSearch}
        onChange={v => {
          handleChange(v);
          setActive(true);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onClick={() => {
          setActive(true);
        }}
      />
      {!!(hits.length && isFocused && active) && (
        <HitsPopup
          items={hits}
          type={reqHits ? 'remote' : 'local'}
          onClick={handleHitClick}
          onDelete={handleHitDelete}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
});
