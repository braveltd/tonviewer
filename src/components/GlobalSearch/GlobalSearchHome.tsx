import React from 'react';
import { css } from '@linaria/core';
import { useLayout } from 'tonviewer-web/hooks/useLayout';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import IcEnter from 'tonviewer-web/assets/icons/ic-enter-16.svg';
import IcSearch from 'tonviewer-web/assets/icons/ic-search-16.svg';
import IcClose from 'tonviewer-web/assets/icons/ic-xmark-circle-16.svg';

const searchContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  position: relative;
  margin: -8px;
  border-radius: 40px;
  border: 8px solid transparent;
  transition: border 0.2s ease-in-out;

  &:focus-within {
    border: 8px solid var(--fieldSecondaryBorder);
  }
`;

const iconStyle = css`
  position: absolute;
  pointer-events: none;
  left: 28px;
`;

const inputStyle = css`
  color: var(--textPrimary);
  padding: 0 150px 0 64px;
  outline: none;
  width: 100%;
  height: 64px;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  border-radius: 36px;
  border: 1px solid var(--separatorCommon);
  background-color: var(--fieldBackgroundSecondary);
  transition: all 0.2s ease-in-out;

  &:focus {
    border: 1px solid var(--fieldAccentBorder);
    background-color: var(--globalInputHoverBackground);
  }

  &::placeholder {
    color: var(--textSteelGray);
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 0 100px 0 64px;
  }
`;

const buttonsContainer = css`
  position: absolute;
  right: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

const clearButton = css`
  width: 24px;
  height: 24px;
`;

const findButton = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  width: 97px;
  height: 48px;
  background-color: var(--accentBlue);
  gap: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 48px;
    border-radius: 48px;
  }
`;

const findButtonTitle = css`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: var(--textContrast);

  @media (max-width: 768px) {
    display: none;
  }
`;

type Props = {
  value?: string;
  onClick?: () => void;
  onChange?: (v: string) => void | boolean;
  onSearch?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const GlobalSearchHome = React.memo((props: Props) => {
  const { isMobile } = useLayout();
  const [val, setVal] = React.useState(props.value || '');
  const ref = React.useRef<HTMLInputElement>(null);

  const placeholderText = isMobile ? 'Search' : 'Search by address, name or transaction';

  const handleChange = (v: string) => {
    let stopUpdate: boolean = false;
    if (props.onChange) {
      stopUpdate = !!props.onChange(v);
    }
    if (!stopUpdate) {
      setVal(v);
    }
  };

  React.useEffect(() => {
    setVal(props.value || '');
  }, [props.value]);

  return (
    <div className={searchContainer} tabIndex={-1}>
      <UIcon icon={<IcSearch />} className={iconStyle} color="var(--iconSecondaryBlue)" />
      <input
        autoFocus={!isMobile}
        ref={ref}
        className={inputStyle}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        placeholder={placeholderText}
        value={val}
        onChange={e => handleChange(e.target.value)}
      />
      {!!val && (
        <div className={buttonsContainer}>
          <UIcon
            icon={<IcClose />}
            className={clearButton}
            color="var(--iconSecondaryBlue)"
            onClick={() => {
              handleChange('');
              if (ref.current) {
                ref.current.focus();
              }
            }}
          />
          <div className={findButton} onClick={props.onSearch}>
            <div className={findButtonTitle}>Find</div>
            <UIcon icon={<IcEnter />} color="transparent" strokeColor="var(--textContrast)" />
          </div>
        </div>
      )}
    </div>
  );
});
