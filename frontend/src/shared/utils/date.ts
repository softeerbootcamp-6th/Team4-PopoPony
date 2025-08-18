import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 문자열을 지정된 포맷으로 변환
 * @param date - 날짜 문자열 (예: "2024-01-15", "2024-01-15T10:30:00")
 * @param formatString - date-fns 포맷 문자열 (예: "MM월 dd일(eee)", "yyyy-MM-dd")
 * @returns 한국어 로케일로 포맷된 날짜 문자열
 */
export const dateFormat = (date: string, formatString: string) => {
  return format(new Date(date), formatString, { locale: ko });
};

/**
 * 시간 문자열을 한국어 포맷으로 변환
 * @param time - "HH:mm:ss" 형태의 시간 문자열 (예: "12:00:00")
 * @returns "오후 12시" 형태의 포맷된 시간 문자열
 */
export const timeFormat = (time: string): string => {
  const parsedTime = parse(time, 'HH:mm:ss', new Date());
  return format(parsedTime, 'aaa h시', { locale: ko });
};

/**
 * 날짜에서 한글 요일이 포함된 제목 포맷 생성. escort card 제목 만들 때 사용
 * @param date - 날짜 문자열 (예: "2025-07-22")
 * @returns "7월 22일 (화)" 형태의 날짜 문자열
 */
export const getEscortTitle = (date: string): string => {
  return dateFormat(date, 'M월 d일 (eee)');
};

/**
 * 초를 시간과 분으로 변환
 * @param seconds - 초 (예: 3600)
 * @returns "1시간 0분" 형태의 포맷된 시간 문자열
 */
export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  return `${hours}시간 ${remainingMinutes}분`;
};
