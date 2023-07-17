import React, {
  ReactElement,
  ReactNode,
  CSSProperties,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import styled, { useTheme } from 'styled-components';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useMedia } from 'react-use';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

interface IBottomSheet {
  children: any;
}

const propsDef = { type: '', cb: () => {} };

export const BottomSheetContext = createContext({
  component: null,
  setComponent: (comp: any) => {},
  onOpen: (isOpen: boolean) => {},
  isOpen: false,
  props: propsDef,
  setProps: propsDef => {},
  isMobile: false
});

export const BottomSheetConsumer = BottomSheetContext.Consumer;

export const BottomSheetProvider: React.FC<IBottomSheet> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comp, setComponent] = useState(null);
  const [props, setProps] = useState(propsDef);
  const isMobile = useMedia('(max-width: 768px)');

  const handleOpenModal = (isopen: boolean) => {
    setIsOpen(isopen);
  };

  const handleSetComponent = (component: any) => {
    setComponent(component);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const states = {
    component: comp,
    setComponent: handleSetComponent,
    onOpen: handleOpenModal,
    isOpen,
    props,
    setProps,
    isMobile
  };

  return <BottomSheetContext.Provider value={states}>{children}</BottomSheetContext.Provider>;
};

const BottomSheetWrapper: CSSProperties = {
  position: 'fixed',
  height: '100%',
  width: '100%',
  zIndex: '99999',
  left: '0',
  top: '0',
  flexDirection: 'column',
  justifyContent: 'flex-end'
};

const BottomSheet: CSSProperties = {
  width: '100%',
  borderRadius: '8px 8px 0px 0px',
  padding: '24px',
  boxSizing: 'border-box'
};

interface IBSContainer {
  // eslint-disable-next-line no-undef
  childern: ReactNode | ReactElement | JSX.Element;
}

const defaultValue = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.3)',
  display: 'flex'
};

const DesktopWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  display: flex;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.64);
  justify-content: center;
  align-items: center;

  .DesktopContainer {
    position: relative;
    display: flex;
    background: ${props => props.theme.colors.background.card};
    border-radius: 16px;
  }

  .ButtonCloseModal {
    position: absolute;
    z-index: 1;
    padding: 8px;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    right: -44px;
    top: 0px;
  }

  .ButtonCloseModal:hover {
    opacity: 0.75;
  }
`;

export const BottomSheetContainer: React.FC<IBSContainer> = ({ childern }) => {
  const theme = useTheme();
  const refWrapper = useRef(null);
  const [height, setHeight] = useState(380);
  const { isOpen, onOpen, isMobile } = useContext(BottomSheetContext);
  const [isOpenModalPrev, setIsOpenModalPrev] = useState(false);
  const [{ y, background, bsBackground }, api] = useSpring(() => ({
    y: height,
    background: 'rgba(0, 0, 0, 0.0)',
    bsBackground: theme.colors.background.card
  }));

  const open = () => {
    api.start({
      y: 0,
      background: 'rgba(0, 0, 0, 0.1)',
      immediate: false
    });

    setIsOpenModalPrev(isOpen);
  };

  const close = () => {
    api.start({
      y: height,
      background: 'rgba(0, 0, 0, 0.0)',
      immediate: false,
      bsBackground: theme.colors.background.card
    });

    onOpen(false);
  };

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, canceled }) => {
      if (my < -70) cancel();
      if (last) {
        my > height * 0.3 || (vy > 0.3 && dy > 0) ? close() : open();
      } else api.start({ y: my, immediate: true });
    },
    { from: () => [0, y.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true }
  );

  const display = y.to(py => (py < height ? 'flex' : 'none'));

  useEffect(() => {
    if (isOpenModalPrev !== isOpen) {
      setIsOpenModalPrev(isOpen);
    }
  }, [api, isOpen, refWrapper]);

  useEffect(() => {
    if (isOpenModalPrev) {
      api.start(defaultValue);

      setTimeout(() => {
        const elem = document.getElementById('wrapperBottomSheet');
        if (elem) {
          setHeight(elem.clientHeight || 380);
        }
      }, 1000);
    } else if (!isOpenModalPrev) {
      close();
    }
  }, [isOpenModalPrev, theme]);

  if (!theme || (!isMobile && !isOpen)) return null;

  if (!isMobile && isOpen) {
    return (
      <DesktopWrapper>
        <div className={'DesktopContainer'}>
          {childern}
          <div className={'ButtonCloseModal'} onClick={() => close()}>
            <CloseIcon />
          </div>
        </div>
      </DesktopWrapper>
    );
  }

  return (
    <animated.div
      style={{
        display,
        background,
        ...BottomSheetWrapper
      }}
    >
      <animated.div style={{ display, flex: 1 }} onClick={() => onOpen(false)} />
      <div id={'wrapperBottomSheet'}>
        <animated.div
          {...bind()}
          style={{
            y,
            bottom: 0,
            touchAction: 'none',
            background: bsBackground,
            ...BottomSheet
          }}
        >
          {childern}
        </animated.div>
      </div>
    </animated.div>
  );
};
