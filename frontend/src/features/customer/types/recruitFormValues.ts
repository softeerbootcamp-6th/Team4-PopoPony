import { z } from 'zod';
import { imageSchema } from '@types';
// 폼 단계별 타입 정의

export const profileSchema = z.object({
  name: z.string().min(2, { message: '올바른 이름을 입력해주세요' }),
  age: z
    .string()
    .min(1, { message: '나이를 입력해주세요' })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 150;
      },
      { message: '올바른 나이를 입력해주세요' }
    ),
  phoneNumber: z
    .string()
    .min(12, { message: '숫자만 입력해주세요' })
    .refine((val) => val.replace(/\D/g, '').startsWith('010'), {
      message: '연락처는 010으로 시작해야 합니다.',
    }),
  gender: z.enum(['남자', '여자'], { message: '성별을 선택해주세요' }),
  profileImageCreateRequest: imageSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const conditionSchema = z.object({
  needsHelping: z.enum(['true', 'false'], { message: '부축 여부를 선택해주세요' }),
  usesWheelchair: z.enum(['true', 'false'], { message: '휠체어 사용 여부를 선택해주세요' }),
});

export type ConditionFormValues = z.infer<typeof conditionSchema>;

export type ConditionPostValues = Omit<ConditionFormValues, 'needsHelping' | 'usesWheelchair'> & {
  needsHelping: boolean;
  usesWheelchair: boolean;
};

export const CognitiveSchema = z
  .object({
    hasCognitiveIssue: z.enum(['true', 'false'], { message: '인지 능력 여부를 선택해주세요' }),
    cognitiveIssueDetail: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.hasCognitiveIssue === 'true') {
        return data.cognitiveIssueDetail && data.cognitiveIssueDetail.length > 0;
      }
      return true;
    },
    {
      message: '구체적인 문제점을 선택해주세요',
      path: ['cognitiveIssueDetail'],
    }
  );
export const CommunicationSchema = z
  .object({
    hasCommunicationIssue: z.enum(['true', 'false'], {
      message: '의사소통 능력 여부를 선택해주세요',
    }),
    communicationIssueDetail: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasCommunicationIssue === 'true') {
        return data.communicationIssueDetail && data.communicationIssueDetail.length >= 10;
      }
      return true;
    },
    {
      message: '10자 이상 입력해주세요',
      path: ['communicationIssueDetail'],
    }
  );

export const IntegratedCommSchema = z.intersection(CognitiveSchema, CommunicationSchema);

export type CommunicationFormValues = z.infer<typeof IntegratedCommSchema>;

export type CommunicationPostValues = Omit<
  CommunicationFormValues,
  'hasCognitiveIssue' | 'hasCommunicationIssue'
> & {
  hasCognitiveIssue: boolean;
  hasCommunicationIssue: boolean;
};

export const dateSchema = z.object({
  escortDate: z
    .string()
    .min(1, { message: '날짜를 선택해주세요' })
    .refine(
      (date) => {
        const today = new Date();
        const selectedDate = new Date(date);
        return selectedDate > today;
      },
      { message: '오늘 이후의 날짜를 선택해주세요' }
    ),
});

export const timeSchema = z
  .object({
    estimatedMeetingTime: z.string().min(1, { message: '시작 시간을 선택해주세요' }),
    estimatedReturnTime: z.string().min(1, { message: '종료 시간을 선택해주세요' }),
    escortDuration: z.number(),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.estimatedMeetingTime}`);
      const endTime = new Date(`2000-01-01T${data.estimatedReturnTime}`);
      return startTime < endTime;
    },
    {
      message: '시작 시간이 종료 시간보다 늦습니다.',
      path: ['estimatedReturnTime'],
    }
  )
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.estimatedMeetingTime}`);
      const endTime = new Date(`2000-01-01T${data.estimatedReturnTime}`);
      const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      return diffInMinutes >= 120;
    },
    {
      message: '최소 2시간 이상 예약해주세요',
      path: ['escortDuration'],
    }
  );

export const timeAndDateSchema = z.intersection(timeSchema, dateSchema);

export type TimeFormValues = z.infer<typeof timeAndDateSchema>;

export const locationDetailSchema = z.object({
  placeName: z.string(),
  upperAddrName: z.string(),
  middleAddrName: z.string(),
  lowerAddrName: z.string(),
  firstAddrNo: z.string(),
  secondAddrNo: z.string(),
  roadName: z.string(),
  firstBuildingNo: z.string(),
  secondBuildingNo: z.string().optional(),
  detailAddress: z.string().min(1, { message: '필수 입력 항목입니다.' }),
  longitude: z.number(),
  latitude: z.number(),
});

export const routeFormSchema = z.object({
  meetingLocationDetail: locationDetailSchema,
  destinationDetail: locationDetailSchema,
  returnLocationDetail: locationDetailSchema,
  isMeetingLocationSameAsDestination: z.boolean(),
});

export type SearchLocationDetail = Omit<LocationDetail, 'detailAddress'>;

export type LocationDetail = z.infer<typeof locationDetailSchema>;

export type RouteFormValues = z.infer<typeof routeFormSchema>;

export const requestFormSchema = z.object({
  purpose: z.string().min(1, '요청 사항을 입력해주세요'),
  extraRequest: z.string().optional(),
});
export type RequestFormValues = z.infer<typeof requestFormSchema>;

// 전체 폼 타입 (백엔드 스키마와 일치)
export interface RecruitPostFormValues {
  patientDetail: ProfileFormValues & ConditionPostValues & CommunicationPostValues;
  escortDetail: TimeFormValues & RequestFormValues;
  meetingLocationDetail: LocationDetail;
  destinationDetail: LocationDetail;
  returnLocationDetail: LocationDetail;
}
export type RecruitFormValues = ProfileFormValues &
  ConditionFormValues &
  CommunicationFormValues &
  TimeFormValues &
  RequestFormValues &
  RouteFormValues;

// 인지 문제 옵션들
export const COGNITIVE_ISSUES_OPTIONS = [
  '판단에 도움이 필요해요',
  '상황 파악에 도움이 필요해요',
  '기억하거나 이해하는 것이 어려워요',
];
