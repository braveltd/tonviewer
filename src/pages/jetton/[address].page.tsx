import { AppRoutes } from '../../helpers/routes';

const JettonDetailsPage = () => {
  return <div>JettonDetailsPage</div>;
};

export default JettonDetailsPage;

export async function getServerSideProps ({ res, params }) {
  const { address } = params;
  res.statusCode = 302;
  res.setHeader('Location', AppRoutes.accountDetails(address));
  return { props: {} };
}
