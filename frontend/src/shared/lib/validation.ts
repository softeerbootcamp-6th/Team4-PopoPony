import { $fetch, NotFoundError } from '@shared/api';

/**
 * 동행 신청 존재 여부 검증
 * @param escortId: 동행 신청 ID
 * @returns 동행 신청 존재 여부
 * @throws NotFoundError: 동행 신청이 존재하지 않을 경우
 */
export const validateRecruitExistsByRecruitId = async (escortId: number) => {
  try {
    await $fetch.GET(`/api/recruits/{recruitId}/status`, {
      params: { path: { recruitId: escortId } },
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
  }
};
