import Lottie from 'lottie-web';
import { useResponsive } from '@farfetch/react-context-responsive';
import { FC, useEffect, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { MdVerified } from 'react-icons/md';
import { Column } from '../../../core/column';
import { Spacer } from '../../../core/spacer';
import { Text, TitleH2 } from '../../../core/text';
import { ExternalImage } from '../../../core/image';
import { NftAttributesSection } from './attributes';
import { NftCommonInfoSection, NftDetailsProps } from './common-info';
import { NftMetadataSection } from './metadata';
import { Box } from '../../../core/box';
import { Row } from '../../../core/row';
import { Card } from '../../../core/card';
import Image from 'next/image';
import Watermark from '../../../core/image/watermark.png';

const NFT_IMAGE_SIZE = '512px';

const NftImage = styled(ExternalImage)`
  border-radius: 12px;
  width: 100%;

  @media screen and (min-width: 768px) {
    width: ${NFT_IMAGE_SIZE};
  }
`;

// const NftVideo = styled.video`
//   border-radius: 16px;
//   width: 100%;

//   @media screen and (min-width: 768px) {
//     width: ${NFT_IMAGE_SIZE};
//   }
// `;

// const VideoNftFormat = ['mp4', 'mov', 'avi', 'webm', 'm4v', 'getgems'];

type NftDetailsPresenterProps = NftDetailsProps & {
  name: string;
  image: string;
  lottie?: any;
};

// const checkFormatVideo = (contentUrl: string | undefined) => {
//   return VideoNftFormat.some((format) => String(contentUrl).includes(format));
// };

// const checkIpfsInUrl = (ipfsUrl: string) => {
//   return ipfsUrl.includes('ipfs://');
// };

// const convertIpfsToHttps = (ipfsUrl: string) => {
//   return ipfsUrl.replaceAll('ipfs://', 'https://ipfs.io/ipfs/');
// };

const NftDetailsMobilePresenter: FC<NftDetailsPresenterProps> = ({
  approvedBy,
  collection,
  image,
  lottie,
  metadata,
  name,
  owner,
  verified
}) => {
  const theme = useTheme();
  const refBox = useRef(null);

  useEffect(() => {
    if (refBox && lottie) {
      Lottie.loadAnimation({
        container: refBox.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottie
      });
    }
  }, [refBox, lottie]);

  return (
      <Column fullWidth>
        <NftInfoWrapper>
          <Column fullWidth>
            {(image || lottie) && lottie
              ? (<Box rounded squared height='512px' ref={refBox} />)
              : (
                    <div className={'wrapper-img-info'}>
                      <div className={'img-wrapper'}>
                        {!verified && <Image src={Watermark} className={'watermark'} alt={'watermark'} />}
                        <NftImage src={image} alt={name} effect="blur" style={{ width: '100%' }} />
                      </div>
                    </div>
                )}
          </Column>
          <Card className={'card-wrapper'}>
            <div className={'title-nft'}>
              <Text className={'l1'}>
                {name}
              </Text>
              {!verified ? (
                  <div className={'unverified-container'}>
                    <Text className={'l2'}>Unverified</Text>
                  </div>
              ) : approvedBy.length === 0 ? null : (
                  <MdVerified
                      color={theme.colors.accent.address}
                      size='16px'
                  />
              )}
            </div>
            <NftCommonInfoSection
                approvedBy={approvedBy}
                collection={collection}
                owner={owner}
                metadata={metadata}
            />
            <NftAttributesSection metadata={metadata} />
            <NftMetadataSection metadata={metadata} />
          </Card>
        </NftInfoWrapper>
      </Column>
  );
};

const NftInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr);
  grid-column-gap: 16px;
  width: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: minmax(100px, 1fr);
    grid-template-rows: minmax(100px, 1fr) minmax(100px, 1f);
    grid-row-gap: 16px;
  }
  
  .title-nft {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  
  .unverified-container {
    padding: 2px 8px;
    background: ${props => props.theme.colors.accent.destructive};
    border-radius: 4px;
    span {
      color: white;
    }
  }
  
  .img-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    
    .watermark {
      position: absolute;
      width: 100%;
      z-index: 2;
      object-fit: cover;
      height: 100%;
    } 
  }
  
  //.address-wrapper-container {
  //  max-width: 300px;
  //}
  
  .card-wrapper {
    padding: 0px;
  }
  
  .title-nft {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 19px 24px;
    border-bottom: 1px solid ${props => props.theme.colors.separator.default};
  }
`;

const NftDetailsDesktopPresenter: FC<NftDetailsPresenterProps> = ({
  approvedBy,
  collection,
  image,
  lottie,
  metadata,
  name,
  owner,
  verified
}) => {
  const theme = useTheme();
  const refBox = useRef(null);

  useEffect(() => {
    if (refBox && lottie) {
      Lottie.loadAnimation({
        container: refBox.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottie
      });
    }
  }, [refBox, lottie]);

  return (
      <NftInfoWrapper>
        <Card className={'card-wrapper'}>
          <div className={'title-nft'}>
            <Text className={'l1'}>
              {name}
            </Text>
            {!verified ? (
                <div className={'unverified-container'}>
                  <Text className={'l2'}>Unverified</Text>
                </div>
            ) : approvedBy.length === 0 ? null : (
                <MdVerified
                    color={theme.colors.accent.address}
                    size='16px'
                />
            )}
          </div>
          <NftCommonInfoSection
            approvedBy={approvedBy}
            collection={collection}
            owner={owner}
            metadata={metadata}
          />
          <NftAttributesSection metadata={metadata} />
          <NftMetadataSection metadata={metadata} />
        </Card>
        {(image || lottie) && lottie
          ? (<Box rounded squared height='100%' ref={refBox} />)
          : (
              // <GridItem>
              //   {checkFormatVideo(metadata?.content_url)
              //     ? (
              //       <NftVideo autoPlay={true} loop muted>
              //         <source src={metadata?.content_url} />
              //       </NftVideo>
              //       )
              //     : (
              //       <NftImage
              //         src={checkIpfsInUrl(String(metadata?.image))
              //           ? convertIpfsToHttps(String(metadata?.image))
              //           : image
              //         }
              //         alt={name}
              //         effect="blur"
              //       />
              //       )
              //   }
              // </GridItem>
              <div className={'wrapper-img-info'}>
                <div className={'img-wrapper'}>
                  {!verified && <Image src={Watermark} className={'watermark'} alt={'watermark'} />}
                  <NftImage src={image} alt={name} effect="blur" style={{ width: '100%' }} />
                </div>
              </div>
            )}
      </NftInfoWrapper>
  );
};

export const NftDetailsPresenter: FC<NftDetailsPresenterProps> = (props) => {
  const responsive = useResponsive();
  const [lottie, setLottie] = useState<File>(null);

  async function fetchLottie (lottie: string) {
    try {
      const response = await fetch(lottie);
      setLottie(await response.json());
    } catch (error) {
      console.log(error);
    }
  }

  useEffectOnce(() => {
    if (props?.metadata?.lottie) {
      fetchLottie(props.metadata.lottie);
    }
  });

  return responsive.lessThan.md
    ? (
      <NftDetailsMobilePresenter {...props} lottie={lottie} />
      )
    : (
      <NftDetailsDesktopPresenter {...props} lottie={lottie} />
      );
};
