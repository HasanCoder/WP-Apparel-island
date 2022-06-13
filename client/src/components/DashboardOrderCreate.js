import { useEffect, useContext, useState } from "react";
import { Context } from "./Store";
import axios from "../actions/axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

const DashboardOrderCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [action, setAction] = useState("Create Order");

  const [customerName, setCustomerName] = useState("");
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [_state, set_State] = useState("");

  const [rows, setRows] = useState(1);
  const [orderCode, setOrderCode] = useState([]);
  const [orderStatus, setOrderStatus] = useState([1]);
  const [product, setProduct] = useState([""]);
  const [fabric, setFabric] = useState([""]);
  const [color, setColor] = useState([""]);
  const [quantity, setQuantity] = useState([1]);

  const [orderTimeline, setOrderTimeline] = useState(604800);

  const onSubmit = (e) => {
    if (action === "Create Order") {
      addOrder(e);
    } else if (action === "Update Order") {
      updateOrder(e);
    } else {
      alert("Unexpected Error Occured.");
    }
  };

  const addOrder = (e) => {
    e.preventDefault();
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
          //  console.log(`post data :: ${JSON.stringify(orderStatus)}`);
          axios
            .post("/order/new", {
              orderCode: orderCode,
              orderStatus: orderStatus,
              customerName: localStorage.getItem("userName"),
              brandName: brand,
              country: country,
              state: _state,
              product: product,
              fabric: fabric,
              color: color,
              quantity: quantity,
              orderTimeline: orderTimeline,
              user: res.data._id,
            })
            .then((res) => {
              navigate("/dashboard/orders");
            });
        })
        .catch((err) => {
          alert("Unexpected error occured");
        });
    } else {
      navigate("/logout");
    }
  };

  const updateOrder = async (e) => {
    e.preventDefault();
    await axios
      .post("/order/update/" + id, {
        orderCode: orderCode,
        orderStatus: orderStatus,
        customerName: localStorage.getItem("userName"),
        brandName: brand,
        country: country,
        state: _state,
        product: product,
        fabric: fabric,
        color: color,
        quantity: quantity,
        orderTimeline: orderTimeline,
      })
      .then((res) => {
        navigate("/dashboard/orders");
      });
  };

  const removeRow = (i) => {
    if (rows > 1) {
      setRows(rows - 1);

      let newCode = [...orderCode];
      newCode.pop();
      setOrderCode([...newCode]);
      let newStatus = [...orderStatus];
      newStatus.pop();
      setOrderStatus([...newStatus]);
      let newProd = [...product];
      newProd.pop();
      setProduct([...newProd]);
      let newFab = [...fabric];
      newFab.pop();
      setFabric([...newFab]);
      let newQuan = [...quantity];
      newQuan.pop();
      setQuantity([...newQuan]);
      let newCol = [...color];
      newCol.pop();
      setColor([...newCol]);
    }
  };

  const addRow = () => {
    if (rows < 20) {
      let newCode = [...orderCode];
      newCode[rows] = "";
      setOrderCode([...newCode]);
      let newStatus = [...orderStatus];
      newStatus[rows] = 1;
      setOrderStatus([...orderStatus]);
      let newProd = [...product];
      newProd[rows] = "";
      setProduct([...newProd]);
      let newFab = [...fabric];
      newFab[rows] = "";
      setFabric([...newFab]);
      let newQuan = [...quantity];
      newQuan[rows] = "";
      setQuantity([...newQuan]);
      let newCol = [...color];
      newCol[rows] = "";
      setColor([...newCol]);
      setRows(rows + 1);
    } else {
      alert("You have reached maximum number of rows");
    }
  };

  const [state, dispatch] = useContext(Context);
  useEffect((_) => {
    dispatch({
      type: "SET_TITLE",
      payload: `Dashboard / Orders / Create`,
    });
  }, []);

  useEffect(() => {
    if (id) {
      setAction("Update Order");
      axios.get("/order/find/" + id).then((response) => {
        if (response.data) {
          setOrderCode(response.data.orderCode);
          setOrderStatus(response.data.orderStatus);
          setCustomerName(response.data.customerName);
          setBrand(response.data.brandName);
          setCountry(response.data.country);
          set_State(response.data.state);
          setProduct(response.data.product);
          setFabric(response.data.fabric);
          setQuantity(response.data.quantity);
          setColor(response.data.color);
          setOrderTimeline(response.data.orderTimeline);
          setRows(response.data.orderCode.length);
        } else {
          alert("Unexpected Data Occured while fetching department details");
        }
      });
    }
  }, []);

  return (
    <div className="mt-10 sm:mt-0">
      <div className="sm: px-2 md:px-4 lg:px-10 xl:px-20 py-10">
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={onSubmit} method="POST">
            <div className="shadow overflow-hidden w-full sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Brand Name */}
                  <div className="col-span-6">
                    <label
                      htmlFor="Brand name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Brand name
                    </label>
                    <input
                      type="text"
                      name="brand_name"
                      id="brand_name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                      autoComplete="brand_name"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Country */}
                  <div className="col-span-6">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      required
                      autoComplete="customer_name"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* State */}
                  <div className="col-span-6">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={_state}
                      onChange={(e) => {
                        set_State(e.target.value);
                      }}
                      required
                      autoComplete="state"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {[...Array(rows)].map((_, i) => (
                    <>
                      {/* Order Code */}
                      <div className="col-span-2">
                        <label
                          htmlFor="Order Code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Order Code
                        </label>
                        <input
                          type="text"
                          name="order_code"
                          id="order_code"
                          value={orderCode[i]}
                          onChange={(e) => {
                            let newCode = [...orderCode];
                            newCode[i] = e.target.value;
                            setOrderCode([...newCode]);
                          }}
                          required
                          autoComplete="order_code"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Product */}
                      <div className="col-span-2">
                        <label
                          htmlFor="product"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Product
                        </label>
                        <input
                          type="text"
                          name="product"
                          id="product"
                          value={product[i]}
                          onChange={(e) => {
                            let newProd = [...product];
                            newProd[i] = e.target.value;
                            setProduct([...newProd]);
                          }}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {/* Fabric */}
                      <div className="col-span-2">
                        <label
                          htmlFor="fabric"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Fabric
                        </label>
                        <input
                          type="text"
                          name="fabric"
                          id="fabric"
                          value={fabric[i]}
                          onChange={(e) => {
                            let newFab = [...fabric];
                            newFab[i] = e.target.value;
                            setFabric([...newFab]);
                          }}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {/* Color */}
                      <div className="col-span-2">
                        <label
                          htmlFor="color"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Color
                        </label>
                        <input
                          type="text"
                          name="color"
                          id="color"
                          value={color[i]}
                          onChange={(e) => {
                            let newCol = [...color];
                            newCol[i] = e.target.value;
                            setColor([...newCol]);
                          }}
                          required
                          autoComplete="color"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {/* Quantity */}
                      <div className="col-span-2">
                        <label
                          htmlFor="Quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          name="quantity"
                          id="quantity"
                          value={quantity[i]}
                          onChange={(e) => {
                            let newQuan = [...quantity];
                            newQuan[i] = parseInt(e.target.value);
                            setQuantity([...newQuan]);
                          }}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {/* Order Status */}
                      <div className="col-span-2">
                        <label
                          htmlFor="Order Status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Order Status
                        </label>
                        <select
                          name="orderStatus"
                          required
                          value={orderStatus[i]}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          onChange={(e) => {
                            let newStatus = [...orderStatus];
                            newStatus[i] = parseInt(e.target.value);
                            //  console.log(
                            //    `orderState :: ${JSON.stringify(newStatus, null)}`
                            //  );
                            setOrderStatus([...newStatus]);
                          }}
                        >
                          <option value={1}>Open</option>
                          <option value={2}>In-Sampling</option>
                          <option value={3}>In-Production</option>
                          <option value={4}>In-Finishing</option>
                          <option value={5}>Closed</option>
                          <option value={6}>Shipped</option>
                        </select>
                      </div>
                    </>
                  ))}

                  <div className="col-span-12">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      onClick={() => addRow()}
                    >
                      Add +
                    </button>
                    {rows > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(rows - 1)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 mt-2 ml-5"
                      >
                        X
                      </button>
                    )}
                  </div>

                  {/* Order Timeline */}
                  <div className="col-span-12">
                    <label
                      htmlFor="Order Time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Order Timeline
                    </label>
                    <select
                      name="order_timeline"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => {
                        setOrderTimeline(e.target.value);
                      }}
                    >
                      <option
                        value="604800"
                        selected={orderTimeline === 604800}
                      >
                        1 week
                      </option>
                      <option
                        value="1209600"
                        selected={orderTimeline === 1209600}
                      >
                        2 weeks
                      </option>
                      <option
                        value="1814400"
                        selected={orderTimeline === 1814400}
                      >
                        3 weeks
                      </option>
                      <option
                        value="2419200"
                        selected={orderTimeline === 2419200}
                      >
                        4 weeks
                      </option>
                      <option
                        value="3024000"
                        selected={orderTimeline === 3024000}
                      >
                        5 weeks
                      </option>
                      <option
                        value="3628800"
                        selected={orderTimeline === 3628800}
                      >
                        6 weeks
                      </option>
                      <option
                        value="4233600"
                        selected={orderTimeline === 4233600}
                      >
                        7 weeks
                      </option>
                      <option
                        value="4838400"
                        selected={orderTimeline === 4838400}
                      >
                        8 weeks
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
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

export default DashboardOrderCreate;
