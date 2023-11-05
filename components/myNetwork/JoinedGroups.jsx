import {Avatar, Typography} from "@mui/material";
import CircularLoading from "../circularLoading";
import {useQuery} from "@apollo/client";
import toast from "react-hot-toast";
import Link from "next/link";

import styles from '../../styles/Navbar.module.css';
import {GET_JOINED_GROUPS} from "../../graphql/operations/poolGroup";

const JoinedGroups = ({joinedGroupsResults}) =>{

    // const {data, loading, error} = useQuery(GET_JOINED_GROUPS);
    const {data, loading, error} = joinedGroupsResults;


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

    if(!data || data?.getJoinedGroups.length==0){
        return(
                <Typography sx={{color:"#e5e5e5", padding:"1em"}}>No Groups</Typography>
        )
    }

    if(data){
        return(
            <>
                {data?.getJoinedGroups.map((group)=>(
                    <div key={group._id} className={styles.grouplist}>
                        {/* `/Groups?groupId=${group._id}` */}
                        <Link href={`/Groups/${group._id}`}>
                            <Avatar sx={{width:'30'}} alt={group.groupName} src={group?.profile_pic} />
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

  export default JoinedGroups;