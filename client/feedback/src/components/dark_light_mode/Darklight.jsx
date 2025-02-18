import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';


const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh', // Ensures it takes the full viewport height
  width: '100%', // Ensures it takes the full width
  position: 'relative', // To allow the ::before pseudo-element to work
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(0, 0.00%, 2.70%, 0.94), hsla(0, 11.10%, 1.80%, 0.95))',
    }),
  },
}));

function Dark() {

  return (
    <>
      <AppTheme>

        <SignInContainer direction="column" justifyContent="space-between">
          <ColorModeSelect sx={{ top: '7rem', right: '1rem' ,width:"100px",position:'absolute'}} />
        </SignInContainer>
      </AppTheme>

    </>
  )
}

export default Dark