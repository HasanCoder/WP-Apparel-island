import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "./Store";
import axios from "../actions/axios";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [action, setAction] = useState("Add");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e) => {
    if (action === "Add") {
      addDepartment(e);
    } else if (action === "Update") {
      updateDepartment(e);
    } else {
      alert("Unexpected Error Occured.");
    }
  };
  const addDepartment = async (e) => {
    e.preventDefault();
    await axios
      .post("/department/new", {
        name: name,
        description: description,
      })
      .then((res) => {
        setName("");
        setDescription("");
        navigate("/dashboard/departments");
      });
  };

  const updateDepartment = async (e) => {
    e.preventDefault();
    await axios
      .post("/department/update/" + id, {
        name: name,
        description: description,
      })
      .then((res) => {
        setName("");
        setDescription("");
        navigate("/dashboard/departments");
      });
  };

  const [state, dispatch] = useContext(Context);
  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard / Departments / Create`,
    });
  }, []);

  useEffect(() => {
    if (id) {
      setAction("Update");
      axios.get("/department/find/" + id).then((response) => {
        if (response.data) {
          setName(response.data.name);
          setDescription(response.data.description);
        } else {
          alert("Unexpected Data Occured while fetching department details");
        }
      });
    }
  }, []);
  return (
    <div class="mt-10 sm:mt-0">
      <div class="sm: px-10 md:px-20 lg:px-40 xl:px-64 py-10">
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={onSubmit} method="POST">
            <div class="shadow overflow-hidden w-full sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="Brand name"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Department name
                    </label>
                    <input
                      type="text"
                      name="brand_name"
                      id="brand_name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      autoComplete="brand_name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div class="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="Customer name"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Department description
                    </label>
                    <textarea
                      type="text"
                      name="customer_name"
                      id="customer_name"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      autoComplete="customer_name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {action}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
