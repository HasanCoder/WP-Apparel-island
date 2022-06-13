import React, { useContext, useEffect } from "react";
import { Context } from "./Store";
import CardLineChart from "./Cards/CardLineChart.js";
import CardBarChart from "./Cards/CardBarChart.js";
// import axios from "../actions/axios";
// import CardPageVisits from "./Cards/CardPageVisits.js";
// import CardSocialTraffic from "./Cards/CardSocialTraffic.js";
/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props) => {
  //   let salesData = {
  //     currentYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     prevYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   };

  //   let ordersData = {
  //     currentYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     prevYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   };

  //   const loadData = async () => {
  //     const cYear = new Date().getFullYear();
  //     const pYear = new Date().getFullYear() - 1;

  //     await axios.get("/order/all").then((response) => {
  //       let orders = response.data;
  //       orders.forEach((order) => {
  //         console.log(`quantity :: ${order.quantity}`);
  //         var date = new Date(order.startTime);
  //         var month = date.getMonth();
  //         var year = date.getFullYear();

  //         if (year === cYear) {
  //           salesData.currentYear[month] += order.quantity;
  //           ordersData.currentYear[month]++;
  //         } else if (year === pYear) {
  //           salesData.prevYear[month] += order.quantity;
  //           ordersData.prevYear[month]++;
  //         }
  //       });
  //     });
  //   };

  //   const [state, dispatch] = useContext(Context);
  //   useEffect((_) => {
  //     loadData();
  //     dispatch({
  //       type: "SET_TITLE",
  //       payload: `Dashboard`,
  //     });
  //   }, []);
  return (
    <></>
    //  <div className="w-full px-4 mx-auto -m-16 md:px-10">
    //    <div className="flex flex-wrap">
    //      <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
    //        <CardLineChart salesData={salesData} />
    //      </div>
    //      <div className="w-full px-4 xl:w-4/12">
    //        <CardBarChart ordersData={ordersData} />
    //      </div>
    //    </div>
    //    <div className="flex flex-wrap mt-4">
    //          <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
    //             <CardPageVisits />
    //          </div>
    //          <div className="w-full px-4 xl:w-4/12">
    //             <CardSocialTraffic />
    //          </div>
    //       </div>
    //  </div>
  );
};
