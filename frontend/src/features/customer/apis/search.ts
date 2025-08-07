const searchRoute = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch('/src/features/customer/mocks/searchRoute.json');
  const data = await response.json();
  // query 파라미터로 간단한 필터링 (예: placeName에 query가 포함된 결과만 반환)
  if (!query) return data;
  return data;
};

export { searchRoute };
