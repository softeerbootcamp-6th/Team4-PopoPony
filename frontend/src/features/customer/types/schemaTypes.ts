import type { components } from '@schema';

export type PatientDetail = components['schemas']['PatientDetail'] & {
  //TODO: DTO수정시 제거
  imageUrl?: string;
};
export type ImageCreateRequest = components['schemas']['ImageCreateRequest'];
export type MeetingLocationDetail = components['schemas']['LocationDetail'];
export type DestinationDetail = components['schemas']['LocationDetail'];
export type ReturnLocationDetail = components['schemas']['LocationDetail'];
export type RecruitCreateRequest = components['schemas']['RecruitCreateRequest'];
export type RecruitListResponse = components['schemas']['RecruitListResponse'];
export type RecruitSimpleResponse = components['schemas']['RecruitSimpleResponse'];