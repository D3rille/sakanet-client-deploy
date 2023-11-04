import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

var token = null;

// This condition is used repeatedly because next.js was used and it renders first in the server,
// if used directly, it returns an error saying that localStorage is not defined
if (typeof window !== 'undefined') {
  token = sessionStorage.getItem('jwtToken');
}

if (token) {
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jwtToken');
    }
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    //localStorage.setItem('jwtToken', userData.token);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jwtToken', userData.token);
    }
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  // upon logout, remove token from localStorage
  function logout() {
    //localStorage.removeItem('jwtToken');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jwtToken');
    }
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };