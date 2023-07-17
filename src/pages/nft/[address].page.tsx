import { AppRoutes } from '../../helpers/routes';

const NftDetailsPage = () => {
  return <div>NftDetailsPage</div>;
};

export default NftDetailsPage;

export async function getServerSideProps ({ res, params }) {
  const { address } = params;
  res.statusCode = 302;
  res.setHeader('Location', AppRoutes.accountDetails(address));
  return { props: {} };
}
