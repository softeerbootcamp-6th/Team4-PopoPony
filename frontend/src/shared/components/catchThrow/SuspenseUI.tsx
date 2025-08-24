import { Spinner } from '@shared/components';

const SuspenseUI = () => {
  return (
    <div className='flex h-full w-full justify-center p-[5rem]'>
      <Spinner size='36' color='primary' isLoading={true} />
    </div>
  );
};

export default SuspenseUI;
