import { HomeFragment } from 'tonviewer-web/fragments/home/HomeFragment';
import { StatisticProps } from 'tonviewer-web/components/Home/Statistic';
import { getHomeStats } from 'tonviewer-web/utils/getHomeStats';

export default function HomePage(props: {data: StatisticProps | null}) {
  return <HomeFragment {...props} />;
}

export const getServerSideProps = async () => {
  try {
    const data = await getHomeStats();
    return {
      props: {
        data
      }
    };
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      data: null
    }
  };
};
