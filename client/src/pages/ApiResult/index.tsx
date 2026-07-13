import React from 'react';
import { useLocation } from 'react-router-dom';
import SuccessPage from './components/SuccessPage';
import ErrorPage from './components/ErrorPage';

const ApiResult: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.includes('/success')) {
    return <SuccessPage {...(location.state as any)} />;
  }

  if (pathname.includes('/error')) {
    return <ErrorPage {...(location.state as any)} />;
  }

  return null;
};

export default ApiResult;
export { SuccessPage, ErrorPage };
