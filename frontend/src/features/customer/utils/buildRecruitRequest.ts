import type { RecruitFormValues } from '@customer/types';
import type { operations } from '@schema';
import { parseStringToBoolean } from '@shared/lib';

type RecruitCreateJson = NonNullable<
  operations['createRecruit']['requestBody']
>['content']['application/json'];

export const buildRecruitCreateRequest = (formData: RecruitFormValues): RecruitCreateJson => {
  const imageReq =
    formData.profileImageCreateRequest &&
    formData.profileImageCreateRequest.s3Key &&
    formData.profileImageCreateRequest.contentType &&
    typeof formData.profileImageCreateRequest.size === 'number' &&
    formData.profileImageCreateRequest.checksum
      ? {
          s3Key: formData.profileImageCreateRequest.s3Key,
          contentType: formData.profileImageCreateRequest.contentType,
          size: formData.profileImageCreateRequest.size,
          checksum: formData.profileImageCreateRequest.checksum,
        }
      : undefined;

  const requestBody: RecruitCreateJson = {
    patientDetail: {
      ...(imageReq ? { profileImageCreateRequest: imageReq } : {}),
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      phoneNumber: formData.phoneNumber.replace(/-/g, ''),
      needsHelping: parseStringToBoolean(formData.needsHelping),
      usesWheelchair: parseStringToBoolean(formData.usesWheelchair),
      hasCognitiveIssue: parseStringToBoolean(formData.hasCognitiveIssue),
      cognitiveIssueDetail: formData.cognitiveIssueDetail,
      hasCommunicationIssue: parseStringToBoolean(formData.hasCommunicationIssue),
      communicationIssueDetail: formData.communicationIssueDetail,
    },
    escortDetail: {
      escortDate: formData.escortDate,
      estimatedMeetingTime: formData.estimatedMeetingTime,
      estimatedReturnTime: formData.estimatedReturnTime,
      purpose: formData.purpose,
      extraRequest: formData.extraRequest,
    },
    meetingLocationDetail: formData.meetingLocationDetail,
    destinationDetail: formData.destinationDetail,
    returnLocationDetail: formData.returnLocationDetail,
  };

  return requestBody;
};

export default buildRecruitCreateRequest;
