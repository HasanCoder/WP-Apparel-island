import React from "react";
import Chart from "chart.js";

export default function CardBarChart({ ordersData }) {
   React.useEffect(() => {
      let config = {
         type: "bar",
         data: {
            labels: [
               "Jan",
               "Feb",
               "Mar",
               "Apr",
               "May",
               "Jun",
               "Jul",
               "Aug",
               "Sep",
               "Oct",
               "Nov",
               "Dec",
            ],
            datasets: [
               {
                  label: new Date().getFullYear(),
                  backgroundColor: "#ed64a6",
                  borderColor: "#ed64a6",
                  data: ordersData.currentYear,
                  fill: false,
                  barThickness: 8,
               },
               {
                  label: new Date().getFullYear() - 1,
                  fill: false,
                  backgroundColor: "#4c51bf",
                  borderColor: "#4c51bf",
                  data: ordersData.prevYear,
                  barThickness: 8,
               },
            ],
         },
         options: {
            maintainAspectRatio: true,
            responsive: true,
            title: {
               display: false,
               text: "Orders Chart",
            },
            tooltips: {
               mode: "index",
               intersect: false,
            },
            hover: {
               mode: "nearest",
               intersect: true,
            },
            legend: {
               labels: {
                  fontColor: "rgba(0,0,0,.4)",
               },
               align: "end",
               position: "bottom",
            },
            scales: {
               xAxes: [
                  {
                     display: false,
                     scaleLabel: {
                        display: true,
                        labelString: "Month",
                     },
                     gridLines: {
                        borderDash: [2],
                        borderDashOffset: [2],
                        color: "rgba(33, 37, 41, 0.3)",
                        zeroLineColor: "rgba(33, 37, 41, 0.3)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                     },
                  },
               ],
               yAxes: [
                  {
                     display: true,
                     scaleLabel: {
                        display: false,
                        labelString: "Value",
                     },
                     gridLines: {
                        borderDash: [2],
                        drawBorder: false,
                        borderDashOffset: [2],
                        color: "rgba(33, 37, 41, 0.2)",
                        zeroLineColor: "rgba(33, 37, 41, 0.15)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                     },
                  },
               ],
            },
         },
      };
      let ctx = document.getElementById("bar-chart").getContext("2d");
      window.myBar = new Chart(ctx, config);
   }, []);
   return (
      <>
         <div className="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg">
            <div className="px-4 py-3 mb-0 bg-transparent rounded-t">
               <div className="flex flex-wrap items-center">
                  <div className="relative flex-1 flex-grow w-full max-w-full">
                     <h6 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
                        Performance
                     </h6>
                     <h2 className="text-xl font-semibold text-gray-800">
                        Orders
                     </h2>
                  </div>
               </div>
            </div>
            <div className="flex-auto p-4">
               {/* Chart */}
               <div className="relative h-64">
                  <canvas id="bar-chart"></canvas>
               </div>
            </div>
         </div>
      </>
   );
}
