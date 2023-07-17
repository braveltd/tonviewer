import {
  ReactNode,
  ReactElement,
  memo,
  forwardRef
} from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import isUndefined from 'lodash/isUndefined';
import useDarkMode from 'use-dark-mode';
import 'tippy.js/dist/tippy.css';

type TooltipProps = {
  children: ReactElement
  tooltip: ReactNode
  placement?: TippyProps['placement']
  visible?: boolean
  opensOn?: 'hover' | 'click'
}

const Popover = forwardRef<HTMLDivElement, TooltipProps>(function _Popover ({
  children,
  tooltip,
  placement = 'top',
  visible,
  opensOn = 'click'
}, ref) {
  const darkMode = useDarkMode();

  return (
    <Tippy
      {...(isUndefined(visible) ? { trigger: opensOn === 'hover' ? 'mouseenter' : 'click' } : {})}
      className='popover'
      ref={ref}
      visible={visible}
      content={tooltip}
      animation='shift-away-subtle'
      arrow={false}
      interactive
      placement={placement}
      theme={darkMode.value ? 'dark' : 'light'}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </Tippy>
  );
});

export default memo(Popover);
