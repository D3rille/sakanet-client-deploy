import {Grid, Box, Card, Avatar, Typography, Button, Divider} from "@mui/material";
import {useMutation} from "@apollo/client";
import toast from "react-hot-toast";
// import Image from "next/image";

import styles from "../../styles/Profile.module.css";
import { JOIN_POOL_GROUP, GET_POOL_GROUP_INFO } from "../../graphql/operations/poolGroup";
import {formatDate} from "../../util/dateUtils";

const GuestView = ({isPending, data, poolGroupId}) => {
    const [joinPoolGroup] = useMutation(JOIN_POOL_GROUP);

    const handleJoinPoolGroup = ()=>{
        joinPoolGroup({
            variables:{
                poolGroupId
            },
            refetchQueries:[GET_POOL_GROUP_INFO], 
            onCompleted:(data)=>{
                toast.success(data?.joinPoolGroup);
            },
            onError:(error)=>{
                toast.error(error.message);
            }
        }).catch((err)=>{
            console.error(err);
        })
    }

    return(
        <Box sx={{margin:"auto", paddingInline:"10em", paddingBottom:"5em"}}>
            <Grid container sx={{position:"relative"}}>
                <Grid item xs = {12}>
                    <Card elevation={3} sx={{height:"20em", borderRadius:"0.6rem"}}>
                        <img src={data?.cover_photo ?? ""} style={{display:"flex", objectFit:"cover", height:"100%", width:"100%"}}/>
                    </Card>
                </Grid>
                
                <Grid item xs={12}>
                    {/* <Card elevation={3} sx={{height:"7em"}}> */}
                        <Grid container>
                            <Grid item xs={3}>
                                    <Avatar
                                        src={data?.profile_pic ?? ""}
                                        sx={{
                                        position:"absolute",
                                        top: "11em",
                                        left: "3em",
                                        width: "10em",
                                        height: "10em",
                                        border: "4px solid white",
                                        boxShadow: "5px 5px 5px #888888"
                                        }}
                                    />
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{display:"flex", justifyContent:"start", alignItems:"center", paddingTop:"1em"}}>
                                    <div style={{display:"flex",flexDirection:"column" }}>

                                    <Typography
                                        variant="title"
                                        sx={{fontSize:"1.8rem", fontWeight:"bold", wordBreak:"break-word"}}
                                    >
                                        {data?.groupName ?? ""}
                                    </Typography>
                                    <Typography
                                        variant="body3"
                                        sx={{color:"green"}}
                                    >
                                        {"POOL GROUP"}
                                    </Typography>
                                    </div>
                                    
                                </div>
                                
                            </Grid>
                            <Grid item xs={3}> 

                            {!isPending && (
                            <Button
                                variant="contained"
                                color="success"
                                sx={{
                                margin:"1em", 
                                backgroundColor:"#32816B",
                                paddingInline: "5em",
                                borderRadius: "7px",
                                boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={()=>{
                                    handleJoinPoolGroup();
                                }}
                            > 
                                Join
                            </Button>)}

                            {isPending && (<Button
                                variant="contained"
                                style={{
                                margin:"1em",
                                backgroundColor:  "#F8F9F8",
                                paddingInline: "5em",
                                borderRadius: "7px",
                                boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                                }}
                                disabled={true}
                            > 
                                Pending...
                            </Button>)}
                            </Grid>
                        </Grid>
                    {/* </Card> */}

                </Grid>
                <Divider
                    textAlign="right"
                    component="div"
                    role="presentation"
                    className={styles.numConnections}
                    sx={{marginTop:"0.5em"}}
                >
                    <Typography
                    variant="h4"
                    component="span"
                    style={{ fontWeight: "bolder", color: "#057a59" }}
                    >
                    {data?.membersCount}
                    </Typography>
                    <Typography
                    variant="h6"
                    component="span"
                    style={{
                        fontWeight: "normal",
                        color: "black",
                        marginInline: "4px",
                    }}
                    >
                    {data?.membersCount <=1 ? "Member": "Members"}
                    </Typography>
                </Divider>
                <Grid item xs={12} sx={{mt:"3em"}} >
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Card elevation={3} sx={{padding:"1em", borderRadius:"10px"}}>
                                <Typography variant="title2" sx={{fontWeight:"bold"}}>
                                    Date Created
                                </Typography>
                                <div style={{display:"flex", alignItems:"center", maxHeight:"3em"}}>

                                    <Typography >
                                        {formatDate(data.createdAt, "LL")}
                                    </Typography>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={9}>
                            <Card elevation={3} sx={{paddingBlock:"1em", paddingInline:"2em", borderRadius:"10px"}}>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>
                                    Description
                                </Typography>
                                {data?.groupDescription ? (
                                <Typography sx={{wordWrap:"break-word"}}>
                                  {data?.groupDescription}
                                </Typography>
                                ):(
                                    <Typography sx={{textAlign:"center"}}>
                                        No Description 
                                    </Typography>
                                )}
                            </Card>
                        </Grid>
                        
                    </Grid>
                </Grid>
               
            </Grid>
        </Box>
    );
    
}

export default GuestView;