import React from "react";
import Chart from "chart.js";

export default function CardLineChart({ salesData }) {
   React.useEffect(() => {
      var config = {
         type: "line",
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
                  backgroundColor: "#4c51bf",
                  borderColor: "#4c51bf",
                  data: salesData.currentYear,
                  fill: false,
               },
               {
                  label: new Date().getFullYear() - 1,
                  fill: false,
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  data: salesData.prevData,
               },
            ],
         },
         options: {
            maintainAspectRatio: true,
            responsive: true,
            title: {
               display: false,
               text: "Sales Charts",
               fontColor: "white",
            },
            legend: {
               labels: {
                  fontColor: "white",
               },
               align: "end",
               position: "bottom",
            },
            tooltips: {
               mode: "index",
               intersect: false,
            },
            hover: {
               mode: "nearest",
               intersect: true,
            },
            scales: {
               xAxes: [
                  {
                     ticks: {
                        fontColor: "rgba(255,255,255,.7)",
                     },
                     display: true,
                     scaleLabel: {
                        display: false,
                        labelString: "Month",
                        fontColor: "white",
                     },
                     gridLines: {
                        display: false,
                        borderDash: [2],
                        borderDashOffset: [2],
                        color: "rgba(33, 37, 41, 0.3)",
                        zeroLineColor: "rgba(0, 0, 0, 0)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                     },
                  },
               ],
               yAxes: [
                  {
                     ticks: {
                        fontColor: "rgba(255,255,255,.7)",
                     },
                     display: true,
                     scaleLabel: {
                        display: false,
                        labelString: "Value",
                        fontColor: "white",
                     },
                     gridLines: {
                        borderDash: [3],
                        borderDashOffset: [3],
                        drawBorder: false,
                        color: "rgba(255, 255, 255, 0.15)",
                        zeroLineColor: "rgba(33, 37, 41, 0)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                     },
                  },
               ],
            },
         },
      };
      var ctx = document.getElementById("line-chart").getContext("2d");
      window.myLine = new Chart(ctx, config);
   }, []);
   return (
      <>
         <div className="relative flex flex-col w-full min-w-0 mb-6 break-words bg-gray-800 rounded shadow-lg">
            <div className="px-4 py-3 mb-0 bg-transparent rounded-t">
               <div className="flex flex-wrap items-center">
                  <div className="relative flex-1 flex-grow w-full max-w-full">
                     <h6 className="mb-1 text-xs font-semibold text-gray-200 uppercase">
                        Overview
                     </h6>
                     <h2 className="text-xl font-semibold text-white">
                        Sales value
                     </h2>
                  </div>
               </div>
            </div>
            <div className="flex-auto p-4">
               {/* Chart */}
               <div className="relative h-350-px">
                  <canvas id="line-chart"></canvas>
               </div>
            </div>
         </div>
      </>
   );
}
