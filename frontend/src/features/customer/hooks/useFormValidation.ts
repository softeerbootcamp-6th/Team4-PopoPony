import { useFormContext, useWatch } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

type TouchedFields<T> = Partial<Record<keyof T, boolean>>;
type FieldErrors<T> = Partial<Record<keyof T, string>>;

type UseFormValidationResult<T> = {
  values: T;
  fieldErrors: FieldErrors<T>;
  isFormValid: boolean;
  touchedFields: TouchedFields<T>;
  setTouchedFields: React.Dispatch<React.SetStateAction<TouchedFields<T>>>;
  markFieldAsTouched: (fieldName: keyof T) => void;
};

export function useFormValidation<S extends z.ZodObject<Record<string, z.ZodTypeAny>>>(
  schema: S
): UseFormValidationResult<z.infer<S>> {
  type T = z.infer<S>;

  const { control, getValues } = useFormContext<T>();
  const values = useWatch<T>({ control }) as T;

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields<T>>({});

  const shape = schema.shape as Record<keyof T, z.ZodTypeAny>;
  const schemaKeys = useMemo(() => Object.keys(shape) as (keyof T)[], [shape]);

  const markFieldAsTouched = (fieldName: keyof T) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  useEffect(() => {
    const currentValues = getValues();

    // 전체 폼 검증 (superRefine 포함)
    const formResult = schema.safeParse(currentValues);
    setIsFormValid(formResult.success);

    // // 디버깅을 위한 콘솔 로그
    // console.log('=== Form Validation Debug ===');
    // console.log('Current Values:', currentValues);
    // console.log('Form Valid:', formResult.success);

    // if (!formResult.success) {
    //   console.log('Validation Errors:', formResult.error.issues);
    // }

    // 에러 맵핑
    const errors: FieldErrors<T> = {};

    if (!formResult.success) {
      // Zod 에러를 필드별로 매핑
      formResult.error.issues.forEach((issue) => {
        const fieldPath = issue.path[0] as keyof T;
        if (fieldPath && touchedFields[fieldPath]) {
          errors[fieldPath] = issue.message;
        }
      });
    }

    setFieldErrors(errors);
  }, [values, touchedFields, schema, getValues, schemaKeys]);

  return {
    values,
    fieldErrors,
    isFormValid,
    touchedFields,
    setTouchedFields,
    markFieldAsTouched,
  };
}
