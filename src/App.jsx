import React from "react";
import { Routes, Route } from "react-router-dom";
import Codes from "./components/Codes";
import Notes from "./components/Notes";
import Querys from "./components/Querys";
import Home from "./views/Home";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/codigos" element={<Codes />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/querys" element={<Querys />} />
    </Routes>
  );
}

export default App;
