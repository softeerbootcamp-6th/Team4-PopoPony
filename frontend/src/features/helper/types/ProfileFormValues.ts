import { z } from 'zod';
import { imageSchema } from '@types';

export const REGION_OPTIONS = [
  { label: '서울특별시', value: '서울' },
  { label: '부산광역시', value: '부산' },
  { label: '대구광역시', value: '대구' },
  { label: '인천광역시', value: '인천' },
  { label: '광주광역시', value: '광주' },
  { label: '대전광역시', value: '대전' },
  { label: '울산광역시', value: '울산' },
  { label: '세종특별자치시', value: '세종시' },
  { label: '경기도', value: '경기' },
  { label: '강원도', value: '강원' },
  { label: '충청북도', value: '충북' },
  { label: '충청남도', value: '충남' },
  { label: '전라북도', value: '전북' },
  { label: '전라남도', value: '전남' },
  { label: '경상북도', value: '경북' },
  { label: '경상남도', value: '경남' },
  { label: '제주특별자치도', value: '제주' },
] as const;

export const STRENGTH_OPTIONS = [
  { label: '안전한 부축으로 편안한 이동', value: '안전한 부축' },
  { label: '휠체어 이용도 전문적인 동행', value: '휠체어 이동' },
  { label: '인지 장애 어르신 맞춤 케어', value: '인지장애 케어' },
] as const;

export const CERTIFICATE_OPTIONS = [
  '간호사',
  '병원동행매니저',
  '요양보호사',
  '간호조무사',
  '간병사',
] as const;

export const EditSchema = z.object({
  imageUrl: z.string().optional(),
  isEdit: z.boolean().optional(),
  helperProfileId: z.number().optional(),
});

export type EditValues = z.infer<typeof EditSchema>;

export const RegionFormSchema = z.object({
  profileImageCreateRequest: imageSchema,
  area: z.enum(REGION_OPTIONS.map((option) => option.value)),
});

export type RegionFormValues = z.infer<typeof RegionFormSchema>;

const CertificateItemSchema = z.object({
  type: z.enum(CERTIFICATE_OPTIONS),
  certificateImageCreateRequest: imageSchema,
});

export type CertificateItemValues = z.infer<typeof CertificateItemSchema>;

export const DetailFormSchema = z.object({
  shortBio: z.string().min(1, '간단한 자기소개를 입력해주세요'),
  strengthList: z
    .array(z.enum(STRENGTH_OPTIONS.map((o) => o.value)))
    .max(3, '강점은 최대 3개까지 선택 가능합니다')
    .optional()
    .default([]),
  certificateList: z
    .array(CertificateItemSchema)
    .min(1, '최소 1개의 자격증을 선택해주세요')
    .max(5, '최대 5개의 자격증까지 선택 가능합니다'),
});

export type DetailFormValues = z.infer<typeof DetailFormSchema>;

export type ProfileFormValues = EditValues & RegionFormValues & DetailFormValues;
