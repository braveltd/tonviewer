import { useResponsive } from '@farfetch/react-context-responsive';
import { DEFAULT_FALLBACK_TEXT } from '../helpers/constants';
import { AppRoutes } from '../helpers/routes';
import { convertIpfsUrl } from '../helpers/url';

export const useNftListModel = (nfts: any[]) => {
  const responsive = useResponsive();

  return nfts.map((nft) => {
    const defaultImage = nft?.metadata?.image;
    const imgIndex = responsive.greaterThan.sm ? 2 : 1;
    const preview = nft?.previews?.[imgIndex]?.url ?? defaultImage;
    const image = preview ? convertIpfsUrl(preview) : '';
    const name = nft?.dns || nft?.metadata?.name || nft?.collection?.name || 'No metadata';

    return {
      image,
      label: name,
      value: nft?.metadata?.description || DEFAULT_FALLBACK_TEXT,
      link: AppRoutes.accountDetails(nft?.address),
      metadata: nft?.metadata
    };
  });
};
