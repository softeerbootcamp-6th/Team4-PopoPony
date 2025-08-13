import type { RecruitFormValues } from '@customer/types';
import type { operations } from '@schema';
import { parseStringToBoolean } from '@utils';

type RecruitCreateJson = NonNullable<
  operations['createRecruit']['requestBody']
>['content']['application/json'];

// Build request body for POST /api/recruits from form values
export const buildRecruitCreateRequest = (formData: RecruitFormValues): RecruitCreateJson => {
  const requestBody: RecruitCreateJson = {
    patientDetail: {
      profileImageCreateRequest: {
        s3Key: formData.imageUrl.imageUrl,
        contentType: 'image/jpeg',
        size: 100,
        checksum: formData.imageUrl.imageUrl,
      },
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
