import { $api } from '@apis';

const getHasProfile = () => {
  //TODO: 추후 api 나오면 수정
  return { data: { hasProfile: false, helperId: 1 } };
};

export default getHasProfile;
