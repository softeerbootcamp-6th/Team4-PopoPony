import { differenceInMinutes, format, parse } from 'date-fns';
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
export const timeFormat = (time: string, formatString: string = 'aaa h시'): string => {
  const parsedTime = parse(time, 'HH:mm:ss', new Date());
  return format(parsedTime, formatString, { locale: ko });
};

/**
 * 분이 00이면 분 표기를 생략하여 한국어로 표기
 * @param time - "HH:mm:ss" 형태의 시간 문자열
 * @returns 예: "오후 12시", "오전 9시 05분"
 */
export const timeFormatWithOptionalMinutes = (time: string): string => {
  const parsedTime = parse(time, 'HH:mm:ss', new Date());
  const minutes = format(parsedTime, 'mm', { locale: ko });
  if (minutes === '00') {
    return format(parsedTime, 'aaa h시', { locale: ko });
  }
  return format(parsedTime, 'aaa h시 mm분', { locale: ko });
};

/**
 * 시작-종료 시간 차이를 한국어로 표기
 * @param startTime - "HH:mm:ss" 형식의 시작 시간
 * @param endTime - "HH:mm:ss" 형식의 종료 시간
 * @returns "X시간 Y분", "Y분", "X시간" 형태의 문자열
 */
export const timeDuration = (startTime: string, endTime: string): string => {
  const start = parse(startTime, 'HH:mm:ss', new Date());
  const end = parse(endTime, 'HH:mm:ss', new Date());

  let totalMinutes = differenceInMinutes(end, start);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
};

/**
 * 날짜에서 한글 요일이 포함된 제목 포맷 생성. escort card 제목 만들 때 사용
 * @param date - 날짜 문자열 (예: "2025-07-22")
 * @returns "7월 22일 (화)" 형태의 날짜 문자열
 */
export const getEscortTitle = (date: string): string => {
  return dateFormat(date, 'M월 d일 (eee)');
};
