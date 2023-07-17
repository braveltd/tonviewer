import { useResponsive } from '@farfetch/react-context-responsive';
import { FC, useState } from 'react';
import Lottie from 'lottie-react';
import styled, { useTheme } from 'styled-components';
import Avatar from '../avatar';
import { Column } from '../column';
import { Grid } from '../grid';
import { SecondaryText, Text } from '../text';
import { useEffectOnce } from 'react-use';
import { Box } from '../box';
import { Link } from '../link';
import { ShowMore } from '../show-more';

type TGalleryItem = {
  image: string
  label: string
  value: string
  link: string
}

type TGalleryProps = {
  items: TGalleryItem[]
  size?: 'small' | 'huge'
  isCollectibles?: boolean
  isToken?: boolean
  max?: number
  onViewAll?: () => void
  numOfNotFit?: number
}

const GalleryValue = styled(Text)`
  font-weight: 600;
`;

const TextWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AVATAR_SIZE = '56px';

const SmallCard = (props) => {
  const { isCollectibles, isToken } = props;
  const theme = useTheme();
  const [, setLottie] = useState<File>(null);

  useEffectOnce(() => {
    async function fetchLottie (lottie: string) {
      try {
        const response = await fetch(lottie);
        setLottie(await response.json());
      } catch { }
    }
    if (props?.metadata?.lottie) {
      fetchLottie(props.metadata.lottie);
    }
  });

  return (
    <Link href={props.link}>
      <GalleryItem gap={theme.spacing.small} columns={`${AVATAR_SIZE} 1fr`}>
        <Avatar
          isCollectibles={isCollectibles}
          src={props.image}
          alt={props.label}
          size={24}
        />
        <TextWrapper>
          {(isToken && props.value) && (
            <Text className={'token-value l2'}>
              {props.value}
            </Text>
          )}
          {isToken
            ? (
              <SecondaryText className={'symbol-token l2'}>
                {props.symbol}
              </SecondaryText>
              )
            : (
              <Text className={'name-item-galery l2'}>
                {props.label}
              </Text>
              )}
        </TextWrapper>
      </GalleryItem>
    </Link>
  );
};

const FullCard = (props) => {
  const theme = useTheme();
  const responsive = useResponsive();
  const imageSize = responsive.lessThan.sm ? 280 : 250;
  const [lottie, setLottie] = useState<File>(null);

  useEffectOnce(() => {
    async function fetchLottie (lottie: string) {
      try {
        const response = await fetch(lottie);
        setLottie(await response.json());
      } catch { }
    }
    if (props?.metadata?.lottie) {
      fetchLottie(props.metadata.lottie);
    }
  });

  return (
    <Link href={props.link}>
      <FullGalleryItem gap={theme.spacing.small}>
        {lottie
          ? <Box rounded squared><Lottie animationData={lottie} loop /></Box>
          : <Avatar squared src={props.image} alt={props.label} size={imageSize} />}

        <Column justify='center'>
          <SecondaryText>{props.label}</SecondaryText>
          <Column>
            <ShowMore
              text={props.value}
              textElement={GalleryValue}
              length={responsive.lessThan.sm ? 70 : 58}
            />
          </Column>
        </Column>
      </FullGalleryItem>
    </Link>
  );
};

const GridGalery = styled.div`
  display: grid;
  width: calc(100% + 4px);
  margin-left: -4px;
  grid-auto-rows: 32px;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 4px;
  row-gap: 4px;
  
  @media screen and (max-width: 1160px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 500px) {
    width: 100%;
    margin-left: 0px;
    
    column-gap: 6px;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ViewAllWrapper = styled.div<{isToken?: boolean}>`
  display: flex;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  
  .icon-wrapper {
    display: flex;
    width: 24px;
    height: 24px;
    background: ${props => props.theme.colors.background.active};
    border-radius: ${props => props.isToken ? '50%' : '4px'};
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    justify-content: center;
    
    .icon {
      color: ${props => props.theme.colors.icon.secondary};
      display: inline-flex;
      align-items: center;
    }
  }
`;

export const Gallery: FC<TGalleryProps> = ({
  items,
  size = 'small',
  isCollectibles,
  isToken,
  max = 0,
  onViewAll,
  numOfNotFit = 0
}) => {
  return (
    <GridGalery>
      {items.map((item, idx) => {
        return size === 'small'
          ? <SmallCard {...item} isCollectibles={isCollectibles} isToken={isToken} />
          : <FullCard {...item} />;
      })}
      {items.length === max && (
          <ViewAllWrapper onClick={onViewAll} isToken={!isCollectibles}>
            <GalleryItem columns={`${AVATAR_SIZE} 1fr`} isViewAll>
              <div className={'icon-wrapper'}>
                <span className={'icon-ic-chevron-right-16 icon'}></span>
              </div>
              <Text className={'l2'}>
                View all {numOfNotFit}
              </Text>
            </GalleryItem>
          </ViewAllWrapper>
      )}
    </GridGalery>
  );
};

const GalleryItem = styled(Grid)<{isViewAll?: boolean}>`
  //border-radius: ${(props) => props.theme.borderRadius.medium};
  display: flex;
  cursor: pointer;
  
  gap: 8px;
  width: 165px;
  height: 32px;
  box-sizing: border-box;
  align-items: center;

  @media screen and (min-width: 768px) {
    width: 156px;
    padding: 4px 12px 4px 4px;
    :hover {
      border-radius: 8px;
      background: ${(props: any) => props.theme.colors.background.hover};
    }
  }
  
  .name-item-galery {
    max-width: 108px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .token-value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 68px;
    
    @media screen and (max-width: 500px) {
      max-width: 68px;
      margin-right: 4px;
    }
  }
`;

const FullGalleryItem = styled(GalleryItem)`
  padding: ${(props) => props.theme.spacing.small};
`;
