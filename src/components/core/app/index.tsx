import { ThemeProvider } from 'styled-components';
import { ResponsiveProvider } from '@farfetch/react-context-responsive';
import { GlobalStyles } from '../../../styles/ThemeConfig';

const mediaQueries = {
  _initial: '(min-width: 0px) and (max-width: 319px)',
  xs: '(min-width: 320px) and (max-width: 575px)',
  sm: '(min-width: 576px) and (max-width: 959px)',
  md: '(min-width: 960px) and (max-width: 1279px)',
  lg: '(min-width: 1280px) and (max-width: 1799px)',
  xl: '(min-width: 1800px)'
};

export const App = ({ children, theme }) => {
  return (
    <ThemeProvider theme={theme as any}>
      <ResponsiveProvider mediaQueries={mediaQueries}>
        <GlobalStyles />
        {children}
      </ResponsiveProvider>
    </ThemeProvider>
  );
};
