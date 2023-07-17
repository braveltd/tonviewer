import React from 'react';
import { css, cx } from '@linaria/core';
import { UIcon } from 'tonviewer-web/UComponents/UIcon';
import IcSearch from 'tonviewer-web/assets/icons/ic-search-16.svg';
import IcClose from 'tonviewer-web/assets/icons/ic-xmark-circle-16.svg';

const searchContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  position: relative;
  border-radius: 12px;
`;

const iconStyle = css`
  position: absolute;
  pointer-events: none;
  left: 20px;
`;

const inputStyle = css`
  color: var(--textPrimary);
  padding: 0 48px 0 48px;
  outline: none;
  width: 100%;
  height: 56px;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  border-radius: 12px;
  background-color: var(--backgroundContent);
  border: 1px solid var(--separatorCommon);

  &.headed {
    height: 44px;
    background-color: var(--backgroundMain);
    border: none;
  }

  &::placeholder {
    color: var(--textSteelGray);
    opacity: 1;
  }
`;

const clearButton = css`
  position: absolute;
  right: 14px;
  width: 24px;
  height: 24px;
`;

type Props = {
  value?: string;
  onChange?: (v: string) => void | boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  inHead?: boolean;
};

export const GlobalSearchSmall = React.memo((props: Props) => {
  const [val, setVal] = React.useState(props.value || '');
  const ref = React.useRef<HTMLInputElement>(null);

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
    <div className={cx(searchContainer, props.inHead && 'headed')} tabIndex={-1}>
      <UIcon className={iconStyle} icon={<IcSearch />} color="var(--iconSecondaryBlue)" />
      <input
        ref={ref}
        className={cx(inputStyle, props.inHead && 'headed')}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        placeholder="Search"
        value={val}
        onChange={e => handleChange(e.target.value)}
      />
      {!!val && (
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
      )}
    </div>
  );
});
