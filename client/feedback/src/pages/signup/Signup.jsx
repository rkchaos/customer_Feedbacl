import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import { styled } from "@mui/material/styles"
import AppTheme from "../../shared-theme/AppTheme"
import ColorModeSelect from "../../shared-theme/ColorModeSelect"
import MuiCard from "@mui/material/Card"
import { useNavigate } from "react-router-dom"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { auth } from "../../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}))

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}))

function Signup(props) {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("")
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("")
  const [nameError, setNameError] = React.useState(false)
  const [nameErrorMessage, setNameErrorMessage] = React.useState("")
  const navigate = useNavigate()
  const [uuid, setUid] = React.useState('')
  const [name, setname] = useState('')
  const [emails, setemail] = useState('')

  const validateInputs = () => {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const name = document.getElementById("name")

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage("")
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage("Password must be at least 6 characters long.")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true)
      setNameErrorMessage("Name is required.")
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage("")
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isValid = validateInputs()
    if (!isValid) {
      return
    }

    const data = new FormData(event.currentTarget)
    const email = data.get("email")
    const password = data.get("password")
    const displayName = data.get("name")

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user's profile with the display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      })
      // console.log(userCredential.user.uid)
      setUid(userCredential.user.uid)
      setname(userCredential.user.displayName)
      setemail(userCredential.user.email)
      // Get the ID token

      const token = await userCredential.user.getIdToken()
      localStorage.setItem("token", token)

      toast.success("Sign up successful! Redirecting...")
      setTimeout(() => {
        navigate("/sign_in")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)

      if (error.code === "auth/email-already-in-use") {
        toast.error("The email address is already in use. Please use a different email.")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.")
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("Email/password accounts are not enabled. Please contact support.")
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.")
      } else {
        toast.error("An unexpected error occurred. Please try again later.")
      }
    }
  }
  useEffect(() => {
    const storedataTodatabase = async () => {
      try {
        let data = {
          email: emails,
          name: name,
          userId: uuid
        }
        if(!data.email && !data.name && !data.userId){
          return
        }
        let res = await axios.post("http://localhost:8080/storeUser", data)
        console.log(res)
      }
      catch (err) {
        console.log(err)
      }
    }
    storedataTodatabase()
  }, [uuid, name, emails])
  return (
    <>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
              Sign up
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Password must be at least 6 characters long and meet Firebase security requirements
              </Alert>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Accept terms and conditions"
              />
              <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                Sign up
              </Button>
            </Box>
            <Divider>
              <Typography sx={{ color: "text.secondary" }}>or</Typography>
            </Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link href="/sign_in" variant="body2" sx={{ alignSelf: "center" }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      </AppTheme>
      <ToastContainer theme="dark" />
    </>
  )
}

export default Signup

