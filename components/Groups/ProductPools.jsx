import { useState } from 'react';
import * as React from 'react';
import { Paper, Button, Grid, Typography, IconButton, Menu, MenuItem, 
  ToggleButtonGroup, ToggleButton } from '@mui/material';
import ProductPoolCard, { productDataList } from './ProductPoolCard';
import AddProductPoolModal from './AddProductPoolModal'; 
import AddCircleIcon from '../../public/icons/add-circle.svg'; 
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import the Kebab icon
import Image from 'next/image';
import {useQuery} from "@apollo/client";
import {Waypoint} from "react-waypoint";

import {GET_PRODUCT_POOLS, GET_CONTRIBUTORS } from "../../graphql/operations/productPool";
import CircularLoading from '../circularLoading';

const ProductPools = ({poolGroupId, isAdmin}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [poolStatusFilter, setPoolStatusFilter] = useState("open"); // open || closed

  const {data:getProductPoolsData, loading:getProductPoolsLoading, error:getProductPoolsError, fetchMore:getMoreProdPools} = useQuery(GET_PRODUCT_POOLS, {
    variables:{
      "poolGroupId": poolGroupId,
      "limit": 5,
      "cursor": null,
      "status": poolStatusFilter
    }
  });

  const getProductPoolsLength=()=>{
    return getProductPoolsData?.getProductPools?.productPools.length;

  }


  const fetchMorePools = () =>{
    if(getProductPoolsData?.getProductPools?.hasNextPage){
      getMoreProdPools({
        variables:{
          poolGroupId,
          limit:5,
          cursor: getProductPoolsData?.getProductPools?.endCursor,
          status:poolStatusFilter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            getProductPools: {
              // ...prev.getProductPools,
              endCursor:fetchMoreResult.getProductPools.endCursor,
              hasNextPage: fetchMoreResult.getProductPools.hasNextPage,
              productPools:[...prev.getProductPools.productPools, ...fetchMoreResult.getProductPools.productPools],
            }
          });
          // setMembers([...members, ...fetchMoreResult.getPoolGroupMembers.members]);
          // return fetchMoreResult;
        },

      })
    }
  }

  // const {data:getContributorsData, loading:getContributorsLoading, error:getContributorsError, fetchMore:getMoreContributors} = useQuery(GET_CONTRIBUTORS,{
  //   variables:{
  //     "productPoolId": poolId,
  //     "cursor": null,
  //     "limit": 10
  //   }
  // });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, borderRadius: 3, backgroundColor:'#FEFFFF' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: '1rem' }}>
        <Grid item>
          <Typography variant="body1" align="left" sx={{ fontWeight: 'bold', fontSize: '1.1em', color: '#010100' }}>
            Product Pools
          </Typography>
        </Grid>
        <Grid item>
          {isAdmin && (<Button
            variant="contained"
            sx={{
              fontSize: '0.8em',
              backgroundColor: '#2E603A',
              '&:hover': {
                backgroundColor: '#286652'
              },
              borderRadius: '18px'
            }}
            startIcon={<Image src={AddCircleIcon} alt="Add" width={24} height={24} />}
            onClick={handleOpenModal}
          >
            Add Pool
          </Button>)}


          <ToggleButtonGroup
            color="primary"
            value={poolStatusFilter}
            exclusive
            onChange={(event, newValue)=>{setPoolStatusFilter(newValue)}}
            sx={{marginInline:"2em"}}
            aria-label="Pool Status Filter"
          >
            <ToggleButton value="open" sx={{padding:"0.4rem 1rem"}}>Open</ToggleButton>
            <ToggleButton value="closed"sx={{padding:"0.4rem 1rem"}}>Closed</ToggleButton>
          </ToggleButtonGroup>


          {/* <IconButton
            aria-label="more"
            aria-controls="kebab-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton> */}
          {/* <Menu 
            id="kebab-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            
            <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
          </Menu> */}
        </Grid>
      </Grid>
      <div style={{ maxHeight: '37.5rem', overflowY: 'auto' }}>
        {getProductPoolsLoading && (
          <div style={{display:"flex", margin:"auto"}}>
            <CircularLoading/>
          </div>
        )}
        {getProductPoolsData && getProductPoolsData?.getProductPools.productPools.map((product, index) => (
          <React.Fragment key={index}>
            <ProductPoolCard productData={product} isAdmin={isAdmin} poolStatusFilter={poolStatusFilter}/>
            {index == getProductPoolsLength() - 1 && (<Waypoint onEnter={()=>{fetchMorePools()}}/>)}
          </React.Fragment>
        ))}
      </div>
      {isModalOpen && (<AddProductPoolModal open={isModalOpen} onClose={handleCloseModal} poolGroupId={poolGroupId}/>)}
    </Paper>
  );
};

export default ProductPools;
