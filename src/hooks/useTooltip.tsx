import React from 'react';
import ReactDOM from 'react-dom';
import { css, cx } from '@linaria/core';
import { Placement } from '@popperjs/core';
import { usePopper as usePopperLib } from 'react-popper';
import { canUseDOM } from 'tonviewer-web/utils/canUseDom';

type ClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

const tooltipStyle = css`
  z-index: 3;
`;

export type TooltipProps = {
  placement: Placement;
  offset?: number;
  content: (ops: { hide: () => void }) => React.ReactNode;
  maxWidth?: number;
  autoWidth?: boolean;
};

interface TooltipContextProps {
  showTooltip: (e: ClickEvent, ops: TooltipProps) => void;
}

const TooltipContext = React.createContext<TooltipContextProps>({
  showTooltip: () => null
});

export const useTooltip = (ops: TooltipProps) => {
  const { showTooltip } = React.useContext(TooltipContext);
  function show(e: ClickEvent) {
    showTooltip(e, ops);
  }

  return [show];
};

interface TooltipComponentProps extends TooltipProps {
  id: number;
  removeTooltip: (id: number) => void;
  target: HTMLDivElement;
}

const Tooltip = React.memo((props: TooltipComponentProps) => {
  const { target, offset, maxWidth, autoWidth = true } = props;

  const [tooltipElement, setTooltipElement] = React.useState<HTMLElement | null>(null);

  const targetDom = React.useMemo(() => {
    if (!canUseDOM) {
      return null;
    }
    return document.getElementById('__next');
  }, [canUseDOM]);

  const { styles, attributes } = usePopperLib(target, tooltipElement, {
    strategy: 'absolute',
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
    props.removeTooltip(props.id);
  };

  React.useEffect(() => {
    const handleMove = (e: Event) => {
      const onTarget = e.target === target || target.contains(e.target as HTMLElement);
      const onTooltip = tooltipElement.contains(e.target as HTMLElement);
      if (!onTooltip && !onTarget) {
        hide();
      }
    };
    const handleScrollResize = (e: Event) => {
      hide();
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('scroll', handleScrollResize, { passive: true });
    document.addEventListener('resize', handleScrollResize, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('scroll', handleScrollResize);
      document.removeEventListener('resize', handleScrollResize);
    };
  }, [tooltipElement]);

  if (target) {
    return ReactDOM.createPortal(
      <div
        ref={setTooltipElement}
        style={
          {
            ...styles.popper,
            maxWidth: autoWidth ? undefined : `${maxWidth === undefined ? 250 : maxWidth}px`,
            width: autoWidth ? undefined : target.offsetWidth
          } as React.CSSProperties
        }
        className={cx(tooltipStyle)}
        {...attributes.Tooltip}
      >
        {props.content({ hide })}
      </div>,
      targetDom
    );
  } else {
    return null;
  }
});

let tId = 1;

type TooltipState = TooltipProps & {
  id: number;
  target: HTMLDivElement;
};

export const TooltipProvider = React.memo((props: { children: any }) => {
  const [tooltips, setTooltips] = React.useState<TooltipState[]>([]);

  const removeTooltip = React.useCallback(
    (id: number) => {
      setTooltips(pprs => pprs.filter(p => p.id !== id));
    },
    [setTooltips, tooltips]
  );

  const TooltipsRef = React.useRef<TooltipState[]>(tooltips);
  TooltipsRef.current = tooltips;

  const showTooltip = React.useCallback(
    (ev: ClickEvent, content: TooltipProps) => {
      const currentTooltip = tooltips.find(i => i.target === ev.currentTarget);
      if (currentTooltip) {
        return;
      }
      setTooltips(pprs => [
        ...pprs,
        {
          ...content,
          id: tId++,
          target: ev.currentTarget
        }
      ]);
    },
    [setTooltips, tooltips]
  );

  const context = React.useMemo(() => ({ showTooltip }), [showTooltip]);

  return (
    <TooltipContext.Provider value={context}>
      {tooltips.map(i => (
        <Tooltip key={'Tooltip' + i.id} {...i} removeTooltip={removeTooltip} />
      ))}
      {props.children}
    </TooltipContext.Provider>
  );
});
