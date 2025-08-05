// 폼 단계별 타입 정의
export interface ProfileFormValues {
  patientName: string; // 환자 이름
  patientSex: 'male' | 'female';
  patientAge: number;
  patientContact: string;
  profileImageUrl: string; // 프로필 이미지
}

export interface ConditionFormValues {
  needsPhysicalSupport: boolean;
  usesWheelchair: boolean;
}

export interface CommunicationFormValues {
  cognitiveAbility: 'good' | 'bad';
  cognitiveIssues?: string[]; //체크박스 다중 선택
  communicationAbility: 'good' | 'bad';
  communicationHelp?: string; //단순 텍스트
}

export interface TimeFormValues {
  escortDate: string;
  escortStartTime: string;
  escortEndTime: string;
  escortDuration: number;
}

export interface RouteFormValues {
  // 출발지 (meetingLocationDetail)
  meetingPlaceName: string;
  meetingUpperAddrName: string;
  meetingMiddleAddrName: string;
  meetingLowerAddrName: string;
  meetingFirstAddrNo: string;
  meetingSecondAddrNo: string;
  meetingRoadName: string;
  meetingFirstBuildingNo: string;
  meetingSecondBuildingNo: string;
  meetingDetailAddress: string;
  meetingLongitude?: number;
  meetingLatitude?: number;

  // 목적지 (destinationDetail)
  destinationPlaceName: string;
  destinationUpperAddrName: string;
  destinationMiddleAddrName: string;
  destinationLowerAddrName: string;
  destinationFirstAddrNo: string;
  destinationSecondAddrNo: string;
  destinationRoadName: string;
  destinationFirstBuildingNo: string;
  destinationSecondBuildingNo: string;
  destinationDetailAddress: string;
  destinationLongitude?: number;
  destinationLatitude?: number;

  // 복귀지 (returnLocationDetail)
  returnPlaceName: string;
  returnUpperAddrName: string;
  returnMiddleAddrName: string;
  returnLowerAddrName: string;
  returnFirstAddrNo: string;
  returnSecondAddrNo: string;
  returnRoadName: string;
  returnFirstBuildingNo: string;
  returnSecondBuildingNo: string;
  returnDetailAddress: string;
  returnLongitude?: number;
  returnLatitude?: number;
}

export interface RequestFormValues {
  escortPurpose: string;
  escortNotes: string;
}

// 전체 폼 타입
export type RecruitFormValues = ProfileFormValues &
  ConditionFormValues &
  CommunicationFormValues &
  TimeFormValues &
  RouteFormValues &
  RequestFormValues;

// 인지 문제 옵션들
export const COGNITIVE_ISSUES_OPTIONS = [
  '판단에 도움이 필요해요',
  '상황 파악에 도움이 필요해요',
  '기억하거나 이해하는 것이 어려워요',
];
