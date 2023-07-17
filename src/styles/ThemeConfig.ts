import { createGlobalStyle } from 'styled-components';

const baseTheme = {
  borderRadius: {
    small: '12px',
    medium: '16px'
  },
  font: {
    family: {
      // https://blog.hubspot.com/website/web-safe-html-css-fonts
      // https://github.com/necolas/normalize.css/issues/665
      // https://ianyepan.github.io/posts/system-default-monospace-fonts-pt1/
      // https://web.mit.edu/jmorzins/www/fonts.html
      monospace: [
        'ui-monospace',
        'SF Mono',
        'monospace',
        'Roboto Mono',
        'Menlo',
        'Consolas',
        'Courier'
      ].join(', '),
      serif: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto Mono',
        'Helvetica Neue',
        'Arial',
        'Tahoma',
        'Verdana',
        'sans-serif'
      ].join(', ')
    }
  },
  spacing: {
    tiny: '6px',
    small: '12px',
    medium: '16px',
    large: '24px',
    extra: '32px',
    huge: '48px'
  }
};

const lightColors = {
  background: {
    active: '#F1F3F5',
    main: '#F1F3F5',
    card: '#FFFFFF',
    controls: '#F5F5F5',
    hover: '#F1F3F5'
  },
  text: {
    primary: '#000000',
    secondary: '#7E868F',
    tertiary: '#A0A6AD',
    accent: '#2C7EDB'
  },
  separator: {
    default: 'rgba(131, 137, 143, 0.16)'
  },
  button: {
    buttonPrimaryBackground: '#000000',
    buttonPrimaryForeground: '#FFFFFF',
    buttonSecondaryBackground: '#F1F3F5',
    buttonSecondaryForeground: '#000000',
    buttonDestructiveBackground: '#F53C36',
    buttonHoverBackground: '#E6E8EA',
    buttonDestructiveForeground: '#FFFFFF'
    // buttonOverlayForeground: '#FFFFFF',
    // buttonOverlayBackground: 'rgba(0, 0, 0, 0.24)',
    // buttonOverlayLightForeground: '#FFFFFF',
    // buttonOverlayBlackBackground: '#000000'
  },
  field: {
    fieldBackground: '#F1F3F5',
    fieldBorder: 'rgba(131, 137, 143, 0.32)',
    fieldActiveBorder: 'rgba(131, 137, 143, 0.56)',
    fieldErrorBackground: 'rgba(245, 60, 54, 0.12)',
    fieldErrorBorder: '#F53C36'
  },
  icon: {
    white: '#fff',
    black: '#000',
    thirdly: '#BFBFBF',
    default: '#000000',
    primary: '#000000',
    secondary: '#7E868F',
    tertiary: '#A0A6AD'
  },
  accent: {
    address: '#0066CC',
    success: '#15AD61',
    caution: '#FED73B',
    destructive: '#F84C4C',
    version: '#6A2EB8',
    error: '#F53C36'
  },
  outline: {
    default: 'rgba(0, 0, 0, 0.05)'
  },
  method: {
    get: '#4DAEF4',
    disabled: '#E3E6E8',
    put: '#F3AD44',
    post: '#16B61D',
    delete: '#F14141'
  }
};

const lightTheme = {
  ...baseTheme,
  border: `1px solid ${lightColors.background.main}`,
  colors: lightColors,
  isDarktheme: false
};

const darkColors = {
  background: {
    active: '#2E3847',
    main: '#10161F',
    card: '#1D2633',
    controls: '#F5F5F5',
    hover: '#2E3847'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8994A3',
    tertiary: '#556170',
    accent: '#45AEF5'
  },
  separator: {
    default: 'rgba(131, 137, 143, 0.16)'
  },
  button: {
    buttonPrimaryBackground: '#45AEF5',
    buttonPrimaryForeground: '#FFFFFF',
    buttonSecondaryBackground: '#2E3847',
    buttonSecondaryForeground: '#FFFFFF',
    buttonDestructiveBackground: '#F53C36',
    buttonHoverBackground: '#E6E8EA',
    buttonDestructiveForeground: '#FFFFFF'
    // buttonOverlayForeground: '#FFFFFF',
    // buttonOverlayBackground: 'rgba(0, 0, 0, 0.24)',
    // buttonOverlayLightForeground: '#FFFFFF',
    // buttonOverlayBlackBackground: '#000000'
  },
  field: {
    fieldBackground: '#F1F3F5',
    fieldBorder: 'rgba(131, 137, 143, 0.32)',
    fieldActiveBorder: 'rgba(131, 137, 143, 0.56)',
    fieldErrorBackground: 'rgba(245, 60, 54, 0.12)',
    fieldErrorBorder: '#F53C36'
  },
  icon: {
    white: '#FFFFFF',
    black: '#000000',
    thirdly: '#BFBFBF',
    default: '#000000',
    primary: '#FFFFFF',
    secondary: '#8994A3',
    tertiary: '#A0A6AD'
  },
  accent: {
    address: '#45AEF5',
    success: '#14B869',
    caution: '#FED73B',
    destructive: '#F84C4C',
    version: '#6A2EB8'
  },
  outline: {
    default: 'rgba(0, 0, 0, 0.05)'
  },
  method: {
    get: '#4DAEF4',
    disabled: '#E3E6E8',
    put: '#F3AD44',
    post: '#16B61D',
    delete: '#F14141'
  }
};

const darkTheme = {
  ...baseTheme,
  border: `1px solid ${darkColors.background.main}`,
  colors: darkColors,
  isDarkTheme: true
};

export const themes = { light: lightTheme, dark: darkTheme };

export const GlobalStyles = createGlobalStyle`
  span .icon {
    color: ${props => props.theme.colors.icon.primary};
  }
  
  body {
    background: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
