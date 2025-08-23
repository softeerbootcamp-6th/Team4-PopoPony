interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return <div className='flex min-h-[100dvh]'>{children}</div>;
};

export default RootLayout;
