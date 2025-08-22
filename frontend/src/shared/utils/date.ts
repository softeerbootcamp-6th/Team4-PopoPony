import {
  differenceInDays,
  differenceInMinutes,
  differenceInHours,
  differenceInSeconds,
  format,
  parse,
  isValid,
  startOfDay,
  isBefore,
} from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 시간 문자열을 Date 객체로 파싱 (HH:mm 또는 HH:mm:ss 형식 지원)
 * @param timeString - "HH:mm" 또는 "HH:mm:ss" 형태의 시간 문자열
 * @returns 파싱된 Date 객체
 */
export const parseTimeString = (timeString: string): Date => {
  // HH:mm:ss 형식인지 확인
  if (timeString.length === 8 && timeString.includes(':')) {
    return parse(timeString, 'HH:mm:ss', new Date());
  }
  // HH:mm 형식
  return parse(timeString, 'HH:mm', new Date());
};

/**
 * 시간 문자열이 유효한지 검증
 * @param timeString - 검증할 시간 문자열
 * @returns 유효성 여부
 */
export const isValidTimeString = (timeString: string): boolean => {
  try {
    const parsed = parseTimeString(timeString);
    return isValid(parsed);
  } catch {
    return false;
  }
};

/**
 * 두 시간 문자열 비교
 * @param time1 - 첫 번째 시간 문자열
 * @param time2 - 두 번째 시간 문자열
 * @returns time1이 time2보다 이전이면 true
 */
export const isTimeBefore = (time1: string, time2: string): boolean => {
  const parsed1 = parseTimeString(time1);
  const parsed2 = parseTimeString(time2);
  return parsed1 < parsed2;
};

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
 * 시간을 24시간 형식으로 변환
 * @param time - "HH:mm:ss" 형태의 시간 문자열
 * @returns 예: "오후 12시", "오전 9시 05분"
 */
export const timeFormatTo24Hour = (time: string): string => {
  const parsedTime = parse(time, 'HH:mm:ss', new Date());
  return format(parsedTime, 'HH시 mm분', { locale: ko });
};

/**
 * 시작-종료 시간 차이를 한국어로 표기 (HH:mm 또는 HH:mm:ss 형식 지원)
 * @param startTime - "HH:mm" 또는 "HH:mm:ss" 형식의 시작 시간
 * @param endTime - "HH:mm" 또는 "HH:mm:ss" 형식의 종료 시간
 * @returns "X시간 Y분", "Y분", "X시간" 형태의 문자열
 */
export const timeDuration = (startTime: string, endTime: string): string => {
  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);

  let totalMinutes = differenceInMinutes(end, start);

  if (totalMinutes < 0) {
    return '0분';
  }

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

export const getDaysLeft = (date: string) => {
  const diff = differenceInDays(new Date(date), new Date());
  return diff >= 0 ? diff + 1 : 0;
};

/**
 * 남은 시간이 하루(24시간) 이상이면 "d일" 반환, 하루 이하이면 "m시간" 반환
 * @param date - 목표 시각(미래)
 * @returns 예: "2일" 또는 "5시간" 또는 "0시간"
 */
export const getRemainingDayOrHour = (date: string): string => {
  const target = new Date(date);
  const now = new Date();
  const remainingHours = differenceInHours(target, now);

  if (remainingHours <= 0) return '0시간';
  if (remainingHours >= 24) {
    const days = Math.floor(remainingHours / 24);
    return `${days}일`;
  }
  return `${remainingHours}시간`;
};

export const getDifferenceInSecondsFromNow = (date: string) => {
  const target = new Date(date);
  const now = new Date();
  return differenceInSeconds(target, now);
};

/**
 * 날짜가 오늘 이전인지 확인 (시간은 무시하고 날짜만 비교)
 * @param date - 확인할 날짜
 * @returns 오늘 이전이면 true, 오늘 이후면 false
 */
export const isBeforeToday = (date: Date): boolean => {
  const today = startOfDay(new Date());
  return isBefore(date, today);
};
