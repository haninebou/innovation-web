import { Navigate , Route } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const userRole = localStorage.getItem('userRole'); // Assuming role is stored in localStorage

  return (
    <Route
      {...rest}
      element={
        userRole === 'admin' ? element : <Navigate to="/not-authorized" />
      }
    />
  );
};

export default ProtectedRoute;
