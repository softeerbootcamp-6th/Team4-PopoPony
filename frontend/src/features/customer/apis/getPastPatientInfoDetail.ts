import { $api } from '@shared/apis';

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
