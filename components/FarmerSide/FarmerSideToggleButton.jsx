import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export function ProductsToggleButton({ productsCategory, onProductCategoryChange }) {

  const handleProductCategoryChange = (event, newType) => {
    onProductCategoryChange(newType);
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
      value={productsCategory}
      exclusive
      onChange={handleProductCategoryChange}
      aria-label="Product Type"
    >
      <ToggleButton 
        value="Sell" 
        sx={{ 
          width:"10vw",
          color: '#2F613A',
          '&.Mui-selected': {
            color: '#2F613A',
          }
        }}
      >
       Sell 
      </ToggleButton>
      <ToggleButton 
        value="Pre-Sell" 
        sx={{ 
          width:"10vw",
          color: '#2F613A',
          '&.Mui-selected': {
            color: '#2F613A',
          }
        }}
      >
        Pre-sell
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ProductsToggleButton;
