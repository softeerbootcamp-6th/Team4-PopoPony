import { $api } from '@shared/api';

const getPastPatientInfoDetail = (recruitId: number, isPatientIdConfirmed: boolean) => {
  return $api.useQuery(
    'get',
    '/api/recruits/{recruitId}/history',
    {
      params: {
        path: { recruitId },
      },
    },
    {
      enabled: isPatientIdConfirmed,
    }
  );
};

export default getPastPatientInfoDetail;
