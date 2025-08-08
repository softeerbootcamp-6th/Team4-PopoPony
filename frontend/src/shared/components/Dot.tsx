const Dot = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`${active ? 'bg-mint-10' : 'bg-neutral-20'} flex-center absolute z-10 h-[2rem] w-[2rem] rounded-full`}>
      <div
        className={`${active ? 'bg-mint-50' : 'bg-neutral-60'} h-[1rem] w-[1rem] rounded-full`}
      />
    </div>
  );
};

export default Dot;
