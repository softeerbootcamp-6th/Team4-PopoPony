import { $api } from '@shared/api';

const getRecruitReportByRecruitId = (recruitId: number) => {
  return $api.useQuery(
    'get',
    '/api/reports/recruits/{recruitId}',
    {
      params: { path: { recruitId } },
    },
    { throwOnError: false }
  );
};

export default getRecruitReportByRecruitId;
