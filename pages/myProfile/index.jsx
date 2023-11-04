import React, { useEffect, useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "../../styles/Profile.module.css";
import coverPhoto from "../../public/images/coverphoto.jpg";
// import profilePhoto from '../../public/images/pfp.jpg';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { TextField, Card, Button, Link, Rating, Grid, Box } from "@mui/material";
import locationIcon from "../../public/icons/location.svg";
import contactIcon from "../../public/icons/contact.svg";
import emailIcon from "../../public/icons/email.svg";
import uploadIcon from "../../public/icons/upload.svg";
import StarRatingChart from "../../components/StarRatingChart";
import IconButton from "@mui/material/IconButton";
import samplePost from "../../public/images/samplepost.jpg";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Head from "next/head";
import Image from "next/image";
import { GET_MY_PROFILE } from "../../graphql/operations/profile";
import { GET_ALL_REVIEWS } from "../../graphql/operations/review";
import CircularLoading from "../../components/circularLoading";
import {AuthContext} from "../../context/auth";
import { useQuery, useLazyQuery } from "@apollo/client";
import { formatWideAddress } from "../../util/addresssUtils.js";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import VerifiedIcon from '@mui/icons-material/Verified';
import toast from "react-hot-toast";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useRouter} from "next/router";

import { formatDate } from "../../util/dateUtils.js";

export default function MyProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role == 'ADMIN') {
      router.push('/404');
    }
  }, [user]);

  return user.role != 'ADMIN' ? <MyProfile /> : null;
}


function MyProfile() {
  const {user} = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_MY_PROFILE,{
    onError:(error)=>{
      toast.error(error.message);
    }
  });
  const [getAllReviews, {data:getReviewsData, loading:getReviewsLoading}] = useLazyQuery(GET_ALL_REVIEWS, {
    variables:{
      subjectedUser:user.id
    }, 
    onError:(error)=>{
      toast.error(error.message);
      console.error(error);
    }
  });
  
  useEffect(()=>{
    if(data && !loading){
      getAllReviews();
    }
  }, [data, loading])
  
  useEffect(()=>{
    if(getReviewsData && !getReviewsLoading){
      setReviews(getReviewsData?.getAllReviews);
    }
  },[getReviewsData, getReviewsLoading])

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

  // const {
  //   _id:reviewId, 
  //   username:reviewerUsername, 
  //   profile_pic:reviewerProfile_Pic, 
  //   rate:reviewerRate,
  //   comment:reviewerComment,

  // } = ;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [UserPostDescrip, setUserPostDescrip] = useState("");

  const handleButtonClick = (e) => {
    e.preventDefault();
  };

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


 
  if (loading) return(
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <CircularLoading/>
    </div>
  
  );
  if (error) return <p>Error: {error.message}</p>;


  const {
    profile_pic,
    username,
    address,
    is_verified,
    role,
    rating,
    ratingStatistics,
    account_mobile,
    account_email,
    cover_photo,
    description, displayName
  } = data.getMyProfile.profile;

  const ratingsData = {
    1: ratingStatistics.oneStar ?? 0,
    2: ratingStatistics.twoStar ?? 0,
    3: ratingStatistics.threeStar ?? 0,
    4: ratingStatistics.fourStar ?? 0,
    5: ratingStatistics.fiveStar ?? 0,
  };

  const activeProfilePic =
    profile_pic || "https://img.freepik.com/free-icon/user_318-159711.jpg";
  const reviewerNumber = `Rating Overview (${
    ratingStatistics.reviewerCount ?? 0
  })`;

  return(
    <Box sx={{margin:"auto", paddingInline:"10em", paddingBottom:"5em"}}>
        <Head>
            <title>My Profile</title>
            <meta name="description" content="My Profile page" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid container sx={{position:"relative"}}>
            <Grid item xs = {12}>
                <Card elevation={3} sx={{height:"20em", borderRadius:"0.6rem",  backgroundColor: "#FCFCFF",}}>
                    <img src={cover_photo} style={{display:"flex", objectFit:"cover", height:"100%", width:"100%"}}/>
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
                 {data?.getMyProfile?.connections}
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
                Connections
                </Typography>
            </Divider>

            <Grid item xs={12} sx={{mt:"3em"}} >
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <Card elevation={3} sx={{paddingBlock:"1em", paddingInline:"2em", borderRadius:"10px",  backgroundColor: "#FCFCFF",}}>
                                
                                {description? (
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
                                <IconButton>
                                  <ArrowBackIosIcon
                                    onClick={handlePreviousReview}
                                    disabled={currentReviewIndex === 0}
                                  />
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
                    </Grid>
                    
                </Grid>
            </Grid>
           
        </Grid>
    </Box>
);
}
