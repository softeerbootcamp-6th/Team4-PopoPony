const domainLabel: Record<string, string> = {
  '10': 'Common',
  '11': 'Auth',
  '12': 'Customer',
  '13': 'Escort',
  '14': 'Helper',
  '15': 'Report',
  '16': 'Review',
  '17': 'Route',
  '18': 'Payment',
  '19': 'RealTime',
  '20': 'ImageFile',
  '21': 'WebSocket',
};

const errorTypeLabel: Record<string, string> = {
  '00': 'Success',
  '01': 'Not Found',
  '02': 'Validation Error',
  '03': 'Invalid State',
  '04': 'Database Error',
  '05': 'Forbidden',
  '06': 'Failure',
  '07': 'External API Error',
  '08': 'Time Error',
  '09': 'Server Error',
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
  if (err.message && String(err.message).trim().length > 0) return err.message;

  if (!err.code || typeof err.code !== 'string' || !/^\d{6}$/.test(err.code)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  const { domain, type } = parseDDSS(err.code);
  if (domain && type) {
    const domainText = domainLabel[domain] || 'Unknown';
    const typeText = errorTypeLabel[type] || 'Unknown Error';
    return `${domainText} - ${typeText}`;
  }

  return '요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
}
