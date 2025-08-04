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

  // RHF 컨텍스트를 폼 타입으로 묶어줍니다.
  const { control, getValues } = useFormContext<T>();

  // 전체 폼을 한번에 watch (필요하면 키별 watch로 바꿔도 됨)
  const values = useWatch<T>({ control }) as T;

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields<T>>({});

  // shape는 AnyZodObject에서 안전함
  const shape = schema.shape as Record<keyof T, z.ZodTypeAny>;
  const schemaKeys = useMemo(() => Object.keys(shape) as (keyof T)[], [shape]);

  const validateField = (fieldName: keyof T, value: unknown): string | null => {
    const fieldSchema = shape[fieldName];
    if (!fieldSchema) return null;
    const result = fieldSchema.safeParse(value);
    return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid');
  };

  const markFieldAsTouched = (fieldName: keyof T) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  useEffect(() => {
    const errors: FieldErrors<T> = {};

    // touched된 필드만 검사
    for (const key of schemaKeys) {
      if (touchedFields[key]) {
        const err = validateField(key, values?.[key as keyof T]);
        if (err) errors[key] = err;
      }
    }
    setFieldErrors(errors);

    // 전체 폼 유효성
    const formResult = schema.safeParse(getValues());
    setIsFormValid(formResult.success);
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
