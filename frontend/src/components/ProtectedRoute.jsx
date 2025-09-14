import React from 'react'
import { Link,  } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("token");

  return token ? children : <Link to="/" />;
}

export default ProtectedRoute;
