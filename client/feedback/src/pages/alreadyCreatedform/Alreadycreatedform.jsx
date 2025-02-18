import React, { memo, useCallback, useEffect, useState } from 'react';
import Navbar from '../../components/nav/Navbar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';;
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { deepOrange, green } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, Button, CircularProgress, Container } from '@mui/material'

function Alreadycreatedform() {
    const location = useLocation();
    let navigate = useNavigate();
    const { workspaceId } = location.state || {};
    const [formFetchData, setFormFetchData] = useState([]);
    const [currentid, setCurrentid] = useState("")
    const [currentuid, setCurrentuid] = useState("")
    const toastId = React.useRef(null); // Ref for toast notifications
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFormId, setSelectedFormId] = useState(null);



    let imageARR = [
        "https://plus.unsplash.com/premium_photo-1681584471820-e1fe387e9ca3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9ybXN8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9ybXN8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1554224155-a1487473ffd9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1558957433-f97b0bcd40b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1505674059423-b20eec15c920?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1619006179863-f65e2b0c8fba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1617203433883-d3577bdf3ca6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1633427370898-c40eceefb26c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1522086988648-7c274f5b3806?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGZvcm1zfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1730771540143-6e6492606934?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1493855344473-0378f32bd0d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1600543640063-4ad1ea479bf1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGZvcm1zfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1621689912979-5d475cfd3cd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fGZvcm1zfGVufDB8fDB8fHww"
    ]

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



    const fetchCurrentUser = useCallback(async () => {
        try {
            if (!currentuid) return;
            const data = { uid: currentuid };
            const res = await axios.post("http://localhost:8080/currentUser", data);
            setCurrentid(res.data.fetchuid._id);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    }, [currentuid]);


    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        async function currtetformdata() {
            try {
                if (!currentid) return; // Prevent unnecessary API calls

                let data = {
                    ownerId: currentid,
                    workspaceid: workspaceId,
                };

                let res = await axios.post('http://localhost:8080/alreadyCreatedForm', data);
                setFormFetchData(res.data.workspace)
              

            } catch (err) {
                if (err.response?.data.msg === 'Workspace not found') {
                    if (!toast.isActive(toastId.current)) {
                        toastId.current = toast.warn('No from found ', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'dark',
                        });
                    }

                }
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error('Something went wrong', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                    });
                }

                console.log(err);
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            }
        }
        currtetformdata();
    }, [currentid, workspaceId]);


    const ITEM_HEIGHT = 48;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, formId) => {
        setAnchorEl(event.currentTarget);
        setSelectedFormId(formId);

    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedFormId(null);
    };
    const handledeleteForm = useCallback(async () => {
        if (!currentid) return;
        let res = await axios.delete(`http://localhost:8080/form/delete/${selectedFormId}`, {
            params: { ownerId: currentid }
        })
        if (res.data) {
            try {
                setFormFetchData((prevData) => prevData.filter(item => item._id !== selectedFormId));
            }
            catch (err) {
                console.log(err)
            }
        }
    }, [selectedFormId]);

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
            <div style={{ textAlign: "center", margin: "1rem 0" }}>
                <h1>Created forms</h1>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "70px", flexWrap: "wrap" }}>
                {formFetchData.length > 0 ? (
                    formFetchData.map((form, index) => (
                        <Card key={index} style={{ maxWidth: 345, margin: '10px' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: index % 2 === 0 ? green[500] : deepOrange[500] }}>
                                        {form.name[0]}
                                    </Avatar>
                                }
                                action={
                                    <>
                                        <IconButton onClick={(event) => handleClick(event, form._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            PaperProps={{
                                                style: { maxHeight: ITEM_HEIGHT * 4.5, width: '20ch' },
                                            }}
                                        >
                                            <MenuItem>
                                                <Button onClick={handledeleteForm}>Delete</Button>
                                            </MenuItem>

                                        </Menu>
                                    </>
                                }

                                title={form.name}
                                subheader={form.createdAt}
                            />

                            <Link to={`/form/${form._id}`}>

                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={imageARR[index % imageARR.length]}
                                    alt={form.name}
                                />
                            </Link>

                        </Card>

                    ))
                ) : (
                    <Typography>No forms found. Please create a new form.</Typography>
                )}
            </div>

            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='dark'
            />
        </>
    );
}

export default Alreadycreatedform;
