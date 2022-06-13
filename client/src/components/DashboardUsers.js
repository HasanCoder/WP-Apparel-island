import { useEffect, useContext, useState } from "react";
import { Context } from "./Store";
import axios from "../actions/axios";
import { Link, useNavigate } from "react-router-dom";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default (props) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [state, dispatch] = useContext(Context);

  const loadUsers = async () => {
    axios.get("/users/sync").then((response) => {
      setUsers(response.data);
    });
  };

  const editUser = async (user) => {
    navigate("/dashboard/users/edit/" + user);
  };

  const deleteUser = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .post(
          "/users/delete/" + user,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setUsers(
            users.filter((item) => {
              return item._id !== user;
            })
          );
        })
        .catch((err) => {
          alert("Unexpected error occured while deleting user");
        });
    }
  };

  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard / Users`,
    });
    loadUsers();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-gray-800">Users</h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <Link
              to="/dashboard/users/create"
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Create New
            </Link>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                #
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Name
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Email
              </th>

              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Type
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                    {index + 1}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {user.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {user.email}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {user.isAdmin ? "Administrator" : "User"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        editUser(user._id);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
