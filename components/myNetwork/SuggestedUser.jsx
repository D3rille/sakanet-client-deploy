import {useState} from "react";
import {useQuery} from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import { Card, CircularProgress, Button } from '@mui/material';
import styles from '../../styles/Navbar.module.css';
import toast from 'react-hot-toast';
import Link from  '@mui/material/Link';
import {useRouter} from "next/router";

import { GET_SUGGESTED_USERS } from '../../graphql/operations/myNetwork';
import { formatShortAddress } from '../../util/addresssUtils';
import CircularLoading from "../circularLoading";


function SuggestedUsers({requestConnection, suggestedUsersResults}){
    const router = useRouter();

    const {data, error, loading} = suggestedUsersResults;
    
    if (loading){return (
        <CircularLoading/> 
      );}
      else if(error){
        toast.error(error);
        return(<p>Error Loading Connected Users</p>)
      }
      if(data?.getSuggestedUsers?.length==0){
        return (
          <div style={{display:"flex", width:"100%", height:"100%", padding:"auto"}}>
            <p style={{margin:"auto", color:"#c5c5c5", fontSize:"18px"}} >No Suggested Users</p>
          </div>
        
        )
      }
  
  
      return(
        <>
        {data && data?.getSuggestedUsers?.map((user) =>(
          <div key={user._id} className={styles.cardprofile}>
            <Card elevation={2} sx={{display:'flex',flexDirection:'column',alignItems:'center',height:'170px',width:'170px',border:'none'}}>
            <div className={styles.backgroundimg} style={{backgroundImage:`url("https://greenamerica.org/sites/default/files/pieces/istockag2.jpg")`}}>
              <div className={styles.circular} style={{padding:'5px',borderRadius:'50%',position:'relative'}}>
              <Avatar alt={user.username} src={user.profile_pic} size="lg" />
                    {/* <Avatar sx={{ width: '30', height: 'auto'}} alt={data.name} size="lg">
                        <Image src={data.profile} alt={data.name} width={30} height={30}/>
                    </Avatar> */}
              </div>
            </div>
              <div style={{margin:'5px', textAlign:"center"}}>
              <Link className={styles.searchLink} onClick={()=>{
                  router.push(`/Find/${user._id}`);
              }} >
                 <h2 style={{fontSize:'12px'}}>{user.username}</h2>
              </Link>
              <p style={{fontSize:'12px'}}>{formatShortAddress(user.address)}</p>
              </div>
              <div style={{display:'flex'}}>
                <button className={styles.acceptbtn} onClick={()=>{requestConnection({variables:{"connectTo":user._id}})}}>
                  Connect</button>
              </div>
            </Card>
            </div>
            
          ))
        }
       
        </>
      );
  }

  export default SuggestedUsers;