import React from "react";
import {useState, useContext,  useEffect} from "react";
import {
  TextField,
  Divider,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import { styled } from "@mui/system";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { AuthContext } from "../../context/auth";
import { EDIT_EMAIL_OR_NUM, CHANGE_PASSWORD} from "../../graphql/operations/settings";
import {GET_MY_PROFILE} from "../../graphql/operations/profile";

const PasswordAndEmailContainer = styled("div")({
  paddingTop: "0.3rem",
  paddingBottom:"1em",
  margin: "2rem",
});

const EmailField = styled(TextField)({
  width: "420px",
  marginBottom: "5px",
  "& input": {
    height: "40px",
    padding: "0 14px",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2E603A",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2E603A",
  },
});

const PasswordField = styled(TextField)({
    flexDirection: "column",
    display:'flex',
  width: "420px",
  marginBottom: "5px",
  "& input": {
    height: "40px",
    padding: "0 14px",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2E603A",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2E603A",
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "#2E603A",
  "&:hover": {
    backgroundColor: "#FE8C47",
  },
});

const StyledDivider = styled(Divider)({
  marginTop: "10px",
  marginBottom: "10px",
});

const SaveButtonContainer = styled("div")({
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
});

const PasswordAndEmail = ({user}) => {
  const [changePassword, setChangePassword] = useState(false);
  const [changeEmailOrNum, setChangeEmailOrNum] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [defaultValues, setDefaultValues] = useState({
    email:"",
    phoneNumber:""
  });

  //visibility
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(()=>{
    if(user){
      setEmail(user?.account_email ?? "");
      setPhoneNumber(user?.account_mobile ?? "");
      setDefaultValues({
        email:user?.account_email,
        phoneNumber:user?.account_mobile
      });
    }
  },[user]);

  const [editEmailOrNum] = useMutation(EDIT_EMAIL_OR_NUM);
  const handleEmailOrNum = () =>{
    editEmailOrNum({
      variables:{
        email,
        phoneNumber,
      },
      refetchQueries:[GET_MY_PROFILE],
      onCompleted:(data)=>{
        if(data?.editEmailOrNum){
          toast.success(data?.editEmailOrNum);
        }
        setDefaultValues({
          email,
          phoneNumber
        });
        setChangeEmailOrNum(false);
      },
      onError:(err)=>{
        toast.error(err.message);
      }
    })
  }

  const [editPassword] = useMutation(CHANGE_PASSWORD);
  const handleSetPassword = () =>{
    editPassword({
      variables:{
        currentPass,
        newPass,
        confirmPass
      },
      onCompleted:(data)=>{
        toast.success(data?.changePassword);
        setChangePassword(false);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      },
      onError:(err)=>{
        toast.error(err.message)
      }
    })
  }

  const handleShowCurrentPass = () => setShowCurrentPass(!showCurrentPass);
  const handleShowNewPass = () => setShowNewPass(!showNewPass);
  const handleShowConfirmPass = () => setShowConfirmPass(!showConfirmPass);

  return (
    <PasswordAndEmailContainer>
      <div style={{ marginTop: "1rem" }}>
        <h3>Email</h3>
        {!changeEmailOrNum && (<Typography>
          {defaultValues.email ?? "None"}
        </Typography>)}
        {changeEmailOrNum && (<EmailField
          variant="outlined"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter Email Address"
          InputProps={{
            style: {
              borderColor: "#2E603A",
              marginTop: "10px",
            },
          }}
        />)}
        <h3>Phone Number</h3>
        {!changeEmailOrNum && (<Typography>
          {defaultValues.phoneNumber ?? "None"}
        </Typography>)}
        {changeEmailOrNum && (<TextField
          variant="outlined"
          placeholder="Enter Mobile Phone"
          value ={phoneNumber}
          onChange={(e)=>setPhoneNumber(e.target.value)}
          InputProps={{
            style: {
              borderColor: "#2E603A",
              marginTop: "10px",
              height:"40px",
              width:"420px"
            },
          }}
        />)}
        {/* <Typography variant="caption" style={{ display: "block" }}>
          Email address is optional
        </Typography> */}
        {!changeEmailOrNum && (<StyledButton 
        variant="contained" 
        sx={{marginTop:"1em"}}
        onClick={()=>setChangeEmailOrNum(true)}
        >
          Edit
        </StyledButton>)}

        {changeEmailOrNum && (
          <div style={{marginTop:"1em"}}>
            <StyledButton 
            variant="contained"
            onClick={handleEmailOrNum}
            >
              Save Changes
            </StyledButton>
            <StyledButton variant="outlined"
            onClick={()=>setChangeEmailOrNum(false)} 
            style={{ 
              color:"white",
              marginInline:"1em",
              "&:hover": {  
                backgroundColor: "#FE8C47",
              },
              }}>Cancel</StyledButton>
          </div>
      )}
      </div>

      <StyledDivider />

      <div>
        <h3 style={{ marginBottom: "10px" }}>Password</h3>
        {!changePassword && (<StyledButton 
        variant="contained" 
        onClick={()=>setChangePassword(true)}
        >
          Change Password
        </StyledButton>)}
          {changePassword && (<div>
            <PasswordField
                variant="outlined"
                name="current"
                placeholder="Enter Current Password"
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={(e)=>setCurrentPass(e.target.value)}
                InputProps={{
                  style: { color: "#02452d", borderColor: "#2E603A", },
                  endAdornment: currentPass && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowCurrentPass}
                        edge="end"
                        style={{ color: "#2E603A" }}
                      >
                        {showCurrentPass ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "#02452d" } }}
                style={{ marginBottom: "10px" }} 
                
            />
            <PasswordField
                variant="outlined"
                name="new"
                placeholder="Enter New Password"
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e)=>setNewPass(e.target.value)}
                InputProps={{
                  style: { color: "#02452d", borderColor: "#2E603A", },
                  endAdornment: newPass && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowNewPass}
                        edge="end"
                        style={{ color: "#2E603A" }}
                      >
                        {showNewPass ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "#02452d" } }}
                style={{ marginBottom: "10px" }} 
                
            />
            <PasswordField
                variant="outlined"
                name = "confirm"
                placeholder="Re-enter new Password"
                type={showConfirmPass ? "text" : "password"}
                value={confirmPass}
                onChange={(e)=>setConfirmPass(e.target.value)}
                InputProps={{
                  style: { color: "#02452d", borderColor: "#2E603A", },
                  endAdornment: confirmPass && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowConfirmPass}
                        edge="end"
                        style={{ color: "#2E603A" }}
                      >
                        {showConfirmPass ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "#02452d" } }}
                style={{ marginBottom: "10px" }} 
                
            />
            <Typography variant="caption" >
              Password Creation Guidelines:
            </Typography>
            <ul style={{fontSize:"0.7rem"}}>
              <li>Password must be at least 8 characters long</li>
              <li>Password must have an Uppercase and Lowercase letter.</li>
              <li>Password must have a number.</li>
            </ul>
          </div>)}
      </div>

      {changePassword && (
        <div style={{marginTop:"1em"}}>
          <StyledButton 
          variant="contained" 
          style={{marginBottom: '1rem'}}
          onClick={handleSetPassword}
          >
            Save Changes
            </StyledButton>
          <StyledButton variant="outlined"
          onClick={()=>setChangePassword(false)} 
          style={{
            marginBottom: '1rem', 
            color:"white",
            marginInline:"1em",
            "&:hover": {  
              backgroundColor: "#FE8C47",
            },
            }}>Cancel</StyledButton>
        </div>
      // <SaveButtonContainer>
      // </SaveButtonContainer>
      )}
    </PasswordAndEmailContainer>
  );
};

export default PasswordAndEmail;
