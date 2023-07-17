import isUndefined from 'lodash/isUndefined';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import useCollapse from 'react-collapsed';
import styled, { css } from 'styled-components';
import { Column } from '../column';
import { Row } from '../row';

type CollapseProps = {
  defaultActive?: boolean
  isActive?: boolean
  title: ReactNode
  isLast?: boolean
  isMeta?: boolean
}

export const WrapperTitleNftInfo = styled.div<{ isLast?: boolean }>`
  padding: 19px 24px;
  border-top: 1px solid ${props => props.theme.colors.separator.default};
  ${props => !props.isLast && css`
    border-bottom: 1px solid ${props => props.theme.colors.separator.default};
  `};
`;

export const Collapse: FC<PropsWithChildren<CollapseProps>> = ({
  children,
  defaultActive = false,
  isActive,
  title,
  isLast = false,
  isMeta = false
}) => {
  const [isExpanded, setExpanded] = useState(defaultActive);
  const { getToggleProps, getCollapseProps } = useCollapse({
    defaultExpanded: defaultActive,
    isExpanded
  });

  useEffect(() => {
    if (!isUndefined(isActive)) {
      setExpanded(isActive);
    }
  }, [isActive]);

  return (
    <Column>
      <CollapseButton
        {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded)
        })}>
        <WrapperTitleNftInfo isLast={isLast}>
          <Row align='center' justify='space-between'>
            {title}
            <ArrowCircle>
              <span
                className={'icon-ic-chevron-down-16 icon'}
                style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              </span>
            </ArrowCircle>
          </Row>
        </WrapperTitleNftInfo>
      </CollapseButton>
      <CollapseChildren {...getCollapseProps()} isMeta={isMeta}>
        {children}
      </CollapseChildren>
    </Column>
  );
};

const CollapseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0%;
  outline: none;
  width: 100%;
`;

const ArrowCircle = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  width: 24px;
  
  .icon-ic-chevron-down-16 {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const CollapseChildren = styled.div<{ isMeta?: boolean }>`
  padding: 20px 24px;
  ${props => props.isMeta && css`
    padding: 0 24px 24px;

    pre {
      margin: 0;
      border-radius: 8px;
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      
      .copy-container {
        position: absolute;
        top: 12px;
        right: 12px;
        width: auto;
      }
    }
  `};
`;
