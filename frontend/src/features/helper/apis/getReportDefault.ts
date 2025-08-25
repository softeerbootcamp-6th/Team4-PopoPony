import { $api } from '@shared/api';

const getReportDefault = (recruitId: number) => {
  return $api.useQuery('get', '/api/reports/recruits/{recruitId}/default', {
    params: {
      path: {
        recruitId,
      },
    },
  });
};

export default getReportDefault;
