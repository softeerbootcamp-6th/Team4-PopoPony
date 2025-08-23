// 1분 미만일때는 '방금'
// 나머지는 분기준 숫자
export const updatedBefore = (timestamp?: Date) => {
  if (!timestamp) return undefined;

  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return '방금';
  return `${minutes.toString()}분`;
};
