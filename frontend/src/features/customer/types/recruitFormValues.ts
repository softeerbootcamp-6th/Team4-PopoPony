// 폼 단계별 타입 정의
export interface ProfileFormValues {
  imageUrl: string; // 프로필 이미지
  name: string; // 환자 이름
  age: number;
  gender: '남자' | '여자';
  phoneNumber: string;
}

export interface ConditionFormValues {
  needsHelping: boolean;
  usesWheelchair: boolean;
}

export interface CommunicationFormValues {
  hasCognitiveIssue: boolean;
  cognitiveIssueDetail?: string[]; // 체크박스 다중 선택
  hasCommunicationIssue: boolean;
  communicationIssueDetail?: string; // 단순 텍스트
}

export interface TimeFormValues {
  escortDate: string;
  estimatedMeetingTime: string;
  estimatedReturnTime: string;
  escortDuration: number; // 얘는 백엔드에서 보낼 때
}

export interface LocationDetail {
  placeName: string;
  upperAddrName: string;
  middleAddrName: string;
  lowerAddrName: string;
  firstAddrNo: string;
  secondAddrNo: string;
  roadName: string;
  firstBuildingNo: string;
  secondBuildingNo: string;
  detailAddress: string;
  longitude: number;
  latitude: number;
}

export interface RouteFormValues {
  meetingLocationDetail: LocationDetail;
  destinationDetail: LocationDetail;
  returnLocationDetail: LocationDetail;
}

export interface RequestFormValues {
  purpose: string;
  extraRequest: string;
}

// 전체 폼 타입 (백엔드 스키마와 일치)
export interface RecruitFormValues {
  patientDetail: ProfileFormValues & ConditionFormValues & CommunicationFormValues;
  escortDetail: TimeFormValues & RequestFormValues;
  meetingLocationDetail: LocationDetail;
  destinationDetail: LocationDetail;
  returnLocationDetail: LocationDetail;
}

// 인지 문제 옵션들
export const COGNITIVE_ISSUES_OPTIONS = [
  '판단에 도움이 필요해요',
  '상황 파악에 도움이 필요해요',
  '기억하거나 이해하는 것이 어려워요',
];
