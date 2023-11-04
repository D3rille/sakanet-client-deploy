import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

import { GET_CONTRIBUTORS } from '../../graphql/operations/productPool';
import { useQuery } from '@apollo/client';
import CircularLoading from '../circularLoading';
import {timePassed} from "../../util/dateUtils";
import TriggeredDialog from "../popups/confirmationDialog";
import {formatToCurrency} from "../../util/currencyFormatter";

const contributionDetails=(contributor, unit)=>{
    
  return(
    <>
      <Typography align="left">
        {`Placed: ${timePassed(contributor?.createdAt)}`}
      </Typography>
      <Typography align="left">
        {`Contribution Id: ${contributor?._id}`}
      </Typography>
      <Typography align="left">
        {`Contributor: ${contributor?.username}`}
      </Typography>
      <Typography align="left">
        {`Stock Added: ${contributor?.stock_added} ${unit}`}
      </Typography>
      <Typography align="left">
        {`Total Compensation: ${formatToCurrency(contributor?.totalCompensation)}`}
      </Typography>
      {contributor?.email && (<Typography align="left">
        {`email: ${contributor?.email}`}
      </Typography>)}
      {contributor?.phone && (<Typography align="left">
        {`phone: ${contributor?.phone}`}
      </Typography>)}
    </>


    );
       
}

const ContributorsListModal = ({ onClose, poolId, unit}) => {
  const nameLength = 20;

  const {data:getContributorsData, loading:getContributorsLoading, error:getContributorsError, fetchMore:getMoreContributors} = useQuery(GET_CONTRIBUTORS,{
    variables:{
      "productPoolId": poolId,
      "cursor": null,
      "limit": 10
    }
  });


 
  const truncateName = (name) => {
    if (name.length > nameLength) {
      return name.slice(0, nameLength) + '...';
    }
    return name;
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: { borderRadius: 20, padding:'1.5rem' }, 
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{fontWeight:'bold'}}>
          Contributors
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {getContributorsData?.getContributors.poolContributors.length == 0 ? (
          <Typography variant="body1">No contributors yet.</Typography>
        ) : (
          <Box maxHeight={400} overflow="auto">
            {getContributorsLoading &&(
              <div style={{display:"flex", margin:"auto"}}>
                <CircularLoading/>
              </div>
                
            )}
            {getContributorsData && (<Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contribution</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getContributorsData?.getContributors?.poolContributors.map((contributor) => (
                  <TableRow key={contributor._id}>
                    <TableCell style={{ width: '50%' }}>
                      <Box display="flex" alignItems="center">
                        <Avatar src={contributor?.profile_pic} alt={contributor?.username} />
                        <Typography variant="body2" style={{ marginLeft: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {truncateName(contributor?.username)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{`${contributor?.stock_added} ${unit}`}</TableCell>
                    <TableCell align="right">
                      {/* Contribution Detail */}
                      <TriggeredDialog
                        triggerComponent={(handleClickOpen)=>{
                          return(
                            <IconButton
                            onClick={()=>{
                              handleClickOpen()
                            }}
                            >
                              <MoreHorizIcon />
                            </IconButton>
                          );
                        }}
                        title ={"Details"}
                        message={contributionDetails(contributor, unit)}
                        btnDisplay={0}
                      />
                      {/* <IconButton>
                        <MoreHorizIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>)}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContributorsListModal;
