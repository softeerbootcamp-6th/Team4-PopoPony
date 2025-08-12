const createAuthStorage = () => {
  let isLoggedIn: boolean = false;

  const checkAuth = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (response.status === 200) {
      const body = await response.json();
      isLoggedIn = body.status !== 401;
    } else {
      isLoggedIn = false;
    }
  };

  checkAuth();

  return {
    getIsLoggedIn: () => isLoggedIn,
    setIsLoggedIn: (value: boolean) => {
      isLoggedIn = value;
    },
  };
};

export const authStorage = createAuthStorage();
