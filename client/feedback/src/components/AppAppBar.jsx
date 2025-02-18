import * as React from "react"
import { styled, alpha } from "@mui/material/styles"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import MenuItem from "@mui/material/MenuItem"
import Drawer from "@mui/material/Drawer"
import MenuIcon from "@mui/icons-material/Menu"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}))

export default function AppAppBar() {
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const handleSignout = async () => {
    try {
      await signOut(auth)
      // localStorage.removeItem("token")
      toast.success("Signed out successfully")
      navigate("/")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Error signing out")
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: "calc(var(--template-frame-height, 0px) + 28px)",
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
             
            </Box>
            {isLoading ? (
              <Box>Loading...</Box>
            ) : currentUser ? (
              <>
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Button color="primary" variant="text" size="small" onClick={handleSignout}>
                    Sign out
                  </Button>
                  <ColorModeIconDropdown />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Link to="/sign_in">
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>
                <Link to="/sign_up">
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
                <ColorModeIconDropdown />
              </Box>
            )}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <ColorModeIconDropdown size="medium" />
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    top: "var(--template-frame-height, 0px)",
                  },
                }}
              >
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 3 }} />
                  {isLoading ? (
                    <Box>Loading...</Box>
                  ) : currentUser ? (
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth onClick={handleSignout}>
                        Sign out
                      </Button>
                    </MenuItem>
                  ) : (
                    <>
                      <MenuItem>
                        <Link to="/sign_up">
                          <Button color="primary" variant="contained" fullWidth>
                            Sign up
                          </Button>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/sign_in">
                          <Button color="primary" variant="outlined" fullWidth>
                            Sign in
                          </Button>
                        </Link>
                      </MenuItem>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
      <ToastContainer theme="dark" />
    </>
  )
}

