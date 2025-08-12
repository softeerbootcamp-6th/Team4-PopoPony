import { $api } from '@apis';

const getHelperById = (helperProfileId: number) => {
  return $api.useQuery('get', '/api/helpers/{helperProfileId}', {
    params: {
      path: {
        helperProfileId,
      },
    },
  });
};

export default getHelperById;
