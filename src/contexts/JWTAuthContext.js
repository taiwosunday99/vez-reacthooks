import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import SplashScreen from 'src/components/SplashScreen';
import axios from 'src/utils/axios';
import * as axios2 from 'axios';


const initialAuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const isValidToken = accessToken => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) 
{    case 'INITIALISE': {
      const { isAuthenticated, user } = action.payload;
      console.log('user', user);
      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }

    case 'RESET': {
      const { user } = action.payload;
      console.log('user from Context: ', user)
      return {
        ...state,
        isAuthenticated: true,
        user
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => {},
  reset: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);


  const reset = async values => {
    try {
      const url = 'https://secure.vezeti.net/test-api/v3/forgotpassword/';
      const data = {
        "orgId": "728934",
        "referenceId": "3RB3t99390ZI322B18712",
        "email": values.email,
      };
      const config = {
        method: 'POST',
        headers: {
          Authorization:
            'Basic dGFpd29zdW5kYXk5OUBnbWFpbC5jb206TTBuZSFXZXQxYU5EISE=',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        url
      };
      const response = await axios2(config);
      const isSuccess = response.data.responseCode == '00' ? true : false;
      if (isSuccess) {
        // setSession(accessToken);
        console.log(isSuccess);
        dispatch({
          type: 'RESET',
          payload: {
            user: response.data.responseData,
            message: response.data.responseMessage
          }
        });
        
        return {
          isSuccess,
          ...response
        };
      } else {
        return {
          isSuccess,
          ...response
        };
      }
    } catch (err) {
      return {
        ...err
      }
    }
  }

  const login = async values => {
    // https://secure.vezeti.net/api/v3/login/
    // https://secure.vezeti.net/test-api/v3/login/
    try {
      const url = 'https://secure.vezeti.net/test-api/v3/login/';
      const data = {
        orgId: '728934',
        typeEmailOrPhone: 'email',
        email: values.email,
        password: values.password
      };
      const config = {
        method: 'POST',
        headers: {
          Authorization:
            'Basic dGFpd29zdW5kYXk5OUBnbWFpbC5jb206TTBuZSFXZXQxYU5EISE=',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        url
      };
      const response = await axios2(config);
      const { accessToken } = response.data;

      const isSuccess = response.data.responseCode == '00' ? true : false;
      if (isSuccess) {
        setSession(accessToken);
        dispatch({
          type: 'LOGIN',
          payload: {
            user: response.data.responseData
          }
        });

        return {
          isSuccess
        };
      } else {
        return {
          isSuccess,
          ...response
        };
      }
    } catch (err) {
      return {
        ...err
      };
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async values => {
  
    try {
      const url = 'https://secure.vezeti.net/test-api/v3/signup/';
      const data = {
        orgId: '728934',
        firstName: values.firstName,
        lastName: values.lastName,
        mobile: values.mobile,
        email: values.email,
        password: values.password
      };
      const config = {
        method: 'POST',
        headers: {
          Authorization:
            'Basic dGFpd29zdW5kYXk5OUBnbWFpbC5jb206TTBuZSFXZXQxYU5EISE=',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        url
      };
      const response = await axios2(config);
      const isSuccess = response.data.responseCode == '00' ? true : false;

      if (isSuccess) {
        dispatch({
          type: 'REGISTER',
          payload: {
            user: response.data.responseData
          }
        });
        return {
          isSuccess
        };
      } else {
        return {
          isSuccess,
          ...response
        };
      }
    } catch (err) {
      return {
        ...err
      };
    }
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/api/account/me');
          const { user } = response.data;

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        reset,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
