import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Context } from "./Store";

import Order from "./Order";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default (_) => {
  const [state] = useContext(Context);
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-y-hidden bg-gray-700">
        <div className="p-6 text-2xl font-semibold text-white bg-gray-800 border-b-2 border-gray-900">
          {state.title}
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};
