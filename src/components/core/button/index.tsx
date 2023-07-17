import styled, { css } from 'styled-components';

export type TButtonVariant = 'primary' | 'secondary'
export type TButtonSize = 'small' | 'medium' | 'large'

type TButtonProps = Partial<{
  disabled: boolean
  variant: TButtonVariant
  size: TButtonSize
}>

export const Button = styled.button<TButtonProps>`
  ${props => props.variant === 'secondary' && css`
    background: ${props.theme.colors.button.buttonSecondaryBackground};
    color: ${props.theme.colors.button.buttonSecondaryForeground};

    &:hover {
      opacity: ${props.disabled ? 0.5 : 0.85};
    }

    &:active {
      opacity: 0.65;
    }
  `}

  ${props => props.variant === 'primary' && css`
    background: ${props.theme.colors.button.buttonPrimaryBackground};
    color: ${props.theme.colors.button.buttonPrimaryForeground};

    &:hover {
      opacity: ${props.disabled ? 0.5 : 0.85};
    }

    &:active {
      opacity: 0.65;
    }
  `}

  align-items: center;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  gap: 8px;
  justify-content: center;
  transition: all 0.2s ease-in;
  font-style: normal;
  font-weight: 590;
  font-size: 14px;
  line-height: 20px;
  padding: 12px 16px;
  
  ${(props) => props.disabled && css`
    opacity: 0.5;
  `};
}
`;
