import { FC, ReactNode } from 'react';
import { useTheme } from 'styled-components';
import { NftItem } from 'tonapi-sdk-js';
import { addressToBase64, formatAddress, isValidAddress } from '../../../../helpers';
import { useFormattedAddressLength } from '../../../../helpers/hooks';
import { SecondaryText, Text } from '../../../core/text';
import { ExternalIcon } from '../../../core/icons';
import { Row } from '../../../core/row';
import { Grid, GridItem } from '../../../core/grid';
import { Column } from '../../../core/column';
import { ExternalImage } from '../../../core/image';
import { Link } from '../../../core/link';
import isEmpty from 'lodash/isEmpty';
import { DEFAULT_FALLBACK_TEXT } from '../../../../helpers/constants';
import { AppRoutes } from '../../../../helpers/routes';
import { Copy } from '../../../core/copy';
import { AddressSlicer } from '../../transactions/history/sub-cells';
import { useMedia } from 'react-use';

export type NftDetailsProps = Partial<{
  approvedBy: NftItem['approvedBy']
  verified: NftItem['verified']
  collection: NftItem['collection']
  metadata: NftItem['metadata']
  owner: NftItem['owner']
}>;

const getFaviconUrl = (link: string) => {
  try {
    const origin = new URL(link).origin;
    return `${origin}/favicon.ico`;
  } catch {
    try {
      const origin = new URL(`https://${link}`).origin;
      return `${origin}/favicon.ico`;
    } catch {
      return '';
    };
  }
};

export const NftCommonInfoSection: FC<NftDetailsProps> = ({ approvedBy, collection, metadata, owner }) => {
  const addressHalfLength = useFormattedAddressLength({});
  const theme = useTheme();

  return (
      <Grid style={{ padding: '20px' }} gap={'16px'}>
        {owner && (
            <GridItem>
              <LabelValue
                  label='Owner'
                  link={AppRoutes.accountDetails(owner.address)}
                  value={formatAddress(addressToBase64(owner.address), addressHalfLength)}
                  textToCopy={addressToBase64(owner.address)}
                  isAddress
              />
            </GridItem>
        )}
        {!isEmpty(approvedBy) && (
            <GridItem>
              <LabelValue
                  label='Approved by'
                  value={approvedBy?.join(', ') || DEFAULT_FALLBACK_TEXT}
              />
            </GridItem>
        )}
        {metadata?.external_url && (
            <GridItem>
              <LabelValue
                  label='External Link'
                  link={metadata?.external_url}
                  value={(
                      <Row align='center' gap={theme.spacing.tiny}>
                        <Text>{metadata?.marketplace || metadata?.external_url}</Text>
                        <ExternalIcon />
                      </Row>
                  )}
              />
            </GridItem>
        )}
        {collection && (
            <>
              <GridItem>
                <LabelValue
                    label='Collection'
                    value={collection.name}
                    link={AppRoutes.accountDetails(collection.address)}
                />
              </GridItem>
              <GridItem>
                <LabelValue
                    label='Collection Address'
                    value={formatAddress(addressToBase64(collection.address), addressHalfLength)}
                    link={AppRoutes.accountDetails(collection.address)}
                    textToCopy={addressToBase64(collection.address)}
                    isAddress
                />
              </GridItem>
            </>
        )}
        {metadata?.description && (
            <GridItem>
              <LabelValue label='Description' value={metadata?.description} />
            </GridItem>
        )}
        {metadata?.social_links && (
            <GridItem>
              <SecondaryText>Socials</SecondaryText>
              <Column>
                {metadata.social_links?.map((link) => (
                    <Link key={link} href={link}>
                      <Row align='center' gap={theme.spacing.tiny}>
                        <ExternalImage height={12} width={12} src={getFaviconUrl(link)} />
                        {/* <Text color={theme.colors.accent.address} size='12px'>{link}</Text> */}
                      </Row>
                    </Link>
                ))}
              </Column>
            </GridItem>
        )}
      </Grid>
  );
};

type LabelValueProps = {
  label: string;
  value: ReactNode;
  link?: string;
  textToCopy?: string;
  isAddress?: boolean;
}

const LabelValue: FC<LabelValueProps> = ({
  label,
  value,
  link = '',
  textToCopy = '',
  isAddress = false
}) => {
  const theme = useTheme();
  const addr = isValidAddress(String(value));
  const isMobile = useMedia('(max-width: 768px)');

  return (
    <Column style={{ gap: '2px' }}>
      <SecondaryText className={'b2'}>{label}</SecondaryText>
      {link
        ? (
            <Link href={link}>
              <Copy textToCopy={String(value)}>
                {isMobile
                  ? <AddressSlicer address={value} name={addr ? null : value} isTrace={false} />
                  : <Text className={'b2-mono'} type={'history-address'}>{value}</Text>}
              </Copy>
            </Link>
          )
        : (
            <Text className={'b2'}>
              {value}
            </Text>
          )}
    </Column>
  );
};
