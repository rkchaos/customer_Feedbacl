import React, { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/nav/Navbar';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CircularProgress, Box, Container } from "@mui/material"
import { Modal, Backdrop, Fade } from "@mui/material"
import { ReactFormGenerator, ReactFormBuilder } from "react-form-builder2"
import "react-form-builder2/dist/app.css"



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function Feedback() {
    let location = useLocation()
    // console.log(location)
    let { fromid } = location.state || {}
    // console.log(fromid)
    let [formvalue, setFormvalue] = useState([])
    let navigate = useNavigate()
    const [formData, setFormData] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [currentid, setCurrentid] = useState("");
    const [currentuid, setCurrentuid] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [formfields, setFormfields] = useState([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const auth = getAuth();
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
            const res = await axios.post("https://customer-feedbacl.onrender.com/currentUser", data);
            setCurrentid(res.data.fetchuid._id);
        } catch (err) {

            toast.error("Something went wrong");
        }

    }, [currentuid]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (!fromid) return;  // Prevent API call if `fromid` is not set
        async function fetchData() {
            try {
                let res = await axios.post(`https://customer-feedbacl.onrender.com/GetFeedback/${fromid}`);
                setFormvalue(res.data.form || []);

            } catch (err) {
                console.log(err);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            }
        }
        fetchData();
    }, [fromid]);



    useEffect(() => {
        async function fetchForm() {
            if (!currentid) return
            if(!fromid) return
            setIsLoading(true)
            try {
                let id = fromid
                const res = await axios.post(
                    `https://customer-feedbacl.onrender.com/form/${id}`,
                    { currentid }
                )
                setFormData(res.data.findfrom)
                setIsOwner(res.data.isOwner)
                setFormfields(res.data.findfrom.fields || [])
            } catch (err) {
                console.log(err)
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            }   
        }
        fetchForm()
    }, [fromid, currentid])

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
        <div>
            <Navbar />
            <div>
                <div style={{ textAlign: "center", margin: "1rem 0" }}>
                    <h1>Feedback</h1>
                </div>

            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                    formvalue.map((item, index) => {
                        return (
                        <>
                        
                        {
                            formvalue.length>0?(
                                <Card sx={{ width: '400px', marginTop: "10px", gap: "30px" }} key={item._id || index}>
                                <CardContent>
                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                        Customer feedback
                                    </Typography>
                                    <Typography variant="body2">
                                        well meaning and kindly.
                                        <br />
                                        {'"a benevolent smile"'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={handleOpen} size="small">Click me</Button>
                                    <Modal
                                        aria-labelledby="transition-modal-title"
                                        aria-describedby="transition-modal-description"
                                        open={open}
                                        onClose={handleClose}
                                        closeAfterTransition
                                        slots={{ backdrop: Backdrop }}
                                        slotProps={{
                                            backdrop: {
                                                timeout: 500,
                                            },
                                        }}
                                    >
                                        <Fade in={open}>
                                            <Box sx={style}>
                                                <Typography id="transition-modal-title" variant="h6" component="h2">
                                                    <ReactFormGenerator
                                                        data={formfields}
                                                        submitButton={
                                                            <Button sx={{display:'none'}} type="submit" variant="contained" color="primary">
                                                                Submit
                                                            </Button>

                                                            
                                                        }
                                                        answer_data={item.data || []} 
                                                        read_only:true


                                                    />
                                                </Typography>

                                            </Box>
                                        </Fade>
                                    </Modal>
                                </CardActions>
                            </Card>
                            ):(
                                <>
                                  <div style={{ textAlign: "center", margin: "1rem 0" }}>
                    <h1>No feedback found</h1>
                </div>
                                </>
                            )
                        }
                        
                        
                        </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Feedback