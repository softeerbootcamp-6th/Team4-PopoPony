import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { useWatch, useFormContext } from 'react-hook-form';
import { memo, useState, useEffect } from 'react';
import { FormLayout } from '@layouts';
import { z } from 'zod';

type Props = {
  handleNextStep: () => void;
};

const Condition = memo(({ handleNextStep }: Props) => {
  const { getValues } = useFormContext();
  const patientName = getValues('patientName');
  return <div>{patientName}</div>;
};

export default Condition;
