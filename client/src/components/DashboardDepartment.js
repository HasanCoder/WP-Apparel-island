import { useEffect, useContext, useState } from "react";
import { Context } from "./Store";
import axios from "../actions/axios";
import { Link, useNavigate } from "react-router-dom";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default (props) => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  const [state, dispatch] = useContext(Context);

  const loadDepartments = async () => {
    axios.get("/department/sync").then((response) => {
      setDepartments(response.data);
    });
  };

  const editDepartment = async (department) => {
    navigate("/dashboard/departments/edit/" + department);
  };

  const deleteDepartment = async (department) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios
        .post(
          "/department/delete/" + department,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setDepartments(
            departments.filter((dep) => {
              return dep._id !== department;
            })
          );
        })
        .catch((err) => {
          alert("Unexpected error occured while deleting department");
        });
    }
  };

  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard / Orders`,
    });
    loadDepartments();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-gray-800">
              Departments
            </h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <Link
              to="/dashboard/departments/create"
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
                Description
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 &&
              departments.map((department, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                    {index + 1}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {department.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {department.description}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDepartment(department._id);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDepartment(department._id);
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
