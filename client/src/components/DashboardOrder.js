import { useEffect, useContext, useState } from "react";
import { Context } from "./Store";
import axios from "../actions/axios";
import { Link, useNavigate } from "react-router-dom";
import { Empty } from "./Empty";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default ({ updateSummary }) => {
  const orderStatuses = {
    1: "Open",
    2: "In Sampling",
    3: "In Production",
    4: "In Finishing",
    5: "Closed",
    6: "Shipped",
  };
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [pagesArr, setPagesArr] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const navigate = useNavigate();
  const [orders, setOrders] = useState(-1);
  const [filterBy, setFilterBy] = useState("-");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const [state, dispatch] = useContext(Context);

  const editOrder = async (order) => {
    navigate("/dashboard/orders/edit/" + order);
  };

  const deleteOrder = async (order) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log("deleting id ", order);
      axios
        .post(
          "/order/delete/" + order,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setOrders(
            orders.filter((ord) => {
              return ord._id !== order;
            })
          );
        })
        .catch((err) => {
          alert("Unexpected error occured while deleting order");
        });
    }
  };

  const filterOrders = async (e) => {
    e.preventDefault();

    if ((filterBy != "-" && search != "") || date != "") {
      setOrders(-1);
      axios
        .post(
          "/order/sync/" + page,
          {
            filterBy: filterBy,
            search: search,
            date: date,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("orders", response.data.docs);
          setOrders(response.data.docs);
          setPages(Math.ceil(response.data.total / itemsPerPage));
          setTotalOrders(response.data.total);
        })
        .catch((err) => {
          alert("Unexpected error occured while fetching order");
        });
    }
  };

  useEffect(() => {
    updateSummary();
  }, [orders]);

  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard / Orders`,
    });
  }, []);

  const FetchOrders = () => {
    setOrders(-1);
    axios
      .post(
        "/order/sync/" + page,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        //   console.log("orders", response.data.docs);
        //   console.log(`res :: ${JSON.stringify(response.data, null, 4)}`);
        setOrders(response.data.docs);
        setPages(Math.ceil(response.data.total / itemsPerPage));
        setTotalOrders(response.data.total);
      })
      .catch((err) => {
        alert("Unexpected error occured while fetching order");
      });
  };
  useEffect(() => {
    FetchOrders();
  }, [page]);

  useEffect(() => {
    if (pages > 0) {
      let newArray = [];
      if (pages <= 10) {
        for (let i = 1; i <= pages; i++) {
          newArray.push(i);
        }
      } else {
        let midStart = page - 2;
        let midEnd = page + 2;

        if (midStart <= 2) {
          midStart = 3;
        }
        if (midEnd >= pages - 1) {
          midEnd = pages - 2;
        }
        for (let i = 1; i <= 2; i++) {
          newArray.push(i);
        }
        if (midStart != 3) newArray.push(-1);
        for (let i = midStart; i <= midEnd; i++) {
          newArray.push(i);
        }
        if (midEnd !== pages - 2) {
          newArray.push(-1);
        }
        for (let i = pages - 1; i <= pages; i++) {
          newArray.push(i);
        }
      }
      setPagesArr(newArray);
    }
  }, [pages, page]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-gray-800">Orders</h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <Link
              to="/dashboard/orders/create"
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Create New
            </Link>
          </div>
        </div>
      </div>

      <form
        className="flex gap-x-2 px-4  items-center py-3 border-0 rounded-t"
        onSubmit={(e) => filterOrders(e)}
      >
        <b>Filter By: </b>
        <select
          onChange={(e) => setFilterBy(e.target.value)}
          value={filterBy}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="-">-</option>
          <option value="orderCode">Order Code</option>
          <option value="orderStatus">Order Status</option>
          <option value="customerName">Customer Name</option>
          <option value="brandName">Brand Name</option>
          <option value="country">Country</option>
          <option value="state">State</option>
          <option value="product">Product</option>
          <option value="fabric">Fabric</option>
          <option value="color">Color</option>
          <option value="quantity">Quantity</option>
          <option value="phases">Phases</option>
        </select>

        <b>Search : </b>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
        />

        <input
          type="date"
          name="date"
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Filter
        </button>
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          onClick={() => {
            FetchOrders();
            setSearch("");
            setFilterBy("-");
          }}
        >
          Clear Filter
        </button>
      </form>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Brand
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Customer Name
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Country
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                State
              </th>
              <th
                colSpan="6"
                className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
              >
                Products
              </th>

              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders === -1 ? (
              <tr>
                <th
                  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"
                  colSpan="9"
                >
                  Loading....
                </th>
              </tr>
            ) : (
              orders.length > 0 &&
              orders.map((order, index) => (
                <Empty key={order._id}>
                  <tr>
                    <td
                      rowSpan={order.orderCode.length + 1}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {order.brandName}
                    </td>
                    <td
                      rowSpan={order.orderCode.length + 1}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {order.customerName}
                    </td>
                    <td
                      rowSpan={order.orderCode.length + 1}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {order.country}
                    </td>
                    <td
                      rowSpan={order.orderCode.length + 1}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      {order.state}
                    </td>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Code
                    </th>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Status
                    </th>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Product
                    </th>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Fabric
                    </th>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Color
                    </th>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                      Qty
                    </th>
                    <td
                      rowSpan={order.orderCode.length + 1}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
                    >
                      <button
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          editOrder(order._id);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOrder(order._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {[...Array(order.orderCode.length)].map((_, i) => (
                    <tr
                      className={
                        new Date().getTime() >=
                          order.orderTimeline * 1000 + order.startTime &&
                        "bg-red-400"
                      }
                    >
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                        {order.orderCode[i]}
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {orderStatuses[order.orderStatus[i]]}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {order.product[i]}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {order.fabric[i]}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {order.color[i]}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {order.quantity[i]}
                      </td>
                    </tr>
                  ))}
                </Empty>
              ))
            )}
          </tbody>
        </table>

        {pages > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm flex gap-x-1 text-gray-700">
                  Showing
                  <span className="font-medium">{(page - 1) * 10 + 1}</span>
                  to
                  <span className="font-medium">
                    {(page - 1) * 10 + 10 > totalOrders
                      ? totalOrders
                      : (page - 1) * 10 + 10}
                  </span>
                  of
                  <span className="font-medium">{totalOrders}</span>
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {page - 1 > 0 && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page - 1);
                      }}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  )}

                  {pagesArr.map((pageItem) =>
                    pageItem === -1 ? (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    ) : (
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageItem);
                        }}
                        className={`${
                          page == pageItem
                            ? "bg-indigo-500 text-white hover:bg-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } hidden md:inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium`}
                      >
                        {pageItem}
                      </a>
                    )
                  )}

                  {page + 1 <= pages && (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
