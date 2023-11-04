import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Rating, TextField } from "@mui/material";

const RateAndReviewModal = ({ isOpen, onClose, handleWriteReview}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [writtenReview, setWrittenReview] = useState("");

  const handleOverallRatingChange = (event, newValue) => {
    setOverallRating(newValue);
  };

  const handleWrittenReviewChange = (event) => {
    setWrittenReview(event.target.value);
  };

  const handleResetValues = () =>{
    setOverallRating(0);
    setWrittenReview("");
  }

  return (
    <Modal
      open={isOpen}
      onClose={()=>{handleResetValues();onClose();}}
      aria-labelledby="rate-and-review-modal"
      aria-describedby="rate-and-review-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#FDFDFF",
          borderRadius: "10px",
          padding: "20px",
          height: "400px",
          width:"500px",
        }}
      >
        <Typography variant="h6" id="rate-and-review-modal">
          Create Review
        </Typography>
        <Typography
          id="rate-and-review-modal-description"
          sx={{ marginBottom: "16px" }}
        >
          Write your review and rate this user.
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          Overall Rating
        </Typography>
        <Rating
          name="overall-rating"
          value={overallRating}
          onChange={handleOverallRatingChange}
        />

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", marginTop: "16px", marginBottom: "8px" }}
        >
          Add a written review
        </Typography>

        <TextField
          id="written-review"
          placeholder="What did you like or dislike?"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={writtenReview}
          onChange={handleWrittenReviewChange}
          sx={{
            marginBottom: "16px",
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#2E603A",
              },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2E603A", 
            },
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={()=>{handleResetValues();onClose();}} style={{ color: "#2E613B" }}>
            Cancel
          </Button>

          <Button
            onClick = {()=>{
              handleWriteReview(overallRating, writtenReview).then(()=>{
                handleResetValues();
                onClose();
              })
              
            }}
            variant="contained"
            color="primary"
            style={{ backgroundColor: "#2E613B" }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RateAndReviewModal;
