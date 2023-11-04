import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export function ProductsToggleButton({ productsType, onProductTypeChange }) {

  const handleProductTypeChange = (event, newType) => {
    onProductTypeChange(newType);

  };

  return (
    <ToggleButtonGroup
      sx={{
        mt: 3, 
        mr: 4, 
        mb: -1,
        justifyContent: 'flex-end',
        '& .Mui-selected': { 
          bgcolor: '#C2E7CB',
        }
      }}
      color="primary"
      value={productsType}
      exclusive
      onChange={handleProductTypeChange}
      aria-label="Product Type"
    >
      <ToggleButton 
        value="all" 
        sx={{ 
          width:"10vw",
          color: '#2F613A',
          '&.Mui-selected': {
            color: '#2F613A',
          }
        }}
      >
        All
      </ToggleButton>
      <ToggleButton 
        value="available" 
        sx={{ 
          width:"10vw",
          color: '#2F613A',
          '&.Mui-selected': {
            color: '#2F613A',
          }
        }}
      >
        Available
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ProductsToggleButton;
