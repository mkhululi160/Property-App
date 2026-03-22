import { useSelector } from 'react-redux';

const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const isAuthenticated = !!userInfo;
  const isAdmin = userInfo?.isAdmin || false;

  return {
    user: userInfo,
    isAuthenticated,
    isAdmin,
  };
};

export default useAuth;