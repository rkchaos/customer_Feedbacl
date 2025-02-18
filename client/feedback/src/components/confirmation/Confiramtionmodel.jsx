import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="confirmation-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Typography
          id="confirmation-modal-description"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          {message}
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="secondary" variant="contained">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
