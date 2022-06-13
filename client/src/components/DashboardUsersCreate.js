import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { Context } from "./Store";
import axios from "../actions/axios";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");


export default (props) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [action, setAction] = useState('Add');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [department, setDepartment] = useState('');
    const [departmentName, setDepartmentName] = useState('Choose a department');

    const [deps, setDeps] = useState([]);

    const getDepartmentName = (selected) => {

        let ret = 'Choose a department';
        deps.forEach(dep => {
            if (dep._id === selected) {
                ret = dep.name;
            }

        });
        return ret;
    }
    const onDepartmentSelected = (e) => { setDepartment(e); setDepartmentName(getDepartmentName(e)); }

    const onSubmit = (e) => {
        if (action === 'Add') {
            addUser(e);
        } else if (action === 'Update') {
            updateUser(e);
        } else {
            alert('Unexpected Error Occured.');
        }
    }

    const addUser = async (e) => {
        e.preventDefault();
        await axios.post('/users/new', {
            name: name,
            email: email,
            password: password,
            isAdmin: isAdmin,
            department: department
        }).then((res) => {
            navigate('/dashboard/users');
        }).catch((err) => {
            alert('Unexpected Error Occured While Adding User');
        });

    };

    const updateUser = async (e) => {
        e.preventDefault();
        await axios.post('/users/update/' + id, {
            name: name,
            password: password,
            isAdmin: isAdmin,
            department: department
        }).then((res) => {
            navigate('/dashboard/users');
        }).catch((err) => {
            alert('Unexpected Error Occured while updating user');
        });;
    }

    const [state, dispatch] = useContext(Context);
    useEffect(_ => {
        dispatch({
            type: "SET_TITLE",
            payload: `Dashboard / Departments / Create`,
        });

    }, []);

    useEffect(async () => {
        await axios.get('/department/sync').then(
            (response) => {
                console.log(response.data);
                setDeps(response.data);

            }
        ).catch(err => {
            alert('Error occured while fetching departments');
        });
    }, []);

    useEffect(() => {
        if (id) {
            setAction('Update');
            axios.get('/users/find/' + id).then(
                (response) => {
                    if (response.data) {
                        setName(response.data.name);
                        setEmail(response.data.email);
                        setIsAdmin(response.data.isAdmin);
                        setDepartment(response.data.department);
                    } else {
                        alert('Unexpected Error Occured while fetching user details');
                    }
                }
            ).catch(err => {
                alert('Unexpected Error')
            });
        }
    }, [])



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
                                            htmlFor="name"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value) }}
                                            required
                                            autoComplete="name"
                                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div class="col-span-6 sm:col-span-4">
                                        <label
                                            htmlFor="name"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            required
                                            autoComplete="email"
                                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            disabled={ action=='Add' ? false:true}
                                        />
                                    </div>

                                    <div class="col-span-6 sm:col-span-4">
                                        <label
                                            htmlFor="password"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={password}
                                            required
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            autoComplete="password"
                                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div class="col-span-6 sm:col-span-4">
                                        <label
                                            htmlFor="isAdmin"
                                            class="block text-sm font-medium text-gray-700"
                                        >
                                            User Type
                                        </label>

                                        <select onChange={(e) => { setIsAdmin(e.target.value) }}
                                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            name="isAdmin" required>
                                            <option value="false">Simple User</option>
                                            <option value="true">Administrator</option>
                                        </select>

                                    </div>

                                    <div class="col-span-6 sm:col-span-4">

                                        <Listbox
                                            as="div"
                                            className="h-10"
                                            onChange={onDepartmentSelected}
                                        >
                                            {({ open }) => (
                                                <>

                                                    <Listbox.Label className="block font-medium leading-5 text-gray-700">
                                                        Choose Department
                                                    </Listbox.Label>

                                                    <div className="relative py-2">
                                                        <span className="inline-block w-full rounded-md shadow-sm">
                                                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                                                                <span className="block truncate">
                                                                    {departmentName}
                                                                </span>
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                    <svg
                                                                        className="w-5 h-5 text-gray-400"
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </Listbox.Button>
                                                        </span>

                                                        <Transition
                                                            show={open}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
                                                        >
                                                            <Listbox.Options
                                                                static
                                                                className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
                                                            >
                                                                {deps.map((dep, index) => (
                                                                    <Listbox.Option key={index} value={dep._id}>
                                                                        {({ selected, active }) => (
                                                                            <div
                                                                                className={`${active
                                                                                    ? "text-white bg-blue-600"
                                                                                    : "text-gray-900"
                                                                                    } cursor-default select-none relative py-2 pl-8 pr-4`}
                                                                            >
                                                                                <span
                                                                                    className={`${selected
                                                                                        ? "font-semibold"
                                                                                        : "font-normal"
                                                                                        } block truncate`}
                                                                                >
                                                                                    {dep.name}
                                                                                </span>
                                                                                {selected && (
                                                                                    <span
                                                                                        className={`${active
                                                                                            ? "text-white"
                                                                                            : "text-blue-600"
                                                                                            } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                                                                    >
                                                                                        <svg
                                                                                            className="w-5 h-5"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 20 20"
                                                                                            fill="currentColor"
                                                                                        >
                                                                                            <path
                                                                                                fillRule="evenodd"
                                                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                clipRule="evenodd"
                                                                                            />
                                                                                        </svg>
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>


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
