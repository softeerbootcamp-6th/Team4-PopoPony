export const isLoggedIn = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  });
  if (response.status === 200) {
    const body = await response.json();
    if (body.status === 401) {
      return false;
    }
  }
  return true;
};
