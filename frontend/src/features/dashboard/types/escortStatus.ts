import { type EscortStatus } from '@types';

export type EscortStatusProps = Exclude<EscortStatus, undefined>;

export type StatusTitleProps = Exclude<
  EscortStatus,
  '동행준비' | '동행완료' | '리포트작성중' | undefined
>;
