import React from "react";

// components

import CardStats from "./Cards/CardStats.js";

export default function HeaderStats({ summary }) {
  const getPercent = (no) => {
    const total =
      summary.open + summary.production + summary.sampling + summary.closed;
    return total > 0 ? ((no / total) * 100).toFixed(2) : 0.0;
  };

  return (
    <div>
      {/* Header */}
      <div className="relative pt-12 pb-32 to-purple-400 from-indigo-500 bg-gradient-to-r md:pt-32">
        <div className="w-full px-4 mx-auto md:px-10">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                  statSubtitle="Open"
                  statTitle={summary.open}
                  statPercent={getPercent(summary.open)}
                  statPercentColor="text-green-500"
                  statDescripiron=""
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                  statSubtitle="In Sampling"
                  statTitle={summary.sampling}
                  statPercent={getPercent(summary.sampling)}
                  statPercentColor="text-green-500"
                  statDescripiron=""
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                  statSubtitle="In Production"
                  statTitle={summary.production}
                  statPercent={getPercent(summary.production)}
                  statPercentColor="text-orange-500"
                  statDescripiron=""
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                  statSubtitle="Closed"
                  statTitle={summary.closed}
                  statPercent={getPercent(summary.closed)}
                  statPercentColor="text-green-500"
                  statDescripiron=""
                  statIconName="fas fa-percent"
                  statIconColor="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
