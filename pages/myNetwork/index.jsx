import React, { useEffect, useState, useContext } from 'react';
import {useMutation,  useQuery} from '@apollo/client';
import groupicon from '../../public/images/Screenshot 2023-07-23 102237.png';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, Link, CircularProgress, Grid, Box, IconButton, Button} from '@mui/material';
import styles from '../../styles/Navbar.module.css';
import { AuthContext } from '@/context/auth';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import Head from 'next/head';


import MyConnectionList from '../../components/myNetwork/MyConnectionList';
import Requests from '../../components/myNetwork/Requests';
import SuggestedUsers from '../../components/myNetwork/SuggestedUser';
import { GET_CONNECTED_USERS, GET_CONNECTION_REQUESTS, GET_SUGGESTED_USERS } from '../../graphql/operations/myNetwork';
import { GET_MANAGED_GROUPS, GET_JOINED_GROUPS } from '../../graphql/operations/poolGroup';
import { ACCEPT_CONNECTION, DECLINE_CONNECTION, REQUEST_CONNECTION } from '../../graphql/operations/myNetwork';
import { GET_SUGGESTED_GROUPS } from '../../graphql/operations/poolGroup';
import default_profile from "../../public/images/default_profile.jpg";
import { formatWideAddress } from '../../util/addresssUtils';
import CreatePoolGroupModal from "../../components/myNetwork/CreatePoolGroupModal";
import ManagedGroups from '../../components/myNetwork/ManagedGroups';
import JoinedGroups from "../../components/myNetwork/JoinedGroups";
import SuggestedGroups from '../../components/myNetwork/SuggestedGroups';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function MyNetworkPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role == 'ADMIN') {
      router.push('/404');
    }
  }, [user]);

  return user.role != 'ADMIN' ? <MyNetwork /> : null;
}

