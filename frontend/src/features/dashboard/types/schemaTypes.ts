import type { components } from '@schema';

export type EscortDetailResponse = components['schemas']['EscortDetailResponse'];

export type EscortStatus =
  | '동행준비'
  | '만남중'
  | '병원행'
  | '진료중'
  | '복귀중'
  | '리포트작성중'
  | '동행완료';
