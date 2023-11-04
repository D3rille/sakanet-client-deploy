import {useState, useEffect, useContext} from "react";
import { Paper, Avatar, Grid, Typography, ButtonBase, Button, Badge } from '@mui/material';
import {useQuery, useMutation} from "@apollo/client";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import ManageMembersDialog from "./ManageMembersDialog";
import {GET_POOL_GROUP_APPLICATIONS, POOL_GROUP_APPLICATIONS_SUB, GET_POOL_GROUP_MEMBERS} from "../../graphql/operations/poolGroup";
import {formatWideAddress} from "../../util/addresssUtils";
import CircularLoading from "../circularLoading";

import { AuthContext } from "../../context/auth";

const MembersList = ({getPoolGroupInfoData, poolGroupId}) => {
  const router = useRouter();
  const {user} = useContext(AuthContext);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [initialMembersDisplay, setInitialMembersDisplay] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const limit = 9; // limit of paginated result

  const {admins, creator} = getPoolGroupInfoData?.getPoolGroupInfo;

  const isAdmin = admins.includes(user.id);
  // const isMember = membersList.includes(user.id);
  const isCreator = creator == user.id;

  const {data:poolMembersData, loading:poolMembersLoading, error:poolMembersError, fetchMore:fetchMoreMembers} = useQuery(GET_POOL_GROUP_MEMBERS,{
      variables:{
          poolGroupId,
          cursor:null,
          limit
      }
  });

  useEffect(()=>{
    if(poolMembersData && initialMembersDisplay.length==0){
      setMembers(poolMembersData?.getPoolGroupMembers.members);
      setInitialMembersDisplay(poolMembersData?.getPoolGroupMembers.members);
    }
  }, [poolMembersData]);


  const fetchMoreData = () => {
      if (poolMembersData.getPoolGroupMembers.hasNextPage) {
          fetchMoreMembers({
          variables: {
            poolGroupId,
            cursor: poolMembersData.getPoolGroupMembers.endCursor,
            limit,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              getPoolGroupMembers: {
                ...prev.getPoolGroupMembers,
                endCursor:fetchMoreResult.getPoolGroupMembers.endCursor,
                members:[...prev.getPoolGroupMembers.members, ...fetchMoreResult.getPoolGroupMembers.members],
                hasNextPage: fetchMoreResult.getPoolGroupMembers.hasNextPage
              }
            });
            // setMembers([...members, ...fetchMoreResult.getPoolGroupMembers.members]);
            // return fetchMoreResult;
          },
        });
      }
    };
    
  
  const {
    data:membershipAppData, 
    loading:membershipAppLoading, 
    error:membershipAppError, 
    subscribeToMore:subscribeToMoreApplications
} = useQuery(GET_POOL_GROUP_APPLICATIONS,{
    variables:{
      poolGroupId,
    },
    onError:(error)=>{
      toast.error(error.message);
      console.log(error)
    }
});

useEffect(()=>{
  if(isAdmin){
      subscribeToMoreApplications({
        document:POOL_GROUP_APPLICATIONS_SUB,
        variables:{poolGroupId, isAdmin},
        updateQuery:(prev, {subscriptionData})=>{
          if(!subscriptionData.data) return prev;
          const newApplication = subscriptionData.data.newPoolGroupApplication;
          return Object.assign({}, prev, {
              getPoolGroupApplications: [...prev.getPoolGroupApplications, newApplication.profile]
          });
        }
      });
  }
}, []);

if(membershipAppData){
  var newMemberShipApp = [...new Set(membershipAppData?.getPoolGroupApplications)]

}

useEffect(()=>{
  setApplicationsCount(()=>{
    var count=0;
    if(newMemberShipApp){
      count=newMemberShipApp.length;
    }
    return count;
  })
}, [newMemberShipApp]);

  return (
   <>
    <Paper elevation={3} sx={{ padding: 3, paddingBottom: isAdmin ? 3:5, borderRadius: 3, backgroundColor: '#FAF9F6',  }}>
      <Typography variant="body" sx={{ fontSize:'0.89em', fontWeight:'bold', textAlign:'left' }}>Members</Typography>
      <Grid container spacing={2} justifyContent="center" sx={{mt:1, textAlign: 'center'}}>

        {initialMembersDisplay.length == 0 && poolMembersLoading && (
          <div style={{display:"flex", margin:"auto"}}>
            <CircularLoading/>
          </div>
        )}

        {initialMembersDisplay && initialMembersDisplay?.map((member, index) => (
          <Grid item xs={4} key={member._id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonBase onClick={() =>{
              if(member._id != user.id){
                router.push(`/Find/${member._id}`);
              } else{
                router.push('/myProfile');
              }
            }}>
              <Avatar src={member.profile_pic}/>
            </ButtonBase>
          </Grid>
        ))}

      </Grid>
      
      {isAdmin && (
        <Button 
            fullWidth 
            variant="contained" 
            sx={{mt:"2em", backgroundColor: "#2F603B"}}
            onClick={()=>{
              setIsModalOpen(true);
            }}
          >
            <Badge badgeContent={applicationsCount} color="primary">
              <Typography sx={{paddingInline:"1rem"}}>Manage</Typography>
            </Badge>
          </Button>
      )}

      {!isAdmin && (
        <Button 
        fullWidth 
        variant="contained" 
        sx={{mt:"2em", backgroundColor: "#2F603B"}}
        onClick={()=>{
          setIsModalOpen(true);
        }}
      >
        <Typography sx={{paddingInline:"1rem"}}>View All</Typography>
      </Button>
      )}
    </Paper>
    {membershipAppData && poolMembersData && members.length>0 &&(<ManageMembersDialog
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      admins={admins}
      creator={creator}
      poolGroupId={poolGroupId}
      membershipAppData={membershipAppData}
      membershipAppLoading ={membershipAppLoading}
      membershipAppError ={membershipAppError}
      fetchMoreData={()=>fetchMoreData()}
      members={poolMembersData.getPoolGroupMembers.members}
    />)}
   </>
  );
};

export default MembersList;
