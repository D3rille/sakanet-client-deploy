import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import bg from "../bg/welcomeback.jpg";
import bgimg from "../public/bg/backimg.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Collapse from '@mui/material/Collapse';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useContext, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from "@mui/material/Slide";
import { LOGIN_USER } from "../graphql/operations/auth";
import CircularLoading from '../components/circularLoading';
import {useRouter} from 'next/router';
import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth';
import { useMutation } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '../public/bg/LOGO-ONLY-FINAL.png';
import Image from 'next/image';
import Head from 'next/head';
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#02452d',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#02452d',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#02452d',
            },
            'input:-webkit-autofill': {
              'WebkitTextFillColor': '#02452d',
              'WebkitBoxShadow': '0 0 0px 1000px transparent inset',
              transition: 'background-color 5000s ease-in-out 0s',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#02452d',
            '&.Mui-focused': {
              color: '#02452d',
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: '#02452d',
            '&.Mui-checked': {
              color: '#02452d',
            },
          },
        },
      },
    },
  });
  
  
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
};

const center = {
  position: "relative",
  top: "50%",
  left: "37%",
};

export default function Login() {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const vertical = "top";
    const horizontal = "right";

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const {onChange, onSubmit, values} = useForm(loginUser, {
        loginCred: "",
        password: ""
    });

    const [logUser, {loading}] = useMutation(LOGIN_USER, {
        update(proxy, {data:{login:userData}}){
            //console.log(result);
            context.login(userData);
        },
        // Display error
        onError(err){
            // console.log(err.graphQLErrors[0].message);
            toast.error(err?.graphQLErrors[0]?.message);
            // setErrors(err);
            
        },
        // display toast upon completion
        onCompleted:(data)=>{
          if(data.login.role == "ADMIN"){
            router.replace('/Admin');
          } else{
            router.replace('/');
          }
        },
        //variables to pass on mutation, copy paste from apollo playground then only change the value
        variables:{
            "loginCred": values.loginCred,
            "password": values.password
          }
    });
   
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }
     setOpen(false);
    };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  function loginUser(){
    // setOpen(true);
    logUser();
  }


  return (
    <>
      <Toaster/>
        <div
        style={{
            backgroundImage: bgimg,
            backgroundSize: "cover",
            height: "100vh",
            color: "#f5f5f5",
            overflow:"auto"
        }}
        >
          <Head>
            <title>Login</title>
            <meta name="description" content="Login page" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        <Box sx={boxstyle}>
          <Collapse in={open}>
            <Alert
              severity = "error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
            {Object.keys(errors).length > 0 && (
                Object.values(errors).map ((value)=>(
                  <p key={value}>{value}</p>
              ))
            )}
            </Alert>
          </Collapse>
            <Grid container>
            <Grid item xs={12} sm={12} lg={6}>
                <Box
                style={{
                    backgroundImage: "url(../bg/welcome-carry.jpg)",
                    backgroundSize: "cover",
                    marginTop: "15px",
                    marginLeft: "15px",
                    marginRight: "15px",
                    height: "66vh",
                    color: "#f5f5f5",
                    borderRadius: "20px",
                }}
                ></Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
                <Box
                style={{
                    backgroundSize: "cover",
                    height: "70vh",
                    // minHeight: "500px",
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                }}
                >
                <ThemeProvider theme={theme}>
                    <Container>
                    <Box height={35} />
                    <Box sx={center}>
                      <Avatar sx={{ ml: "40px", mb: "4px", bgcolor: "#ffffff", width: 56, height: 56, position: 'relative' }}>
                        <Image src={Logo} alt="Logo" layout="fill" objectFit="cover" />
                      </Avatar>
                      <Typography variant="h5" justifyContent="center"
                        style={{ marginLeft: "35px", fontWeight: 'bold', color: "#013208", marginTop: "10px" }}>
                        LOGIN
                      </Typography>
                    </Box>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={onSubmit}
                        sx={{ mt: 2 }}
                    >
                        <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                            <TextField
                            required
                            fullWidth
                            id="email"
                            label="Username/Email/Phone Number"
                            name="loginCred"
                            value={values.loginCred}
                            onChange={onChange}
                            autoComplete="email"
                            variant="outlined"
                            InputProps={{ style: { color: '#02452d' } }}
                            InputLabelProps={{ style: { color: '#02452d' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                          <TextField
                              required
                              fullWidth
                              name="password"
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              id="password"
                              value={values.password}
                              onChange={onChange}
                              autoComplete="new-password"
                              variant="outlined"
                              InputProps={{
                                style: { color: "#02452d" },
                                endAdornment: values.password && (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      edge="end"
                                      style={{ color: "#2E603A" }}
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              InputLabelProps={{ style: { color: "#02452d" } }}
                            />
                          
                        </Grid>

                        <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                            <Button
                            type="submit"
                            variant="contained"
                            fullWidth={true}
                            size="large"
                            sx={{
                                mt: "10px",
                                mr: "20px",
                                borderRadius: 28,
                                color: "#ffffff",
                                minWidth: "170px",
                                backgroundColor: "#02452d",
                                "&:hover": {
                                  backgroundColor: "#286652",
                                },
                            }}
                            >
                            Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                            <Stack direction="row" spacing={2} justifyContent="center" textAlign="center" >
                            <Typography
                                variant="body1"
                                component="span"
                                style={{ marginTop: "10px", color: "#013208",  }}
                            >
                                Not registered yet?{" "}
                                <span
                                style={{ color: "#FF9A01", cursor: "pointer" }}
                                onClick={() => {
                                    router.push("/register");
                                }}
                                >
                                Create an Account
                                </span>
                            </Typography>
                            </Stack>
                        </Grid>
                        </Grid>
                    </Box>
                    </Container>
                </ThemeProvider>
                </Box>
            </Grid>
            </Grid>
        </Box>
        </div>
    </>
  );

}
  
 

