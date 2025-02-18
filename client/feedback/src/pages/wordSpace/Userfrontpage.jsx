import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/nav/Navbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfiramtionModel from "../../components/confirmation/Confiramtionmodel";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Container } from '@mui/material'
import FeedbackWidget from "../../components/Feedbackwidget/FeedbackWidget";
const ITEM_HEIGHT = 48;

function Userfrontpage() {
  // State variables
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [errorcompanyName, setErrorcompanyName] = useState(false);
  const [errorcompanyNamemessage, setErrorcompanyNamemessage] = useState("");
  const [errorworkspaceName, setErrorworkspaceName] = useState(false);
  const [errorworkspaceNamemessage, setErrorworkspaceNamemessage] = useState("");
  const [errordescription, setErrordescription] = useState(false);
  const [errorimg, setErrorimg] = useState(false);
  const [errorimgmessage, setErrorimgmessage] = useState("");
  const [errordescriptionmessage, setErrordescriptionmessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    companyName: "",
    workspaceName: "",
    description: "",
    img: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    companyName: "",
    workspaceName: "",
    description: "",
    img: "",
  });
  const [currentid, setCurrentid] = useState("");
  const [currentuid, setCurrentuid] = useState("");
  const [particularWorkspace, setParticularWorkspace] = useState([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  // console.log(particularWorkspace)
  // Hooks
  const navigate = useNavigate();
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentuid(user.uid);
      } else {
        navigate("/sign_in");
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  // Input change handlers
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleUpdateInputChange = (event) => {
    setUpdateFormData({ ...updateFormData, [event.target.name]: event.target.value });
  };

  // Basic validation
  const isvalid = (data) => {
    let isValid = true;
    if (data.companyName === "") {
      setErrorcompanyName(true);
      setErrorcompanyNamemessage("Please fill company name");
      isValid = false;
    } else {
      setErrorcompanyName(false);
      setErrorcompanyNamemessage("");
    }
    if (data.workspaceName === "") {
      setErrorworkspaceName(true);
      setErrorworkspaceNamemessage("Please fill workspace name");
      isValid = false;
    } else {
      setErrorworkspaceName(false);
      setErrorworkspaceNamemessage("");
    }
    if (data.description === "") {
      setErrordescription(true);
      setErrordescriptionmessage("Please fill Description");
      isValid = false;
    } else {
      setErrordescription(false);
      setErrordescriptionmessage("");
    }
    if (data.img === "") {
      setErrorimg(true);
      setErrorimgmessage("Please fill image");
      isValid = false;
    } else {
      setErrorimg(false);
      setErrorimgmessage("");
    }
    return isValid;
  };

  // Retrieve auth headers from local storage

  const fromid = "67b356cf994ac6b7d98be238";
  // Handle form submission for creating a workspace
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isvalid(formData)) {
      return;
    }
    try {
      const allfromdata = {
        workspacename: formData.workspaceName,
        description: formData.description,
        img: formData.img,
        company: formData.companyName,
        ownerId: currentid,
      };
      const response = await axios.post("http://localhost:8080/createWorkspace", allfromdata);
      if (response) {
        // Consider updating state instead of reloading the page
        location.reload();
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err);
    }
    
  };

  // Handle form submission for updating a workspace
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!isvalid(updateFormData)) {
      return;
    }
    setIsUpdateConfirmationOpen(true);
  };

  // Confirm workspace update
  const handleConfirmUpdate = async () => {
    try {
      const updatedData = {
        workspacename: updateFormData.workspaceName,
        description: updateFormData.description,
        img: updateFormData.img,
        company: updateFormData.companyName,
      };
      const toastId = toast.loading("Updating workspace...");
      const response = await axios.put(`http://localhost:8080/updateWorkspace/${currentWorkspaceId}`, updatedData);

      if (response.data.msg === "Updated successfully") {
        toast.dismiss(toastId);
        toast.success("Workspace updated successfully");
        setParticularWorkspace((prevWorkspaces) =>
          prevWorkspaces.map((workspace) =>
            workspace._id === currentWorkspaceId ? { ...workspace, ...updatedData } : workspace
          )
        );
        setOpenUpdateModal(false);
        setIsUpdateConfirmationOpen(false);
        setIsLoading(false)
      } else {
        toast.error("Failed to update workspace");
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast.error("An error occurred while updating the workspace");
    }
  
  };

  // Confirm workspace deletion
  const handleConfirmAction = async () => {
    if (currentWorkspaceId) {
      // console.log(currentWorkspaceId)
      try {
        const toastId = toast.loading("Deleting workspace...");
        const response = await axios.delete(`http://localhost:8080/deleteWorkspace/${currentWorkspaceId}`);

        if (response.data.success) {
          toast.dismiss(toastId);
          toast.success("Workspace deleted successfully");
          setParticularWorkspace((prevWorkspaces) =>
            prevWorkspaces.filter((workspace) => workspace._id !== currentWorkspaceId)
          );
          setIsLoading(false)
        } else {
          toast.error("Failed to delete workspace");
        }
      } catch (error) {
        console.error("Error deleting workspace:", error);
        toast.error("An error occurred while deleting the workspace");
      }
    
    }
    setIsModalOpen(false);
  };

  // Modal and confirmation handlers
  const handleOpenModal = () => setOpenModal(true);

  const handleOpenUpdateModal = (workspace) => {
    setUpdateFormData({
      companyName: workspace.company,
      workspaceName: workspace.workspacename,
      description: workspace.description,
      img: workspace.img || "",
    });
    setCurrentWorkspaceId(workspace._id);
    setOpenUpdateModal(true);
  };

  const handleconfirmation = (workspaceId) => {
    console.log("Deleting workspace with ID:", workspaceId);
    setCurrentWorkspaceId(workspaceId);
    setIsModalOpen(true);
  };

  const handleconfirmclose = () => setIsModalOpen(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);
  const handleCloseUpdateConfirmation = () => setIsUpdateConfirmationOpen(false);

  // Menu handlers
  const openMenu = Boolean(anchorEl);
  const handleClick = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentWorkspaceId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentWorkspaceId(null);
  };

  // Navigation handler
  const handlenavigate = useCallback(
    async (id) => {
      setIsNavigating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/template/${id}`);
      } catch (error) {
        console.error("Navigation error:", error);
        toast.error("Failed to navigate. Please try again.");
      } finally {
        setIsNavigating(false);
      }
    },
    [navigate]
  );

  // Fetch the current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      if (!currentuid) return;
      const data = { uid: currentuid };
      const res = await axios.post("http://localhost:8080/currentUser", data);
      setCurrentid(res.data.fetchuid._id);
      if(res.data){
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
    
  }, [currentuid]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch the workspaces for the current user
  useEffect(() => {
    async function fetchParticularWorkspace() {
      try {
        if (!currentid) return;
        const datas = { ownerId: currentid };
        const res = await axios.post("http://localhost:8080/particularWorkspace", datas);
        setParticularWorkspace(res.data.particularUser);

        if(res.data){
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err);
      }
      
    }
    fetchParticularWorkspace();
  }, [currentid]);

  // Sample images array
  const imgar = [
    "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya3NwYWNlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1630233313373-a03df7d139c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvcmtzcGFjZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1585435465945-bef5a93f8849?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvcmtzcGFjZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcmtzcGFjZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682310144714-cb77b1e6d64a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmV2aWV3fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmV2aWV3fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmV2aWV3fGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1682310539039-1a65c8fc0b4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHJldmlld3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJldmlld3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHJldmlld3xlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682310566465-61013a549353?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHJldmlld3xlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682309531231-e4c76c28c6ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHJldmlld3xlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682309735318-934795084028?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmVlZGJhY2t8ZW58MHx8MHx8fDA%3D",
  ];
  if (isLoading) {
    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50vh",
                    }}
                >
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading form...
                    </Typography>
                </Box>
            </Container>
        </>
    )
}


  return (
    <>
      <Navbar />
      <FeedbackWidget  fromid={fromid}/>
      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <h1>Workspace</h1>
      </div>

      {/* Floating Action Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab
          type="button"
          color="secondary"
          aria-label="add"
          onClick={handleOpenModal}
          sx={{
            "&:focus": { outline: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Workspace Cards */}
      <div style={{ display: "flex", flexDirection: "row", gap: "70px", flexWrap: "wrap" }}>
        {particularWorkspace.map((item, index) => (
          <Card sx={{ maxWidth: 280, marginLeft: "6px" }} key={index}>
            <CardActionArea
              onClick={() => handlenavigate(item._id)}
              sx={{ "&:focus": { outline: "none" } }}
              disabled={isNavigating}
            >
              <CardMedia
                component="img"
                height="140"
                image={item.img}
                alt="workspace"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.workspacename}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            {isNavigating && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgb(255, 255, 255)",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <CardActions>
              <div>
                <IconButton
                  aria-label="more"
                  id={`long-button-${item._id}`}
                  aria-controls={openMenu ? `long-menu-${item._id}` : undefined}
                  aria-expanded={openMenu ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) => handleClick(event, item._id)}
                  sx={{ "&:focus": { outline: "none" } }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id={`long-menu-${item._id}`}
                  MenuListProps={{
                    "aria-labelledby": `long-button-${item._id}`,
                  }}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && currentWorkspaceId === item._id}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: { maxHeight: ITEM_HEIGHT * 4.5, width: "20ch" },
                    },
                  }}
                >
                  <MenuItem>
                    <Button onClick={() => handleconfirmation(item._id)}>
                      Delete Workspace
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={() => handleOpenUpdateModal(item)}>
                      Update Workspace
                    </Button>
                  </MenuItem>
                </Menu>
              </div>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfiramtionModel
        open={isModalOpen}
        onClose={handleconfirmclose}
        onConfirm={handleConfirmAction}
        title="Are you sure?"
        message="This action cannot be undone. Please confirm."
      />

      {/* Create Workspace Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Workspace
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Company Name*"
              name="companyName"
              error={errorcompanyName}
              helperText={errorcompanyNamemessage}
              value={formData.companyName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Workspace Name*"
              name="workspaceName"
              error={errorworkspaceName}
              helperText={errorworkspaceNamemessage}
              value={formData.workspaceName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description*"
              name="description"
              error={errordescription}
              helperText={errordescriptionmessage}
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            {/* <TextField
              fullWidth
              margin="normal"
              label="Image URL"
              name="img"
              value={formData.img}
              onChange={handleInputChange}
            /> */}
            <InputLabel id="demo-simple-select-standard-label">Image URL</InputLabel>
            <FormControl fullWidth margin="normal" error={errorimg}>
              <InputLabel id="demo-simple-select-standard-label">Image URL</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={formData.img}
                name="img"
                onChange={handleInputChange}
                label="Image URL"
              > 
                {imgar.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    Image {index + 1}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errorimgmessage}</FormHelperText>
            </FormControl>


            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Update Workspace Modal */}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
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
          }}
        >
          <Typography id="update-modal-title" variant="h6" component="h2">
            Update Workspace
          </Typography>
          <form onSubmit={handleUpdateSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Company Name*"
              name="companyName"
              error={errorcompanyName}
              helperText={errorcompanyNamemessage}
              value={updateFormData.companyName}
              onChange={handleUpdateInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Workspace Name*"
              name="workspaceName"
              error={errorworkspaceName}
              helperText={errorworkspaceNamemessage}
              value={updateFormData.workspaceName}
              onChange={handleUpdateInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description*"
              name="description"
              error={errordescription}
              helperText={errordescriptionmessage}
              value={updateFormData.description}
              onChange={handleUpdateInputChange}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Image URL"
              name="img"
              value={updateFormData.img}
              onChange={handleUpdateInputChange}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Button variant="outlined" onClick={handleCloseUpdateModal}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Update Confirmation Modal */}
      <ConfiramtionModel
        open={isUpdateConfirmationOpen}
        onClose={handleCloseUpdateConfirmation}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to update this workspace?"
      />

      <ToastContainer theme="dark" />
    </>
  );
}

export default Userfrontpage;
