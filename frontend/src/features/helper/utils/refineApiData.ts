import type { components } from '@schema';
import type { ReportFormValues } from '@helper/types';
import { removePreviewUrl } from '@shared/lib';

/**
 * 폼 데이터에서 previewUrl을 제거하고 API 요청 형태로 변환
 */
export const convertFormToApiRequest = (
  formData: ReportFormValues
): components['schemas']['ReportCreateRequest'] => {
  const {
    actualMeetingTime,
    actualReturnTime,
    imageCreateRequestList,
    taxiFeeCreateRequest,
    reservationDate,
    reservationTime,
    ...rest
  } = formData;

  const nextAppointmentTime =
    reservationDate && reservationTime ? `${reservationDate}T${reservationTime}` : undefined;

  // ImageWithPreviewUrl에서 previewUrl 제거
  const apiImageList = imageCreateRequestList.map(removePreviewUrl);

  // 택시 요금 정보에서도 previewUrl 제거
  const apiTaxiFee = {
    departureFee: Number(taxiFeeCreateRequest.departureFee.replaceAll(',', '')),
    departureReceipt: removePreviewUrl(taxiFeeCreateRequest.departureReceipt),
    returnFee: Number(taxiFeeCreateRequest.returnFee.replaceAll(',', '')),
    returnReceipt: removePreviewUrl(taxiFeeCreateRequest.returnReceipt),
  };

  return {
    ...rest,
    actualMeetingTime: `${actualMeetingTime}:00`,
    actualReturnTime: `${actualReturnTime}:00`,
    nextAppointmentTime,
    imageCreateRequestList: apiImageList,
    taxiFeeCreateRequest: apiTaxiFee,
  };
};
