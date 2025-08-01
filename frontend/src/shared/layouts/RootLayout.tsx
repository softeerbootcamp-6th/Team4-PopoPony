interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return <div className='flex h-[100dvh] justify-center gap-[14rem]'>{children}</div>;
};

export default RootLayout;
