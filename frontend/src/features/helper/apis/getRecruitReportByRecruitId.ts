import { $api } from '@shared/apis';

const getRecruitReportByRecruitId = (recruitId: number) => {
  return $api.useQuery('get', '/api/reports/recruits/{recruitId}', {
    params: { path: { recruitId } },
  });
};

export default getRecruitReportByRecruitId;
