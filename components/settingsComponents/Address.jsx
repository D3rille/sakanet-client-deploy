import React, {useState, useEffect} from "react";
import {
  TextField,
  Divider,
  Button,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { styled } from "@mui/system";
import { formatWideAddress } from "../../util/addresssUtils";
import {useMutation} from "@apollo/client";
import { EDIT_ADDRESS } from "../../graphql/operations/settings";
import toast from "react-hot-toast";


const CustomTextField = styled(TextField)({
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


const Address = ({address}) => {
    const [openConfig, setOpenConfig] = useState(false);
    const [street, setStreet] = useState(address?.street ?? "");
    const [barangay, setBarangay] = useState(address?.barangay ?? "");
    const [cityOrMunicipality, setCityOrMunicipality] = useState(address?.cityOrMunicipality ?? "");
    const [province, setProvince] = useState(address?.province ?? "");
    const [region, setRegion] = useState(address?.region ?? "");

    const [editAddress] = useMutation(EDIT_ADDRESS,{
        variables:{
            "addressInput": {
              "street": street,
              "barangay": barangay,
              "cityOrMunicipality": cityOrMunicipality,
              "province": province,
              "region": region
            }
        }, 
        onCompleted:(data)=>{
            let hasEdited = false
            if(address?.street != street){
                hasEdited = true;
            } else if(address?.barangay != barangay){
                hasEdited= true;
            } else if(address?.cityOrMunicipality != cityOrMunicipality){
                hasEdited= true;
            } else if(address?.province != province){
                hasEdited= true;
            } else if(address?.region != region){
                hasEdited= true;
            }

            if(hasEdited){
                toast.success(data?.editAddress);
            }
                
        }
    });

    const handleCloseConfig = () =>{
        setOpenConfig(false);
    }

    let currentAddress = {
        street,
        barangay,
        cityOrMunicipality,
        province,
        region
    }

    return (
        <Box sx={{paddingTop:"1rem", margin:"2rem"}}>
            <Grid container>
                <Grid item xs={12}>
                    <h3>Current Address</h3>
                    <div style={{ display:"flex", border: "3px solid #2E603A", padding:"1em", marginBlock:"0.5em", borderRadius:"10px"}}>

                        <Typography variant="h6">
                            {formatWideAddress(currentAddress)}
                        </Typography>
                    </div>
                    {openConfig && (
                    <>
                        <h3>Configure Address</h3>
                        <Typography variant="caption">
                            Enter your personal or business address.
                        </Typography>
                        <div style={{display:"flex", justifyContent:"start"}}>
                            <CustomTextField
                                variant="outlined"
                                placeholder="Street"
                                sx={{width:"33%", paddingRight:"1em"}}
                                InputProps={{
                                    style: {
                                    borderColor: "#2E603A",
                                    marginTop: "10px",
                                    },
                                }}
                                value={street}
                                onChange={e=>setStreet(e.target.value)}
                            />
                            <CustomTextField
                                variant="outlined"
                                placeholder="Barangay"
                                sx={{width:"33%", paddingInline:"1em"}}
                                InputProps={{
                                    style: {
                                    borderColor: "#2E603A",
                                    marginTop: "10px",
                                    },
                                }}
                                value={barangay}
                                onChange={e=>setBarangay(e.target.value)}
                            />
                            <CustomTextField
                                variant="outlined"
                                placeholder="Municipality or City"
                                sx={{width:"33%", paddingInline:"1em"}}
                                InputProps={{
                                    style: {
                                    borderColor: "#2E603A",
                                    marginTop: "10px",
                                    },
                                }}
                                value={cityOrMunicipality}
                                onChange={e=>setCityOrMunicipality(e.target.value)}
                            />
                            
                        </div>
                        <div style={{display:"flex", justifyContent:"start"}}>
                            <CustomTextField
                                variant="outlined"
                                placeholder="Province"
                                sx={{width:"33%", paddingRight:"1em"}}
                                InputProps={{
                                    style: {
                                    borderColor: "#2E603A",
                                    marginTop: "10px",
                                    },
                                }}
                                value={province}
                                onChange={e=>setProvince(e.target.value)}
                            />
                            <CustomTextField
                                variant="outlined"
                                placeholder="Region"
                                sx={{width:"33%", paddingInline:"1em"}}
                                InputProps={{
                                    style: {
                                    borderColor: "#2E603A",
                                    marginTop: "10px",
                                    },
                                }}
                                value={region}
                                onChange={e=>setRegion(e.target.value)}
                            />
                        </div>
                    </>
                    )}
                    <div style={{display:"flex", marginBlock:"1em"}}>
                        {!openConfig && (
                        <Button 
                        variant="contained" 
                        color="success"
                        onClick={()=>setOpenConfig(true)}
                        >
                            Edit
                        </Button>
                        )}
                        {openConfig && (<div>
                            <Button 
                                variant="contained" 
                                color="success"
                                sx={{marginRight:"0.5em"}}
                                onClick={()=>{
                                    editAddress();
                                    handleCloseConfig();
                                }}
                            >
                                Save Changes
                            </Button>
                            <Button 
                            variant="outlined" 
                            color="error"
                            onClick={handleCloseConfig}
                            >
                                Cancel
                            </Button>
                        </div>)}
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Address;
