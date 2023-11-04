import React, { useEffect, useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/Profile.module.css';
import coverPhoto from '../../public/images/coverphoto.jpg';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { TextField,Card, Button,Link,  Box, Stack, CardHeader, CardContent, Grid} from '@mui/material';
import locationIcon from '../../public/icons/location.svg';
import contactIcon from '../../public/icons/contact.svg';
import emailIcon from '../../public/icons/email.svg';
import uploadIcon from '../../public/icons/upload.svg';
import StarRatingChart from '../../components/StarRatingChart'
import IconButton from '@mui/material/IconButton';
import samplePost from '../../public/images/samplepost.jpg'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import SmsIcon from '@mui/icons-material/Sms';
import CheckIcon from '@mui/icons-material/Check';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Head from 'next/head';
import Image from "next/image";
import { GO_TO_PROFILE } from '../../graphql/operations/search';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {formatWideAddress} from '../../util/addresssUtils.js';
import { useRouter } from "next/router";
import Rating from '@mui/material/Rating';
import toast from 'react-hot-toast';
import { REQUEST_CONNECTION, REMOVE_CONNECTION } from '../../graphql/operations/myNetwork';
import { GET_ALL_REVIEWS, CHECK_PERMISSION, WRITE_REVIEW, GET_MY_REVIEW, EDIT_REVIEW } from '../../graphql/operations/review';
import OptionsMenu from '../../components/popups/OptionsMenu';
import CircularLoading from '../../components/circularLoading';
import { AuthContext } from '../../context/auth'; 
import RateAndReviewModal from "../../components/Review/RateAndReviewModal";
import EditReviewModal from '../../components/Review/EditReviewModal';
import chaticonsIcon from "../../public/icons/chaticon.png";
import CustomDialog from '../../components/popups/customDialog';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { formatDate } from '../../util/dateUtils.js';

const ButtonsDisplay = ({userId, connStatus, requestConnection, disconnect, router}) =>{
    const [openDialog, setOpenDialog] = useState("");

    const DynamicBtn = () =>{
        if(!connStatus || connStatus == "disconnected"){
            return(
                
                <Button
                    variant="contained"
                    style={{
                      backgroundColor:"#32816B",
                      width: "100%",
                      borderRadius: "7px",
                      boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={()=>{
                            requestConnection({variables:{"connectTo":userId}})
                        }}
                  > 
                    Connect
                  </Button>
            )
        } else if(connStatus == "pending"){
            return(
                <Button
                    variant="contained"
                    style={{
                    backgroundColor:  "#F8F9F8",
                    width: "100%",
                    borderRadius: "7px",
                    boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    disabled={true}
                > 
                    Pending...
              </Button>
            )
        } else if(connStatus=="connected"){
            return(
                <Button
                    variant="contained"
                    startIcon={<CheckIcon/>}
                    style={{
                      backgroundColor:"#32816B",
                      width: "100%",
                      borderRadius: "7px",
                      boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={()=>{
                        setOpenDialog("disconnect");
                    }}
                  > 
                    Connected
                  </Button>
            )
        }
    }
    
    
//         <IconButton 
//         variant="outlined" 
//         // color="success" 
//         onClick={handleClickOpen}
//         sx={{
//             boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
//         }}
//         >
//             <MoreHorizIcon/>
//         </IconButton>

    return(
    <>
    <Stack direction="row" spacing={2}>
        <DynamicBtn/>
        <Button
        variant="contained"
        style={{
            backgroundColor: "#FBF9F7",
            width: "100%",
            color: "#1D1E22",
            borderRadius: "7px",
            boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
        }}
        onClick={()=>{
            router.push(`/Chats?userId=${userId}`);
        }}
        >
        <Image
            src={chaticonsIcon}
            alt="Chat Icon"
            width={20}
            height={20}
            style={{ marginRight: "5px" }}
        />
            Message
        </Button>

    </Stack>

    {/* Disconnect Dialog */}
    {openDialog == "disconnect" && (<CustomDialog
        openDialog={Boolean(openDialog)}
        setOpenDialog={setOpenDialog}
        title = {"Disconnect"}
        message={"Do you want to disconnect with this user?"}
        btnDisplay={0}
        callback={()=>{
            disconnect();
        }}
    />)}

    </>)

}

export default function FindUserPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
  
    useEffect(() => {
      if (user.role == 'ADMIN') {
        router.push('/404');
      }
    }, [user]);
  
    return user.role != 'ADMIN' ? <FindUser /> : null;
}

function FindUser(){
    const {user} = useContext(AuthContext);
    const router = useRouter();
    const id = router.query.id;

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [UserPostDescrip, setUserPostDescrip ] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState("");

    // Request Connection
    const [requestConnection, {data:requestConnectionData}] = useMutation(REQUEST_CONNECTION,{
    refetchQueries:[GO_TO_PROFILE],
    onError:(err)=>{
        toast.error(err.graphQLErrors[0].message);
    },
    onCompleted:(requestConnectionData)=>{
        toast.success(requestConnectionData.requestConnection.message);
    }
    });

    const handleButtonClick=(e)=>{
        e.preventDefault();
    }
    // Get profile information
    const { loading, error, data } = useQuery(GO_TO_PROFILE,{
        variables:{
            userId:id
        }, 
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });

    const [getAllReviews, {data:getReviewsData, loading:getReviewsLoading, error:getReviewsError}] = useLazyQuery(GET_ALL_REVIEWS, {
        variables:{
            subjectedUser:id
        }, 
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });

    const [checkPermission, {data:getPermissionToReviewData, loading:getPermissionToReviewLoading}] = useLazyQuery(CHECK_PERMISSION, {
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });

    const [getMyReview, {data:getMyReviewData, loading:getMyReviewLoading}] = useLazyQuery(GET_MY_REVIEW, {
        variables:{
            "subjectedUser":id
        },
        onError:(error)=>{
            toast.error(error.message);
            console.error(error);
        }
    });

    const [writeReview] = useMutation(WRITE_REVIEW);
    const [editReview] = useMutation(EDIT_REVIEW);

    // Remove Connection
    const [removeConnection] = useMutation(REMOVE_CONNECTION,{
        refetchQueries:[GO_TO_PROFILE],
        onError:(err)=>{
            toast.error(err.graphQLErrors[0].message);
        },
        onCompleted:(removeConnectionData)=>{
            toast.success(removeConnectionData.removeConnection.message);
        }
    });
    
    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      useEffect(()=>{
        if(data && !loading){
            getAllReviews();
            checkPermission();
        }
      },[data, loading]);

    useEffect(()=>{
        if(getReviewsData){
          setReviews(getReviewsData?.getAllReviews);
        }
      },[getReviewsData, getReviewsLoading]);

    useEffect(()=>{
    if(getPermissionToReviewData?.checkPermissionToReview){
        getMyReview();
    }

    }, [getPermissionToReviewData, getPermissionToReviewLoading])

      const handleWriteReview = async(rate, comment) => {
        try {
            await writeReview({
                variables:{
                    "reviewInput": {
                      "rate": rate,
                      "comment": comment,
                      "subjectedUser": id
                    }
                  },
                  refetchQueries:[{
                    query:GET_MY_REVIEW,
                    variables:{
                        "subjectedUser":id
                    },
                  },{
                    query:GO_TO_PROFILE,
                    variables:{
                        userId:id
                    },
                }],
                  update:(cache, {data})=>{
                    const existingData = cache.readQuery({
                        query:GET_ALL_REVIEWS,
                        variables:{
                            subjectedUser:id
                        }
                    });

                    cache.writeQuery({
                        query:GET_ALL_REVIEWS,
                        variables:{
                            subjectedUser:id
                        },
                        data:{
                            getAllReviews:[data.writeReview, ...existingData.getAllReviews]
                        }
                    })
                  },
                  onCompleted:()=>{
                    toast.success("Successfully written Review");
                  },
                  onError:(error)=>{
                    toast.error(error.message);
                  }
            })
        } catch (error) {
            toast.error(error?.message);
            console.error(error);
        }
      };

      const handleEditReview = async(reviewId, rate, comment) => {
        try {
            await editReview({
                variables:{
                    "reviewId": reviewId,
                    "rate": rate,
                    "comment": comment
                  },
                  refetchQueries:[{
                    query:GET_MY_REVIEW,
                    variables:{
                        subjectedUser:id
                    },
                  }, {
                    query:GET_ALL_REVIEWS,
                    variables:{
                        subjectedUser:id
                    },
                  },{
                    query:GO_TO_PROFILE,
                    variables:{
                        userId:id
                    },
                }],
                  onCompleted:()=>{
                    toast.success("Successfully edited Review");
                  },
                  onError:(error)=>{
                    toast.error(error.message);
                  }
            })
        } catch (error) {
            toast.error(error?.message);
            console.error(error);
        }
      };

      
    const handleCloseModal = () =>{
        setIsModalOpen("");
    }
    const handleNextReview = () => {
    if (currentReviewIndex < reviews.length - 1) {
        setCurrentReviewIndex(currentReviewIndex + 1);
    }
    };

    const handlePreviousReview = () => {
    if (currentReviewIndex > 0) {
        setCurrentReviewIndex(currentReviewIndex - 1);
    }
    };

    if (loading) return (
        <div style={{height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <CircularLoading/>
        </div>
    
    );
    if (error) return <p>Error: {error.message}</p>;
    if(data && data.goToProfile.profile){
        const { _id, profile_pic, 
            username, address, 
            is_verified, role, 
            rating, 
            ratingStatistics, 
            account_mobile, 
            account_email, 
            cover_photo,
            description, displayName
        } = data?.goToProfile.profile;

        const ratingsData = {
            1: ratingStatistics.oneStar ?? 0,
            2: ratingStatistics.twoStar ?? 0,
            3: ratingStatistics.threeStar ?? 0,
            4: ratingStatistics.fourStar ?? 0,
            5: ratingStatistics.fiveStar ?? 0,
        };

        const connStatus = data.goToProfile.connectionStatus;

        const activeProfilePic = profile_pic || "https://img.freepik.com/free-icon/user_318-159711.jpg"
        const reviewerNumber = `Rating Overview (${ratingStatistics.reviewerCount ?? 0})`;
        return(
            <Box sx={{margin:"auto", paddingInline:"10em", paddingBottom:"5em"}}>
                <Head>
                    <title>Search</title>
                    <meta name="description" content="User or Group" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Grid container sx={{position:"relative"}}>
                    <Grid item xs = {12}>
                        <Card elevation={3} sx={{height:"20em", borderRadius:"0.6rem",  backgroundColor: "#FCFCFF",}}>
                            <img src={cover_photo ?? ""} style={{display:"flex", objectFit:"cover", height:"100%", width:"100%"}}/>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                        {/* <Card elevation={3} sx={{height:"7em"}}> */}
                            <Grid container>
                                <Grid item xs={3}>
                                        <Avatar
                                            src={profile_pic ?? ""}
                                            sx={{
                                            position:"absolute",
                                            top: "11em",
                                            left: "3em",
                                            width: "10em",
                                            height: "10em",
                                            border: "4px solid white",
                                            boxShadow: "2px 2px 2px #888888"
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
                                            {username ?? ""}{is_verified?<VerifiedIcon color="success"/>:""}
                                        </Typography>
                                        {displayName && (<Typography
                                            variant="body2"
                                            sx={{color:"grey"}}
                                        >
                                            {`(${displayName})`}
                                        </Typography>)}
                                        <Typography
                                            variant="body3"
                                            sx={{color:"green"}}
                                        >
                                            {role}
                                        </Typography>
                                        </div>
                                        
                                    </div>
                                    
                                </Grid>
                                <Grid item xs={3} sx={{paddingTop:"1em"}}> 

                                <ButtonsDisplay userId={_id} connStatus={connStatus} requestConnection={requestConnection} disconnect={()=>{
                                    removeConnection({variables:{connectedUserId:_id}})
                                }} router={router}/>

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
                         {data?.goToProfile?.connections}
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
                        {data?.goToProfile?.connections > 1 ? "Connections": "Connection"}
                        </Typography>
                    </Divider>
        
                    <Grid item xs={12} sx={{mt:"3em"}} >
                        <Grid container spacing={2}>
                            <Grid item xs={5}>
                              <Card elevation={3} sx={{paddingBlock:"1em", paddingInline:"2em", borderRadius:"10px",  backgroundColor: "#FCFCFF",}}>
                                        
                                        {description ? (
                                        <Typography sx={{wordWrap:"break-word"}}>
                                          {description}
                                        </Typography>
                                        ):(
                                            <Typography sx={{textAlign:"center"}}>
                                                No Description 
                                            </Typography>
                                        )}
                                </Card>
                                <Card elevation={3} sx={{padding:"1em", borderRadius:"10px", marginBlock:"1em",  backgroundColor: "#FCFCFF",}}>
                                    <Typography variant="h6" sx={{fontWeight:"bold"}}>
                                        About
                                    </Typography>
                                    <div style={{minHeight:"3em"}}>
                                      <div className={styles.locationtitle}>
                                        <Image
                                          sx={{ width: "10px", height: "15px" }}
                                          src={locationIcon}
                                          alt="Location"
                                          width={20}
                                          height={25}
                                        />
                                        <p className={styles.infoContent}>
                                          {formatWideAddress(address)}
                                        </p>
                                      </div>
                                      {account_mobile && (
                                        <>
                                          <div className={styles.contacttitle}>
                                            <Image
                                              sx={{ width: "10px", height: "15px" }}
                                              src={contactIcon}
                                              alt="Contact Number"
                                              width={20}
                                              height={25}
                                            />
                                            <p className={styles.infoContent}>{account_mobile}</p>
                                          </div>
                                        </>
                                      )}
                                      {account_email && (
                                        <>
                                          <div className={styles.emailtitle}>
                                            <Image
                                              sx={{ width: "10px", height: "15px" }}
                                              src={emailIcon}
                                              alt="Email Address"
                                              width={20}
                                              height={25}
                                            />
                                            <p className={styles.infoContent}>{account_email}</p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={7}>
                                {/* Ratings */}
                                <Card
                                  className={styles.ratingsChart}
                                  sx={{
                                    width: "100%",
                                    height: "max-Content",
                                    borderRadius: "10px",
                                    padding: "1em 1.5em",
                                    marginBottom:"1em",
                                    backgroundColor: "#FCFCFF",
                                    boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div style={{ width: "40%", textAlign: "center" }}>
                                      <Typography
                                        sx={{ fontSize: "20px", fontWeight: "bolder" }}
                                      >
                                        {reviewerNumber}
                                      </Typography>
                                      <Typography sx={{ fontSize: "5rem", fontWeight: "bold" }}>
                                        {rating.toFixed(1)}
                                      </Typography>
                                      <Rating name="read-only" value={rating} readOnly />
                                    </div>
                                    <div style={{ width: "60%" }}>
                                      <StarRatingChart ratings={ratingsData} />
                                    </div>
                                  </div>
                                </Card>
        
                                {/* Reviews */}
                                {!getMyReviewData?.getMyReview && (<Card
                                className={styles.reviewCard}
                                sx={{
                                    width: "100%",
                                    height: "max-content",
                                    borderRadius: "10px",
                                    padding: "1em",
                                    backgroundColor: "#FCFCFF",
                                    boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    marginBlock:"1em"
                                }}
                                > 
                                    {getPermissionToReviewLoading && (<div style={{display:"flex", margin:"auto"}}>
                                        <CircularLoading/>
                                    </div>)}

                                    {getPermissionToReviewData && !getPermissionToReviewData?.checkPermissionToReview &&(
                                        <Typography>Verify account to review</Typography>
                                    )}

                                    { getPermissionToReviewData?.checkPermissionToReview && !getMyReviewData?.getMyReview
                                    && (
                                        <div
                                            style={{display:"flex", margin:"auto"}}
                                        >
                                            <Button
                                                endIcon={<ChevronRightIcon/>}
                                                onClick={()=>{
                                                    setIsModalOpen("newReview");
                                                }}
                                            >
                                                Rate and Review
                                            </Button>
                                        </div>
                                        )}
                                </Card>)}
                                {getPermissionToReviewData?.checkPermissionToReview && getMyReviewData?.getMyReview && (
                                    <Card
                                    className={styles.reviewCard}
                                    sx={{
                                        width: "100%",
                                        height: "max-content",
                                        borderRadius: "10px",
                                        padding: "1em",
                                        backgroundColor: "#FCFCFF",
                                        boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                        marginBlock:"1em"
                                    }}
                                    > 
                                        <CardHeader
                                            
                                            action={
                                                <Button 
                                                onClick={()=>{
                                                    setIsModalOpen("editReview");
                                                }}
                                                size="small"
                                                >
                                                    Edit
                                                </Button>
                                            }
                                            title={"Your Review"}
                                        />
                                        <CardContent>
                                            <div style={{display:"flex"}}>
                                                <div >
                                                    <Rating name="rate" 
                                                    value={getMyReviewData?.getMyReview?.rate ?? 0} 
                                                    readOnly />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {getMyReviewData?.getMyReview.comment ?? ""}
                                                    </Typography>
                                                </div>
                                            </div>

                                        </CardContent>
                                    </Card>
                                    )}
                                    {getReviewsLoading && (
                                    <div style={{display:"flex", margin:"auto",  backgroundColor: "#FCFCFF",}}>
                                        <CircularLoading/>
                                    </div>
                                    )}
                                    {getReviewsData?.getAllReviews.length == 0 && (
                                    <div style={{display:"flex", margin:"auto",  backgroundColor: "#FCFCFF",}}>
                                        <p>No Reviews</p>
                                    </div>
                                    )}
                                    {getReviewsData && (<Card elevation={3} sx={{paddingBlock:"1em", paddingInline:"2em", borderRadius:"10px", marginBlock:"1em",  backgroundColor: "#FCFCFF",}}>
                                        <div style={{display:"flex", flexDirection:"row" }}>
                                        <div>
                                            <Typography variant="h6" sx={{fontWeight:"bold"}}>
                                                Reviews
                                            </Typography>
                                        </div>
                                        <div style={{display:"flex",flex:1, justifyContent:"end"}}>
                                            <IconButton
                                            onClick={handlePreviousReview}
                                            disabled={currentReviewIndex === 0 }
                                            >
                                            <ArrowBackIosIcon/>
                                            </IconButton>
                                            <IconButton
                                            onClick={handleNextReview}
                                            disabled={currentReviewIndex === reviews.length - 1}
                                            >
                                            <ArrowForwardIosIcon/>
                                            </IconButton>
                                        </div>
                                        </div>
                                        <div style={{marginBlock:"1em"}}>
                                        <div style={{display:"flex", paddingInline:"1em"}}>
                                            <div style={{display:"flex", flex:1,}}>
                                            <Avatar
                                            src=""
                                            width="400px"
                                            height="400px"
                                            sx={{marginRight:"1em"}}
                                            />
                                            <div style={{display:"flex", flexDirection:"column"}}>
                                                <Typography
                                                variant="title2"
                                                >
                                                    {reviews[currentReviewIndex]?.username ?? ""}
                                                </Typography>
                                                <Rating name="rate" 
                                                value={reviews[currentReviewIndex]?.rate ?? 0} 
                                                sx={{fontSize:"1rem"}}
                                                readOnly 
                                                />
                                            </div>
                                            </div>
                                            <div  style={{display:"flex", flex:1, justifyContent:"end"}}>
                                                <Typography
                                                variant="caption"
                                                sx={{color:"#c5c5c5"}}
                                                >
                                                    {reviews[currentReviewIndex]?.edited ? "edited":""}
                                                </Typography>
                                            </div>
                                        </div>
            
                                        <div style={{paddingInline:"1em", paddingTop:"0.5em"}}>
                                            <Typography>
                                            {reviews[currentReviewIndex]?.comment ?? ""}
                                            </Typography>
                                        </div>
                                        <div style={{display:"flex", justifyContent:"end", paddingInline:"1em"}}>
                                            <Typography
                                                variant="caption"
                                                sx={{color:"#c5c5c5"}}
                                            >
                                                {formatDate(reviews[currentReviewIndex]?.date, "ll")}
                                            </Typography>
                                        </div>
            
                                        </div>
                                    </Card>)}
                                    { isModalOpen == "newReview" && (
                                        <RateAndReviewModal
                                            isOpen={Boolean(isModalOpen)}
                                            onClose={handleCloseModal}
                                            handleWriteReview={handleWriteReview}
                                        />)}
                                    {isModalOpen == "editReview" && (
                                        <EditReviewModal
                                            isOpen={Boolean(isModalOpen)}
                                            onClose={handleCloseModal}
                                            handleEditReview={handleEditReview}
                                            myReviewData={getMyReviewData?.getMyReview}
                                        />
                                    )}
                                </Grid>
                            
                            </Grid>
                        </Grid>
                   
                    </Grid>
            </Box>
        );
    }


}