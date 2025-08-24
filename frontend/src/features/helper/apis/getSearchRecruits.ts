import { $api } from '@shared/apis';

const getSearchRecruits = ({
  region,
  startDate,
  endDate,
}: {
  region?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return $api.useQuery(
    'get',
    '/api/recruits',
    {
      params: {
        query: {
          area: region,
          startDate,
          endDate,
        },
      },
    },
    {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    }
  );
};

export default getSearchRecruits;
