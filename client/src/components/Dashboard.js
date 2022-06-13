import React, { useState, useContext, useEffect } from "react";
import axios from "../actions/axios";
import { Context } from "./Store";
import ContextProvider from "./Store";
import { LOGOUT_SUCCESS } from "../actions/types";
import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import HeaderStats from "./HeaderStats";
import DashboardMain from "./DashboardMain";
import DashboardOrder from "./DashboardOrder";
import DashboardOrderCreate from "./DashboardOrderCreate";
import DashboardDepartmentCreate from "./DashboardDepartmentCreate";
import DashboardDepartment from "./DashboardDepartment";
import DashboardUsers from "./DashboardUsers";
import DashboardUsersCreate from "./DashboardUsersCreate";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default () => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(Context);
  const [summary, setSummary] = useState({
    open: 0,
    sampling: 0,
    production: 0,
    closed: 0,
  });

  //on authenticate state change
  useEffect(() => {
    if (
      state.auth.isLoading === false &&
      state.auth.isAuthenticated === false
    ) {
      navigate("/logout");
    }
  }, [state]);

  // //logout
  const logout = () => {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  };

  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard`,
    });
  }, []);

  const updateSummary = () => {
    axios.get("/order/summary/").then((response) => {
      if (response.data) {
        console.log(`summary= ${JSON.stringify(response.data, null, 4)}`);
        setSummary(response.data);
      } else {
        alert("Unexpected Data Occured while fetching summary details");
      }
    });
  };

  useEffect(() => {
    updateSummary();
  }, []);

  return (
    <div className="relative h-full overflow-y-auto bg-gray-200 md:ml-64">
      <ContextProvider>
        <Sidebar logout={logout} />
        {state.title != "Dashboard / Orders" && (
          <HeaderStats summary={summary} />
        )}
        <Routes>
          <Route path="/" element={<DashboardMain />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="users/create" element={<DashboardUsersCreate />} />
          <Route path="users/edit/:id" element={<DashboardUsersCreate />} />
          <Route path="departments" element={<DashboardDepartment />} />
          <Route
            path="departments/create"
            element={<DashboardDepartmentCreate />}
          />
          <Route
            path="departments/edit/:id"
            element={<DashboardDepartmentCreate />}
          />
          <Route path="orders/create" element={<DashboardOrderCreate />} />
          <Route path="orders/edit/:id" element={<DashboardOrderCreate />} />
          <Route
            path="orders"
            element={<DashboardOrder updateSummary={updateSummary} />}
          />
        </Routes>
      </ContextProvider>
    </div>
  );
};
