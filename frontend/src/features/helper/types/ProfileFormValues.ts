import { z } from 'zod';

export const REGION_OPTIONS = [
  { label: '서울', value: '서울특별시' },
  { label: '부산', value: '부산광역시' },
  { label: '대구', value: '대구광역시' },
  { label: '인천', value: '인천광역시' },
  { label: '광주', value: '광주광역시' },
  { label: '대전', value: '대전광역시' },
  { label: '울산', value: '울산광역시' },
  { label: '세종', value: '세종특별자치시' },
  { label: '경기', value: '경기도' },
  { label: '강원', value: '강원도' },
  { label: '충북', value: '충청북도' },
  { label: '충남', value: '충청남도' },
  { label: '전북', value: '전라북도' },
  { label: '전남', value: '전라남도' },
  { label: '경북', value: '경상북도' },
  { label: '경남', value: '경상남도' },
  { label: '제주', value: '제주특별자치도' },
] as const;

export const STRENGTH_OPTIONS = [
  '안전한 부축으로 편안한 이동',
  '휠체어 이용도 전문적인 동행',
  '인지 장애 어르신 맞춤 케어',
] as const;

export const CERTIFICATE_OPTIONS = [
  '간호사',
  '요양보호사',
  '간호조무사',
  '간병사',
  '병원동행메니저',
] as const;

export const RegionFormSchema = z.object({
  imageUrl: z.string().min(1),
  region: z.enum(REGION_OPTIONS.map((option) => option.value)),
});

export type RegionFormValues = z.infer<typeof RegionFormSchema>;

const CertificateItemSchema = z.object({
  type: z.enum(CERTIFICATE_OPTIONS),
  imageUrl: z.string().min(1, '자격증 이미지 URL은 필수입니다'),
});

export const DetailFormSchema = z.object({
  shortBio: z.string().min(1, '간단한 자기소개를 입력해주세요'),
  strengthList: z.array(z.enum(STRENGTH_OPTIONS)).max(3, '강점은 최대 3개까지 선택 가능합니다'),
  certificateList: z
    .array(CertificateItemSchema)
    .min(1, '최소 1개의 자격증을 선택해주세요')
    .max(5, '최대 5개의 자격증까지 선택 가능합니다'),
});

export type DetailFormValues = z.infer<typeof DetailFormSchema>;

export type ProfileFormValues = RegionFormValues & DetailFormValues;
