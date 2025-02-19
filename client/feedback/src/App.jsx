import React from 'react'
import { Routes, Route } from "react-router-dom";
import Signin from './pages/signin/Signin';
import First from './pages/firstpage/First';
import 'bootstrap/dist/css/bootstrap.css';
import Signup from './pages/signup/Signup';
import Userfrontpage from './pages/wordSpace/Userfrontpage';
import Createpage from './pages/createFrom/Createpage';
import Alreadycreatedform from './pages/alreadyCreatedform/Alreadycreatedform';
import Formbyid from './pages/formbyid/Formbyid';
import Feedback from './pages/feedback/Feedback';
import Instruction from './pages/instruction/Instruction';

function App() {
  return (
    <>
      <Routes>
        <Route path='/sign_in' element={<Signin/>}/>
        <Route path='/' element={<First/>}/>
        <Route path='/sign_up' element={<Signup/>}/>
        <Route path='/workspace' element={<Userfrontpage/>}/>
       <Route path='/template/:id' element={<Createpage/>}/>
       <Route path='/alreadyCreated' element={<Alreadycreatedform/>} />
       <Route path='/form/:id' element={<Formbyid/>}/>
       <Route path='/feedback' element={<Feedback/>}/>
       <Route path='/instruction' element={<Instruction/>}/>
      </Routes>
    </>
  )
}

export default App