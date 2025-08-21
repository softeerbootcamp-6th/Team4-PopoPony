/**
 * 전화 걸기
 * @param phoneNumber 전화번호
 * @returns 전화번호
 */
export const call = (phoneNumber: string) => {
  const formattedPhoneNumber = phoneNumber.replaceAll(/[^0-9]/g, '');
  window.open(`tel:${formattedPhoneNumber}`, '_self');
  return;
};
