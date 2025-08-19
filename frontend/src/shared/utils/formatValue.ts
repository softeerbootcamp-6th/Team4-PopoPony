/**
 *
 * @param value 스트링으로 된 입력값
 * @param inputType input태그의 타입.
 * @returns
 */
export const formatFormInputValue = (value: string, inputType: string) => {
  switch (inputType) {
    case 'contact':
      const numbers = value.replace(/[^0-9]/g, '');
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    case 'cost':
      const costNum = value.replace(/[^0-9]/g, '');
      return costNum ? parseInt(costNum, 10).toLocaleString() : '';
    case 'number':
      return value.replace(/[^0-9]/g, '');
    default:
      return value;
  }
};

export const formatPhoneNumber = (value: string | undefined) => {
  if (value === undefined) return '';
  const numbers = value.replace(/[^0-9]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export const formatImageUrl = (value: string | undefined) => {
  if (value === undefined) return '';
  return import.meta.env.VITE_API_BASE_URL + value;
};
