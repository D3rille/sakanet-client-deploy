import { useState, useEffect, useContext, use } from 'react';
import {useRouter} from "next/router";
import {AuthContext} from "../context/auth";
import { CircularProgress, dividerClasses } from '@mui/material';


// reuseable Hook for events in form (login & signup)
export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  const onClear= () => {
    setValues(initialState);
  }

  return {
    onChange,
    onSubmit,
    onClear,
    values
  };
};

export const useAuthorizeRoute = (authorizedRoles=[]) =>{
  // const router = useRouter();
  const {user}  =useContext(AuthContext);

  var userAuthorized = false;
 
  for(let i=0 ; i<authorizedRoles.length; i++){
    if(authorizedRoles[i] == user.role){
      userAuthorized = true;
      break;
    }
  }

  return userAuthorized;
  // if(!userAuthorized){
  //   router.replace('/');
  // }

  /*
  Example use:
  const DashboardPage = () => {
    useProtectedRoute(['FARMER']); // Only users with 'FARMER' role can access
    // Render your dashboard content
  };
   */
} 