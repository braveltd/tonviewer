import React from 'react';
import { canUseDOM } from 'tonviewer-web/utils/canUseDom';

interface LayoutContextProps {
  width: number;
  isMobile: boolean;
}

const LayoutContext = React.createContext<LayoutContextProps>({
  width: 1200,
  isMobile: false
});

export const LayoutProvider = React.memo((props: { children: any }) => {
  const [width, setWidth] = React.useState(1200);
  const [isMobile, setIsMobile] = React.useState(false);
  const [init, setInit] = React.useState(false);
  React.useEffect(() => {
    if (!canUseDOM) {
      return;
    }
    if (!init) {
      setInit(true);
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    }
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [init]);

  return <LayoutContext.Provider value={{ width, isMobile }}>{props.children}</LayoutContext.Provider>;
});

export const useLayout = () => React.useContext(LayoutContext);
