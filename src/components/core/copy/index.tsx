import styled, { useTheme } from 'styled-components';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Box } from '../box';
import { TWO_SECONDS } from '../../../helpers/time';
import { useIsMobile } from '@farfetch/react-context-responsive';

type TCopyProps = {
  textToCopy: string
  tooltipText?: string
  visible?: boolean
  className?: string
}

const CopyBox = styled(Box)`
  visibility: hidden;
  
  span {
    color: ${props => props.theme.colors.icon.secondary};
  };
  
  span: hover {
    color: ${props => props.theme.colors.icon.primary};
  };
  
  .ic-ic-done-16 {
    color: ${props => props.theme.colors.accent.success} !important;
  };
  
  &.visible {
    cursor: pointer;
    visibility: visible;
  }
`;

const WrapperCopy = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: 100%;
  position: relative;
  
  span {
    user-select: none;
  }
`;

const CopyContainer = styled.div`
  //position: absolute;
  //right: -26px;
`;

export const Copy: FC<PropsWithChildren<TCopyProps>> = ({
  children,
  textToCopy,
  tooltipText = 'Copied!',
  visible = false,
  className = ''
}) => {
  const { isMobile } = useIsMobile();
  const timeoutRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(visible || isMobile);
  const theme = useTheme();

  useEffect(() => {
    if (isCopied) {
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        setShowCopy(false);
      }, TWO_SECONDS);
    }

    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [isCopied]);

  const handleCopy = (event: any) => {
    event.preventDefault();
    window.navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    event.stopPropagation();
  };

  return (
    <WrapperCopy
        className={className}
        onClick={(event) => {
          handleCopy(event);
        }}
        onMouseEnter={() => {
          if (!isMobile) setShowCopy(true);
        }}
        onMouseLeave={() => {
          if (!isCopied && !isMobile) setShowCopy(visible);
        }}>
      {children}
      <CopyContainer
          style={{ display: (visible || showCopy || isMobile) ? 'block' : 'none', height: '16px' }}
          onClick={(event: any) => handleCopy(event)}>
          <CopyBox className={showCopy || isMobile || !children ? 'visible' : ''}>
            {isCopied
              ? <span className={'icon-ic-done-16'} style={{ color: theme.colors.accent.success }} />
              : <span className={'icon-ic-copy-outline-16'} />}
          </CopyBox>
      </CopyContainer>
    </WrapperCopy>
  );
};
