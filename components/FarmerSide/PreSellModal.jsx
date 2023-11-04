import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function PreSellModal({ isOpen, onClose }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);
  const [file, setFile] = useState(null);

  const handleDrop = (event) => {
    setFile(event.target.files[0]);
  };

  const handleClose = () => {
    if(productName || price || stocks || description || selectedDate || harvestDate || file) {
      if(window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  }

  const allFieldsFilled = productName && price && stocks && description && selectedDate && harvestDate && file;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto", 
          paddingTop: "2rem",
          paddingRight: "2rem",
          paddingLeft: "2rem",
          paddingBottom: "0.85rem",
          backgroundColor: "#FFFEFE",
          borderRadius: "20px",
          boxShadow: 24,
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h6">Add New Product</Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ marginRight: "-0.5rem" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          label="Product Name"
          variant="outlined"
          sx={{
            marginBottom: "1rem",
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2E613B",
            },
            "&.Mui-focused & .MuiInputLabel-outlined": {
              color: "#2E613B",
            },
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              sx={{
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E613B",
                },
                "&.Mui-focused & .MuiInputLabel-outlined": {
                  color: "#2E613B",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              fullWidth
              label="Stocks"
              type="number"
              variant="outlined"
              sx={{
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E613B",
                },
                "&.Mui-focused & .MuiInputLabel-outlined": {
                  color: "#2E613B",
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          label="Description"
          multiline
          rows={4}
          rowsMax={4}
          variant="outlined"
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2E613B",
            },
            "&.Mui-focused & .MuiInputLabel-outlined": {
              color: "#2E613B",
            },
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Set Time Limit"
            sx={{ marginBottom: '1rem', 
              width: "100%",
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2E613B",
              },
              "&.Mui-focused & .MuiInputLabel-outlined": {
                color: "#2E613B",
              },
            }}
            value={selectedDate}
            onAccept={(newValue) => setSelectedDate(newValue.toISOString())}
          />

          <DatePicker
            label="Date of Harvest"
            sx={{ marginBottom: '1rem',
              width: "100%",
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2E613B",
              },
              "&.Mui-focused & .MuiInputLabel-outlined": {
                color: "#2E613B",
              },
            }}
            value={harvestDate}
            onAccept={(newValue) => setHarvestDate(newValue.toISOString())}
          />
        </LocalizationProvider>

        <Box
          component="label"
          sx={{
            marginTop: "1rem",
            width: "100%",
            height: 100,
            border: "2px dashed #2E613B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#e6f4ea",
            },
          }}
        >
          Upload Image
          <input type="file" accept="image/*" hidden onChange={handleDrop} />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            marginTop: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: "1rem",
          }}
        >
          <Button
            disabled={!allFieldsFilled}
            variant="contained"
            sx={{
              backgroundColor: "#2E613B",
              marginTop: "0.5rem",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#235b2d" },
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
