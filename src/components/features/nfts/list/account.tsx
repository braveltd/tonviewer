import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '../../../index';
import { Layout } from '../../../core/layout';
import { Card } from '../../../core/card';
import { Gallery } from '../../../core/gallery';
import { Column } from '../../../core/column';
import { useTheme } from 'styled-components';
import { Box } from '../../../core/box';
import { Row } from '../../../core/row';
import { Text } from '../../../core/text';
import { AppRoutes } from '../../../../helpers/routes';
import { Button } from '../../../core/button';
import { useNftListModel } from '../../../../hooks/nfts';

export const AccountNftListPresenter = ({ nftList, error }) => {
  const theme = useTheme();
  const router = useRouter();
  const { value } = router.query;
  const nftListModel = useNftListModel(nftList);

  const goBack = () => {
    if (history.length > 2) {
      router.back();
    } else {
      router.push({ pathname: AppRoutes.accountDetails(String(value)) });
    }
  };

  return (
    <Layout>
      <Column gap={theme.spacing.large}>
        <Box>
          <Button onClick={goBack} type='button'>
            <Row align='center' gap={theme.spacing.tiny} justify='center'>
              <ArrowLeftIcon />
              <Text>Back</Text>
            </Row>
          </Button>
        </Box>
        <Card>
          <Gallery size='huge' items={nftListModel} />
        </Card>
      </Column>
    </Layout>
  );
};
