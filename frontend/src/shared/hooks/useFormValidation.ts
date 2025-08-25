import { z } from 'zod';

import { useEffect, useState } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

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

  const markFieldAsTouched = (fieldName: keyof T) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  useEffect(() => {
    // 전체 폼 검증
    const formResult = schema.safeParse(values);
    setIsFormValid(formResult.success);

    // // TODO: 디버깅을 위한 콘솔 로그이므로, 추후 삭제
    // console.log('=== Form Validation Debug ===');
    // console.log('Current Values:', values);
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
  }, [values, touchedFields, schema, getValues]);

  return {
    values,
    fieldErrors,
    isFormValid,
    touchedFields,
    setTouchedFields,
    markFieldAsTouched,
  };
}
