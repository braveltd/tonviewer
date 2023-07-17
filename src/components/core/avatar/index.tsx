import { FC } from 'react';
import styled from 'styled-components';
import { convertIpfsUrl } from '../../../helpers/url';
import { ExternalImage, InternalImage } from '../image';

type AvatarProps = {
  bg?: string;
  bordered?: boolean;
  external?: boolean;
  squared?: boolean;
  src: string;
  alt?: string;
  size?: number | string;
  isCollectibles?: boolean
}

export const ImgWrapper = styled.div<{
  isCollectibles: any,
  width: any,
  height: any
}>`
  border-radius: ${props => props.isCollectibles ? '4px' : '50%'};
  overflow: hidden;
  min-height: ${props => `${props.height}px`};
  min-width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  width: ${props => `${props.width}px`};
  
  .img-avatar-small {
    background: ${props => props.theme.colors.separator.default};
  }
`;

const NoImageWrapper = styled.div`
  display: flex;
  background: ${props => props.theme.colors.background.controls};
  color: ${props => props.theme.colors.icon.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar: FC<AvatarProps> = ({
  bg = 'transparent',
  src,
  size = 40,
  alt = '',
  squared = false,
  external = true,
  bordered = true,
  isCollectibles = false
}) => {
  const Image = external ? ExternalImage : InternalImage;

  return (
    <ImgWrapper
      isCollectibles={isCollectibles}
      width={size}
      height={size}>
      {src
        ? (<Image
            className={'img-avatar-small'}
            src={convertIpfsUrl(src)}
            alt={''}
            height={size}
            width={size}
            wrapperProps={{
              style: {
                height: size,
                width: size
              }
            }}
          />)
        : <NoImageWrapper style={{ width: size, height: size }}>
            <span className={'icon-ic-nft-16'}></span>
          </NoImageWrapper>
      }
    </ImgWrapper>
  );
};

export default Avatar;
