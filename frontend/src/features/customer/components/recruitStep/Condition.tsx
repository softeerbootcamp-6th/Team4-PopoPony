import { useFormContext } from 'react-hook-form';
type Props = {};

const Condition = (props: Props) => {
  const { getValues } = useFormContext();
  const patientName = getValues('patientName');
  return <div>{patientName}</div>;
};

export default Condition;
