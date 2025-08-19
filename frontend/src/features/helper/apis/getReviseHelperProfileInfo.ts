import { $api } from '@apis';

const getReviseHelperProfileInfo = (helperProfileId: number) => {
  return $api.useQuery('get', '/api/helpers/{helperProfileId}/updates', {
    params: {
      path: {
        helperProfileId: helperProfileId,
      },
    },
  });
};

export default getReviseHelperProfileInfo;
