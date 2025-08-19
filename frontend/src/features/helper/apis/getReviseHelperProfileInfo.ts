import { $api } from '@apis';

const getReviseHelperProfileInfo = (helperProfileId: number, enable: boolean) => {
  return $api.useQuery(
    'get',
    '/api/helpers/{helperProfileId}/updates',
    {
      params: {
        path: {
          helperProfileId: helperProfileId,
        },
      },
    },
    {
      enabled: enable,
    }
  );
};

export default getReviseHelperProfileInfo;
