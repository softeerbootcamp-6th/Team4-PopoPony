import { $api } from '@apis';

const getRecruitsCustomer = () => {
  return $api.useQuery('get', '/api/recruits/customer');
};

export default getRecruitsCustomer;

// 사용 예시
// const { data } = getRecruitsCustomer();
// console.log(data?.data?.completedList?.[0].escortId);
