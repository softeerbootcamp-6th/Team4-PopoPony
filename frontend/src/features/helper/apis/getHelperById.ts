import { $api } from '@apis';

//TODO: api이름 확정나면 바꿔야함
const getReviseProfileById = (helperProfileId: number, enable: boolean) => {
  return $api.useQuery(
    'get',
    '/api/helpers/{helperProfileId}',
    {
      params: {
        path: { helperProfileId },
      },
    },
    {
      enabled: enable,
    }
  );
};

export default getReviseProfileById;
