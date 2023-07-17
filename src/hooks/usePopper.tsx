import React from 'react';
import ReactDOM from 'react-dom';
import { css, cx } from '@linaria/core';
import { Placement } from '@popperjs/core';
import { usePopper as usePopperLib } from 'react-popper';
import { canUseDOM } from 'tonviewer-web/utils/canUseDom';

type ClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

const popperStyle = css`
  z-index: 3;
`;

export type PopperProps = {
  placement: Placement;
  onShowCb?: () => void;
  onCloseCb?: () => void;
  offset?: number;
  content: (ops: { hide: () => void }) => React.ReactNode;
  useSameTarget?: boolean;
  closeOnClick?: boolean;
  closeOnLeave?: boolean;
  closeOnLeavePopper?: boolean;
  maxWidth?: number;
  autoWidth?: boolean;
};

interface PopperContextProps {
  showPopper: (e: ClickEvent, ops: PopperProps) => void;
}

const PopperContext = React.createContext<PopperContextProps>({
  showPopper: () => null
});

export const usePopper = (ops: PopperProps) => {
  const { showPopper } = React.useContext(PopperContext);
  function show(e: ClickEvent) {
    showPopper(e, ops);
  }

  return [show];
};

interface PopperComponentProps extends PopperProps {
  id: number;
  removePopper: (id: number) => void;
  target: HTMLDivElement;
}

const Popper = React.memo((props: PopperComponentProps) => {
  const {
    target,
    offset,
    useSameTarget = false,
    closeOnClick = true,
    closeOnLeave = false,
    closeOnLeavePopper = false,
    maxWidth,
    autoWidth = true
  } = props;

  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null);

  const targetDom = React.useMemo(() => {
    if (!canUseDOM) {
      return null;
    }
    return useSameTarget ? target : document.getElementById('__next');
  }, [canUseDOM]);

  const { styles, attributes } = usePopperLib(target, popperElement, {
    strategy: 'fixed',
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, offset]
        }
      }
    ]
  });

  const hide = () => {
    props.removePopper(props.id);
    if (props.onCloseCb) {
      props.onCloseCb();
    }
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const overPopper = !!popperElement?.contains(e.target as HTMLElement);
      if (!overPopper) {
        hide();
      }

      if (closeOnClick) {
        hide();
      }
    };

    const handleLeave = () => {
      if (closeOnLeave) {
        hide();
      }
    };

    const handlePopperLeave = (e: MouseEvent) => {
      const overPopper = !!popperElement?.contains(e.target as HTMLElement);

      if (closeOnLeavePopper && overPopper) {
        hide();
      }
    };

    const handleScroll = (e: Event) => {
      hide();
    };

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    target.addEventListener('mouseleave', handleLeave, { passive: true });
    if (popperElement) {
      popperElement.addEventListener('mouseleave', handlePopperLeave, { passive: true });
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      target.removeEventListener('mouseleave', handleLeave);
      if (popperElement) {
        popperElement.removeEventListener('mouseleave', handlePopperLeave);
      }
    };
  }, [popperElement]);

  if (targetDom) {
    return ReactDOM.createPortal(
      <div
        ref={setPopperElement}
        style={
          {
            ...styles.popper,
            maxWidth: autoWidth ? undefined : `${maxWidth === undefined ? 250 : maxWidth}px`,
            width: autoWidth ? undefined : target.offsetWidth
          } as React.CSSProperties
        }
        className={cx(popperStyle)}
        {...attributes.popper}
      >
        {props.content({ hide })}
      </div>,
      targetDom
    );
  } else {
    return null;
  }
});

let pId = 1;

type PopperState = PopperProps & {
  id: number;
  target: HTMLDivElement;
};

export const PopperProvider = React.memo((props: { children: any }) => {
  const [poppers, setPoppers] = React.useState<PopperState[]>([]);

  const removePopper = React.useCallback(
    (id: number) => {
      setPoppers(pprs => pprs.filter(p => p.id !== id));
    },
    [setPoppers, poppers]
  );

  const poppersRef = React.useRef<PopperState[]>(poppers);
  poppersRef.current = poppers;

  const showPopper = React.useCallback(
    (ev: ClickEvent, content: PopperProps) => {
      if (ev.stopPropagation) {
        ev.stopPropagation();
      }
      if (content.onShowCb) {
        content.onShowCb();
      }
      const findOpenedPopper = poppersRef.current.find(i => i.id === pId - 1);
      if (findOpenedPopper) {
        removePopper(findOpenedPopper.id);
        if (findOpenedPopper.onCloseCb) {
          findOpenedPopper.onCloseCb();
        }
        if (findOpenedPopper.target === ev.currentTarget) {
          return;
        }
      }
      const target = ev.currentTarget;
      setPoppers(pprs => [
        ...pprs,
        {
          ...content,
          id: pId++,
          target
        }
      ]);
    },
    [setPoppers]
  );

  const context = React.useMemo(() => ({ showPopper }), [showPopper]);

  return (
    <PopperContext.Provider value={context}>
      {poppers.map(i => (
        <Popper key={'popper' + i.id} {...i} removePopper={removePopper} />
      ))}
      {props.children}
    </PopperContext.Provider>
  );
});
