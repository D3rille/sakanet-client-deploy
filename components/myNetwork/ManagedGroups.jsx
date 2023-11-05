import { useEffect } from "react";
import {Avatar, Typography} from "@mui/material";
import CircularLoading from "../circularLoading";
import {useQuery, useLazyQuery} from "@apollo/client";
import toast from "react-hot-toast";
import Link from "next/link";

import styles from '../../styles/Navbar.module.css';
import {GET_MANAGED_GROUPS} from "../../graphql/operations/poolGroup";

const ManagedGroups = () =>{
   
    // const {data, loading, error}= useQuery(GET_MANAGED_GROUPS);
    // const {data, loading, error}= managedGroupsResults;
    const [getManagedGroups, {data, loading, error}] = useLazyQuery(GET_MANAGED_GROUPS, {
        onError:(error)=>{
            toast.error(error.message);
        }
    });

    if (loading){
        return(
            <div style={{display:"flex", margin:"auto"}}>
                <CircularLoading/>
            </div>
        )
    }

    if (error){
        <div>
            <Typography>Something went wrong. Check your connection.</Typography>
        </div>
    }

    if(!data || data?.getManagedGroups.length == 0){
        return(
            <Typography sx={{color:"#e5e5e5", padding:"1em"}}>No Groups</Typography>
        )
    }
    
    if(data){
        return(
            <>
                {data?.getManagedGroups.map((group)=>(
                    <div key={group._id} className={styles.grouplist} >
                        {/* `/Groups?groupId=${group._id}` */}
                            <Link href={`/Groups/${group._id}`}>
                                <Avatar sx={{width:'30'}} alt="Travis Howard" src={group?.profile_pic} />
                            </Link>
                            <Link href={`/Groups/${group._id}`}>
                                <p style={{marginLeft:'10px',padding:0}}>{group?.groupName}</p> 
                            </Link>
                    </div>)
                )}
            </>
        )
    }




}

  export default ManagedGroups;