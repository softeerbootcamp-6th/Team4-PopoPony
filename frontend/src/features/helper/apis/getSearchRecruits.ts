import { $api } from '@apis';

const getSearchRecruits = ({
  region,
  startDate,
  endDate,
}: {
  region?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return $api.useSuspenseQuery('get', '/api/recruits', {
    params: {
      query: {
        area: region,
        startDate,
        endDate,
      },
    },
  });
};

export default getSearchRecruits;
