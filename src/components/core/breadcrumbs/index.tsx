import { FC, Fragment } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { SecondaryText, Text } from '../text';
import { AppRoutes } from '../../../helpers/routes';

type BreadcrumbItemType = {
  isActive: boolean
  clickable: boolean
}

const BreadcrumbItem = styled.div<BreadcrumbItemType>`
  color: ${(props) =>
    props.isActive ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
  font-size: 14px;
  font-weight: 400;

  ${props => props.clickable && css`
    cursor: pointer;
    transition: color .2s ease-in;

    &:hover {
      color: ${props.theme.colors.text.secondary};
    }
  `}
`;

const BreadcrumbsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  align-self: flex-start;
  width: 100%;
  
  &.nospace {
    margin-top: 0;
  }
`;

type BreadcrumbType = {
  name: string;
  link?: string;
}

type BreadcrumbsProps = {
  className?: string
  items: BreadcrumbType[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, items }) => {
  return (
    <BreadcrumbsContainer className={className}>
      <Fragment>
        <Link href={AppRoutes.home()}>
          <SecondaryText className={'l2'} style={{ cursor: 'pointer' }}>
            Main
          </SecondaryText>
        </Link>
        <SecondaryText>
          <span className={'icon-ic-chevron-right-16'} />
        </SecondaryText>
      </Fragment>
      {items.filter(Boolean).map((crumb, idx) => {
        if (crumb.link) {
          return (
            <Fragment key={crumb.name}>
              <Link href={crumb.link}>
                <BreadcrumbItem
                  isActive={items.length - 1 === idx}
                  clickable={Boolean(crumb.link)}>
                  <SecondaryText className={'l2'} style={{ cursor: 'pointer' }}>
                    {crumb.name}
                  </SecondaryText>
                </BreadcrumbItem>
              </Link>
              <SecondaryText>
                {idx !== items.length - 1 && <span className={'icon-ic-chevron-right-16'} />}
              </SecondaryText>
            </Fragment>
          );
        }
        return (
          <Fragment key={crumb.name}>
            <BreadcrumbItem
              isActive={items.length - 1 === idx}
              clickable={Boolean(crumb.link)}>
              <Text className={'l2'}>
                {crumb.name}
              </Text>
            </BreadcrumbItem>
            {idx !== items.length - 1 && <span className={'icon-ic-chevron-right-16'} />}
          </Fragment>
        );
      })}
    </BreadcrumbsContainer>
  );
};
