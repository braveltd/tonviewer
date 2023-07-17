import {
  FC,
  ReactNode,
  memo,
  PropsWithChildren,
  useRef,
  useEffect,
  useState
} from 'react';
import { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { TWO_SECONDS } from '../../../helpers/time';
import styled, { css } from 'styled-components';

type TooltipProps = {
  tooltip: ReactNode
  placement?: TippyProps['placement']
  closeDelay?: number
  opensOn?: 'hover' | 'click'
  disabled?: boolean
  offset?: any
  width?: number
  isLeft?: boolean
  hidden?: boolean
  operation?: boolean
  visible?: boolean
  viewAll?: boolean
}

const TooltipContainer = styled.div`
  //position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  
  .children-tooltip {
    display:table;
    table-layout:fixed;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    //margin-right: 20px;
    
    span {
      display:table-cell;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

const TooltipData = styled.div<{width: number, isLeft: boolean}>`
  position: absolute;
  max-width: 428px;
  padding: 24px;
  box-sizing: border-box;
  cursor: default;
  z-index: 99999;
  top: 0;
  border-radius: 12px;
  background: ${props => props.theme.colors.background.card};
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04)) drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.12));
  -webkit-filter: none;
  -webkit-box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04), 0px 4px 20px rgba(0, 0, 0, 0.12);

  ${props => props.theme.isDarkTheme && css`
    background: ${props => props.theme.colors.background.main};
  `}
  
  .tooltip-data-wrapper {
    word-break: break-all;
    white-space: pre-line;
  }
  
  ::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 20px;
    background: transparent;
    bottom: -20px;
    left: 0;
  }

  ::after {
    position: absolute;
    content: '';
    border: 10px solid transparent;
    border-top: 10px solid ${props => props.theme.colors.background.card};
    bottom: -19px;
    left: 22px;

    ${props => props.theme.isDarkTheme && css`
      border-top: 10px solid ${props => props.theme.colors.background.main};
    `};
  }

  ${props => props.isLeft && css`
    @media screen and (min-width: ${props.width + 1160 + 120}px) {
      border: none;

      ::before {
        position: absolute;
        content: '';
        width: 20px;
        height: 50%;
        background: transparent;
        top: 0px;
        left: auto;
        right: -20px;
      }

      ::after {
        position: absolute;
        content: '';
        border: 10px solid transparent;
        border-left: 10px solid ${props => props.theme.colors.background.card};
        top: 20px;
        bottom: auto;
        left: auto;
        right: -19px;
      }

      background: ${props => props.theme.colors.background.card};
    }
  `}
`;

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  children,
  tooltip,
  placement = 'top',
  disabled = false,
  closeDelay = TWO_SECONDS,
  opensOn = 'hover',
  width = 428,
  isLeft = false,
  hidden = false,
  operation = false,
  visible = false
}) => {
  const refChildren = useRef(null);
  const tooltipRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const [posTop, setPosTop] = useState(-1);
  const [posLeft, setPosLeft] = useState(-1);
  const show = operation || hidden;

  const setPosition = () => {
    const posY: number = refChildren.current.offsetTop;
    const posX: number = refChildren.current.offsetLeft;
    const h2: number = refChildren.current.offsetHeight;
    const h: number = tooltipRef.current.offsetHeight;

    if (isLeft && window.innerWidth >= (1160 + width + 120)) {
      setPosLeft(posX - (width) - 5);
      setPosTop(posY - 22);
    } else {
      setPosLeft(posX - 24);
      setPosTop(posY - (h + h2 + 40));
    }
  };

  useEffect(() => {
    if (refChildren?.current && tooltipRef?.current) {
      setPosition();

      addEventListener('resize', () => {
        if (refChildren?.current && tooltipRef?.current) {
          setPosition();
        }
      });
    }
  }, [refChildren, tooltipRef, isShow]);

  return (
      <TooltipContainer>
        <TooltipData
            width={width}
            isLeft={isLeft}
            onMouseEnter={() => setIsShow(visible || show)}
            onMouseLeave={() => setIsShow(false)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            style={{
              width,
              top: posTop,
              left: posLeft,
              display: isShow ? 'block' : 'none'
            }}>
          <div className={'tooltip-data-wrapper'} ref={tooltipRef}>
            {tooltip}
          </div>
        </TooltipData>
        <div className={'children-tooltip'} ref={refChildren}
          onMouseEnter={() => setIsShow(visible || show)}
          onMouseLeave={() => setIsShow(false)}>
          {children}
        </div>
      </TooltipContainer>
  );
};

export default memo(Tooltip);
