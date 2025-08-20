// src/lib/errorMessages.ts
const domainLabel: Record<string, string> = {
  '10': '공통 예외 처리',
  '11': '인증 / 사용자 관리',
  '12': '고객 관련 기능',
  '13': '동행 서비스 관련 기능',
  '14': '도우미 관련 기능',
  '15': '리포트 작성 / 조회',
  '16': '후기 / 평가',
  '17': '경로 및 이동 추적',
  '18': '결제 및 송금',
  '19': '마지막 위치 기록 및 조회',
  '20': '이미지 파일',
};

const errorTypeLabel: Record<string, string> = {
  '00': '정상 처리 되었습니다.',
  '01': '대상 리소스가 존재하지 않습니다.',
  '02': '필수값이 누락되거나 입력값이 유효하지 않습니다.',
  '03': '이미 종료된 동행 요청에 대한 접근입니다.',
  '04': 'DB처리 중 오류가 발생했습니다.',
  '05': '접근 권한이 없습니다.',
  '06': '요청이 실패하였습니다.',
  '07': '외부 서비스 연동 중 오류가 발생했습니다.',
  '08': '만료된 요청입니다.',
  '09': '알 수 없는 오류가 발생했습니다.',
};

// 필요할 때 QA하며 확장
const table: Record<string, string> = {
  //   '110101': '세션이 만료되었습니다. 다시 로그인 해주세요.',
  //   '130203': '이미 확정되어 수정할 수 없습니다.',
};

export function parseDDSS(code?: string) {
  if (!code || typeof code !== 'string') return {};
  const match = code.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (!match) return {};
  return {
    domain: match[1],
    sub: match[2],
    type: match[3],
  } as const;
}

export function resolveMessage(err: { message?: string; code?: string }) {
  if (err.message) return err.message;
  // 서버 컨벤션: 에러 코드는 6자리 숫자 문자열이어야 함
  if (!err.code || typeof err.code !== 'string' || !/^\d{6}$/.test(err.code)) {
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
  // 사전 정의된 메시지 우선
  if (table[err.code]) return table[err.code];
  const { domain, type } = parseDDSS(err.code);
  if (domain && type) {
    const domainText = domainLabel[domain] || '알 수 없는 오류';
    const typeText = errorTypeLabel[type] || '';
    return `${domainText} 에서 ${typeText}`;
  }
  return '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}
