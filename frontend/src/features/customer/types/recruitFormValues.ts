// 폼 단계별 타입 정의
export interface Step1FormValues {
  patientName: string; // 환자 이름
  patientSex: 'male' | 'female';
  patientAge: number;
  patientContact: string;
  profileImageUrl: string; // 프로필 이미지
}

export interface Step2FormValues {
  needsPhysicalSupport: boolean;
  usesWheelchair: boolean;
}

export interface Step3FormValues {
  cognitiveAbility: 'good' | 'bad';
  cognitiveIssues?: string[]; //체크박스 다중 선택
  communicationAbility: 'good' | 'bad';
  communicationHelp?: string; //단순 텍스트
}

export interface Step4FormValues {
  escortDate: string;
  escortStartTime: string;
  escortEndTime: string;
  escortDuration: number;
}

export interface Step5FormValues {
  departureName: string;
  departureAddress: string;
  departureDetailAddress: string;
  hospitalAddress: string;
  hospitalDepartment: string;
  destinationName: string;
  destinationAddress: string;
  destinationDetailAddress: string;
}

export interface Step6FormValues {
  escortPurpose: string;
  escortNotes: string;
}

// 전체 폼 타입
export type RecruitFormValues = Step1FormValues &
  Step2FormValues &
  Step3FormValues &
  Step4FormValues &
  Step5FormValues &
  Step6FormValues;

// 인지 문제 옵션들
export const COGNITIVE_ISSUES_OPTIONS = [
  '판단에 도움이 필요해요',
  '상황 파악에 도움이 필요해요',
  '기억하거나 이해하는 것이 어려워요',
] as const;
