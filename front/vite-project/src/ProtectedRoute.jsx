

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  // Verifica que el usuario esté definido y tenga un ID y un token
  if (!user || !user.id || !user.token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;






