import { formatImageUrl } from '@shared/lib';

import type { ProfileFormValues } from '@helper/types/ProfileFormValues';
import {
  CERTIFICATE_OPTIONS,
  REGION_OPTIONS,
  STRENGTH_OPTIONS,
} from '@helper/types/ProfileFormValues';
import type { HelperUpdateDefaultResponse } from '@helper/types/schemaTypes';

type HelperProfileApi = HelperUpdateDefaultResponse;

//프론트에서 정의한 옵션값만 허용
const allowedStrengths = new Set<string>([...STRENGTH_OPTIONS.map((o) => o.value)]);
const allowedCertificates = new Set<string>([...CERTIFICATE_OPTIONS]);
const allowedAreas = new Set<string>(REGION_OPTIONS.map((o) => o.value));

const toProfileFormValues = (
  api: HelperProfileApi,
  helperProfileId: number | undefined
): ProfileFormValues => {
  const strengthList = (api.strengthList ?? []).filter(
    (v): v is (typeof STRENGTH_OPTIONS)[number]['value'] =>
      typeof v === 'string' && allowedStrengths.has(v)
  );

  const certificateList = (api.certificateInfoList ?? [])
    .map((item) => {
      const type = item?.type;
      if (typeof type === 'string' && allowedCertificates.has(type)) {
        return {
          type: type as (typeof CERTIFICATE_OPTIONS)[number],
          certificateImageCreateRequest:
            item?.certificateImageCreateRequest as ProfileFormValues['certificateList'][number]['certificateImageCreateRequest'],
        };
      }
      return null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null); // null값 모두 제거

  const area = allowedAreas.has(api.area ?? '')
    ? (api.area as (typeof REGION_OPTIONS)[number]['value'])
    : REGION_OPTIONS[0].value;

  return {
    imageUrl: formatImageUrl(api.imageUrl) ?? '',
    profileImageCreateRequest: api.profileImageCreateRequest ?? null,
    strengthList,
    certificateList,
    shortBio: api.shortBio ?? '',
    area,
    isEdit: true,
    helperProfileId: helperProfileId,
  };
};

export default toProfileFormValues;
