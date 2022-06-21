import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GetActiveEvent from "./components/GetActiveEvent";
import LoginForm from "./components/LoginForm";
import NodeReadWrite from './components/NodeReadWrite';
import Participants from './components/Participants';

export default function App() {
  return (
    <div className="wrapper">
      <h1>Event Registration Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GetActiveEvent />} />
          <Route path="/dashboard" element={
            <>
              <LoginForm />
              <NodeReadWrite />
            </>
          } />
          <Route path="/participants/:eid" element={
            <>
              <Participants />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

/*function App() {
  return (
    <>
      <LoginForm />
      <NodeReadWrite />
    </>
  );
}

export default App;*/