function MyNetwork(){
    const {user} = useContext(AuthContext);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isOpen, setIsOpen] = useState("");

    const suggestedUsersResults = useQuery(GET_SUGGESTED_USERS,{
      onError:(error)=>{
        toast.error(error.message);
        console.error(error);
      }
    });
    const suggestedGroupsResults = useQuery(GET_SUGGESTED_GROUPS, {
    });


    // Accept Connection
    const [acceptConnection, {data:acceptMutationData}] = useMutation(ACCEPT_CONNECTION,{
      refetchQueries:[
        GET_CONNECTED_USERS, GET_CONNECTION_REQUESTS
      ],
      onError:(err)=>{
        toast.error(err.graphQLErrors[0].message);
      },
      onCompleted:(acceptMutationData)=>{
        toast.success(acceptMutationData.acceptConnection.message);
      }
    });
    // Decline Request
    const [declineConnection, {data:declineMutationData}] = useMutation(DECLINE_CONNECTION,{
      refetchQueries:[
        GET_CONNECTED_USERS, GET_CONNECTION_REQUESTS
      ],
      onError:(err)=>{
        toast.error(err.graphQLErrors[0].message);
      },
      onCompleted:(declineMutationData)=>{
        toast(declineMutationData.declineConnection.message);
      }
    });

    // Request Connection
    const [requestConnection, {data:requestConnectionData}] = useMutation(REQUEST_CONNECTION,{
      refetchQueries:[GET_SUGGESTED_USERS],
      onError:(err)=>{
        toast.error(err.graphQLErrors[0].message);
      },
      onCompleted:(requestConnectionData)=>{
        toast.success(requestConnectionData.requestConnection.message);
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

  
  return (
    <div style={{margin:"5em"}}>
      <Head>
        <title>My Network</title>
        <meta name="description" content="My Network page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container spacing={4}>
        {/* Side Card */}
        <Grid item xs={3}>
          <Card style={{maxheight:"60em", borderRadius:"10px", padding:"1em"}}>
            <div style={{display:"flex", flexDirection:"column"}}>
              <div style={{minHeight:"20%", maxheight:"35%"}}>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                  <div style={{marginLeft:"0.5em", marginRight:"1em"}}>
                    <Image src ={groupicon} alt = "Group" width={30} height={35}/>
                  </div>
                  <p className={styles.title}> My connections</p>
                </div>
                <div className={styles.containerlist}>
                  <MyConnectionList />
                 </div>
              </div>

             {user?.role == "FARMER" && (<div style={{minHeight:"15%", maxheight:"32%"}}>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                  <div style={{marginLeft:"0.5em", marginRight:"1em"}}>
                      <Image src ={groupicon} alt = "Group" width={30} height={35}/>
                  </div>
                  <p className={styles.title} sx={{paddingInline:"1em"}}> Groups you manage</p>
                  <div style={{display:"flex", justifyContent:"end", width:"100%"}}>

                  <IconButton 
                    sx={{padding:0}}
                    onClick={()=>{
                      setIsOpen("create pool group");
                    }}
                  >
                    <AddIcon  sx={{color:"green"}}/>
                  </IconButton>
                  </div>
                </div>
                <div className={styles.containerlist} style={{padding:"auto", textAlign:"center"}}>
                  <ManagedGroups />
                 </div>
              </div>)}

              {user?.role == "FARMER" && (<div style={{minHeight:"15%", maxheight:"32%"}}>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                  <div style={{marginLeft:"0.5em", marginRight:"1em"}}>
                    <Image src ={groupicon} alt = "Group" width={30} height={35}/>
                  </div>
                  <p className={styles.title}> Groups you've joined</p>
                </div>
                <div className={styles.containerlist} style={{padding:"auto", textAlign:"center"}}>
                  
                  <JoinedGroups />
                 </div>
              </div>)}
            </div>
          </Card>
        </Grid>


        {/* Content 2 */}
        <Grid item xs={9}>
          <Card style={{maxheight:"60em", borderRadius:"10px", paddingTop:"1.5em"}}>
              {/* <Typography sx={{color:"grey", fontSize:"1.2rem", fontWeight:"bold", textAlign:"center", mb:"1em"}}>Connections</Typography> */}
              <Grid container >
                  {/* Connection Requests */}
                  <Grid item xs={12}>
                  <Typography sx={{paddingLeft:"2em",pb:"0.5em", fontSize:"1rem", fontWeight:"bold"}}>Connection Requests</Typography>
                    <Card className={styles.contentCard} sx={{display:"flex",borderRadius:'12px',border:'0.5px solid #f1f3fa',  paddingBlock:"1em", overflowX:"scroll"}}>
                      {/* <div className={styles.requestlist} sx={{display:"flex", flexDirection:"row"}}>
                      </div> */}
                        <Requests acceptConnection={acceptConnection} declineConnection={declineConnection}/>
                    </Card>
                  </Grid>
                  {/* Suggested Users */}
                  <Grid item xs={12}>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center", paddingBottom:"0.5em"}}>
                      <Typography sx={{paddingLeft:"2em", fontSize:"1rem", fontWeight:"bold"}}>Suggested Users</Typography>
                      <IconButton onClick={()=>{suggestedUsersResults.refetch()}} sx={{marginInline:"0.5em"}}>
                        <RefreshIcon/>
                      </IconButton>
                    </div>
                    <Card className={styles.contentCard} sx={{display:"flex",borderRadius:'12px',border:'0.5px solid #f1f3fa',  paddingBlock:"1em", overflowX:"scroll"}}>
                      <SuggestedUsers requestConnection={requestConnection} suggestedUsersResults={suggestedUsersResults}/>
                    </Card>
                  </Grid>

                  {/* Pool Groups you may join */}
                  {user?.role == "FARMER" && (<Grid item xs={12}>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center",paddingBottom:"0.5em"}}>
                      <Typography sx={{paddingLeft:"2em", fontSize:"1rem", fontWeight:"bold"}}>Pool Groups you may join</Typography>
                      <IconButton onClick={()=>{suggestedGroupsResults.refetch()}} sx={{marginInline:"0.5em"}}>
                        <RefreshIcon/>
                      </IconButton>
                    </div>
                    <Card className={styles.contentCard} sx={{display:"flex", borderRadius:'12px',border:'0.5px solid #f1f3fa', paddingBlock:"1em", overflowX:"scroll"}}>
                        <SuggestedGroups suggestedGroupsResults={suggestedGroupsResults}/>
                    </Card>
                  </Grid>)}
              </Grid>
          </Card>
        </Grid>

      </Grid>
      {isOpen == "create pool group" && (<CreatePoolGroupModal isOpen={Boolean(isOpen)} setIsOpen={setIsOpen} />)}
    </div>
  )
}
