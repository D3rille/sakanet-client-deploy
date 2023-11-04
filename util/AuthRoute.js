import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import CircularProgress from '@mui/material/CircularProgress';



// function AuthRoute({ component: Component, ...rest }) {
//   const router = useRouter();
//   const { user } = useContext(AuthContext);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading delay
//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 1000); // Adjust the delay time as needed

//     return () => clearTimeout(timeout);
//   }, []);

//   var isLoginPage = router.pathname =="/login";
//   var isRegister = router.pathname =="/register"; 

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , zIndex:"200"}}>
//         <CircularProgress />
//       </div>
//     );
//   } 

//   if(user===null && !isLoginPage && !isRegister){
//     router.push('/login')
//     return <Component {...rest}/>
//   } else if(user ===null && (isLoginPage || isRegister)){
//     return <Component {...rest}/>
//   } else if(user && (isLoginPage || isRegister)){
//     router.push("/");
//     return <Component {...rest}/>
//   } else if (user){
//     return <Component {...rest}/>
//   }
  
// }

function AuthRoute({ component: Component, ...rest }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  
  if(!user){
    router.push("/login")
  }
  return (<Component {...rest}/>);
  
}

export default AuthRoute;