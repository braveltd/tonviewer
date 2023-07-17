import React from 'react';
import 'styled-components';

interface IThemeColors {
  background: {
    active: React.CSSProperties['color'];
    main: React.CSSProperties['color'];
    card: React.CSSProperties['color'];
    controls: React.CSSProperties['color'];
  };
  text: {
    tertiary: React.CSSProperties['color'];
    primary: React.CSSProperties['color'];
    secondary: React.CSSProperties['color'];
    accent: React.CSSProperties['color'];
  };
  separator: {
    default: React.CSSProperties['color'];
  };
  icon: {
    white: React.CSSProperties['color'];
    black: React.CSSProperties['color'];
    thirdly: React.CSSProperties['color'];
    default: React.CSSProperties['color'];
    primary: React.CSSProperties['color'];
    secondary: React.CSSProperties['color'];
    tertiary: React.CSSProperties['color'];
  };
  accent: {
    address: React.CSSProperties['color'];
    success: React.CSSProperties['color'];
    caution: React.CSSProperties['color'];
    destructive: React.CSSProperties['color'];
    version: React.CSSProperties['color'];
  };
  button: {
    buttonPrimaryBackground: React.CSSProperties['color'],
    buttonPrimaryForeground: React.CSSProperties['color'],
    buttonSecondaryBackground: React.CSSProperties['color'],
    buttonSecondaryForeground: React.CSSProperties['color'],
    buttonDestructiveBackground: React.CSSProperties['color'],
    buttonHoverBackground: React.CSSProperties['color'],
    buttonDestructiveForeground: React.CSSProperties['color']
  };
  outline: {
    default: React.CSSProperties['color'];
  };
  method: {
    get: React.CSSProperties['color'];
    disabled: React.CSSProperties['color'];
    put: React.CSSProperties['color'];
    post: React.CSSProperties['color'];
    delete: React.CSSProperties['color'];
  };
}

type TBorderRadius = 'small' | 'medium'

type TSpacing = 'tiny' | 'small' | 'medium' | 'large' | 'extra' | 'huge'

declare module 'styled-components' {
  export interface DefaultTheme {
    border: React.CSSProperties['border'];
    borderRadius: Record<TBorderRadius, React.CSSProperties['height']>
    colors: IThemeColors;
    font: {
      family: {
        monospace: React.CSSProperties['fontFamily']
        serif: React.CSSProperties['fontFamily']
      }
    };
    spacing: Record<TSpacing, React.CSSProperties['height']>
    isDarkTheme: boolean
  }
}
