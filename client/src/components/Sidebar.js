/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NotificationDropdown from "./Dropdowns/NotificationDropdown.js";
import UserDropdown from "./Dropdowns/UserDropdown.js";
import axios from "../actions/axios";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default function Sidebar({ logout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");

    if (user) {
      axios
        .post(
          "/auth/user",
          { userId: user },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          navigate("/logout");
        });
    }
  }, []);

  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="relative z-10 flex flex-wrap items-center justify-between px-6 py-4 mt-20 bg-white shadow-xl md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden md:w-64">
        <div className="flex flex-wrap items-center justify-between w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap">
          {/* Toggler */}
          <button
            className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* User */}
          <ul className="flex flex-wrap items-center list-none md:hidden">
            <li className="relative inline-block">
              <NotificationDropdown />
            </li>
            <li className="relative inline-block">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Heading */}
            <h6 className="block pt-1 pb-4 text-xs font-bold text-gray-600 no-underline uppercase md:min-w-full">
              Admin Pages
            </h6>
            {/* Navigation */}

            <ul className="flex flex-col list-none md:flex-col md:min-w-full">
              <li className="items-center">
                <Link
                  className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                  to=""
                >
                  Dashboard
                </Link>
              </li>

              {user && user.isAdmin && (
                <>
                  <li className="items-center">
                    <Link
                      className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                      to="/dashboard/users/create"
                    >
                      Create User
                    </Link>
                  </li>
                  <li className="items-center">
                    <Link
                      className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                      to="/dashboard/users"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              <li className="items-center">
                <Link
                  className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                  to="orders/create"
                >
                  Create Order
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                  to="orders"
                >
                  Orders
                </Link>
              </li>

              {user && user.isAdmin && (
                <>
                  <li className="items-center">
                    <Link
                      className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                      to="departments/create"
                    >
                      Create Department
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link
                      className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600"
                      to="departments"
                    >
                      View Departments
                    </Link>
                  </li>
                </>
              )}

              <li className="items-center">
                <a
                  className="block py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
