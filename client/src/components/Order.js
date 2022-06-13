import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import axios from "../actions/axios";

import { Context } from "./Store";
import TimelineItem from "./TimelineItem";
import NavItem from "./NavItem";
import Chat from "./Chat";
import Forum from "./Forum";

import chatIcon from "../assets/icons/discussion.svg";
import forumIcon from "../assets/icons/phases.svg";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

export default (props) => {
  const [state, dispatch] = useContext(Context);

  const { id } = useParams();
  const [phase, setPhase] = useState(0);
  const [order, setOrder] = useState([]);
  const [tab, setTab] = useState(0);

  const updateOrder = (_) => {
    axios
      .post(`/order/update/${id}`, { phases: order.phases })
      .then((response) => {
        console.log("updated", response.data);
      });
  };
  const phaseClicked = (i) => {
    let phases = [...order.phases];
    let setNested = "-1";

    if (phases[i].state == "pending") {
      phases[i].state = "active";
      setNested = "pending";
    } else if (phases[i].state === "active") {
      phases[i].state = "completed";
      setNested = "completed";
    } else if (phases[i].state === "completed") {
      phases[i].state = "under_review";
      setNested = "under_review";
    } else if (phases[i].state === "under_review") {
      phases[i].state = "completed";
      setNested = "completed";
    }

    if (setNested != "-1" && phases[i].nested) {
      for (var x = 0; x < phases[i].nested.length; x++) {
        phases[i].nested[x].state = setNested;
      }
    }

    if (phases[i + 1] && phases[i].state === "completed") {
      if (phases[i + 1].state === "pending") {
        phases[i + 1].state = "active";
      }
    }
    setOrder({ ...order, phases: phases });
    updateOrder();
  };

  const nestedClicked = (i, j) => {
    let phases = [...order.phases];

    if (
      phases[i].nested[j].state === "active" ||
      phases[i].nested[j].state == "pending"
    ) {
      phases[i].nested[j].state = "completed";
    } else if (phases[i].nested[j].state === "completed") {
      phases[i].nested[j].state = "under_review";
    } else if (phases[i].nested[j].state === "under_review") {
      phases[i].nested[j].state = "completed";
    }

    if (phases[i].nested[j + 1] && phases[i].nested[j].state === "completed") {
      if (phases[i].nested[j + 1].state === "pending") {
        phases[i].nested[j + 1].state = "active";
      }
    }
    let phaseComplete = true;
    for (var x = 0; x < phases[i].nested.length; x++) {
      if (phases[i].nested[x].state != "completed") {
        phaseComplete = false;
        break;
      }
    }

    if (phaseComplete) {
      phases[i].state = "completed";
    } else {
      phases[i].state = "pending";
    }

    setOrder({ ...order, phases: phases });

    updateOrder();
  };

  //initial phase set
  useEffect(() => {
    if (order.phases) {
      var active_phase = order.phases.findIndex(
        (phase) => phase.state === "active"
      );
      if (active_phase >= 0) setPhase(active_phase);
    }
  }, []);
  //load order
  useEffect((_) => {
    axios.get(`/order/find/${id}`).then((response) => {
      console.log("order", response.data);
      setOrder(response.data);
    });
    dispatch({
      type: "SET_TITLE",
      payload: `Orders / ${props.name}`,
    });
  }, []);

  const diffForHumans = (time) => {
    if (time <= 0) {
      return "Late";
    }
    let diff = "";
    let seconds = Math.floor(time % 60);
    time = (time - seconds) / 60;
    let minutes = Math.floor(time % 60);
    time = (time - minutes) / 60;
    let hours = Math.floor(time % 24);
    time = (time - hours) / 24;
    let days = Math.floor(time % 7);
    time = (time - days) / 7;
    let weeks = Math.floor(time);

    if (weeks > 0) diff += weeks + "W";
    if (days > 0) diff += " " + days + "D";
    if (hours > 0) diff += " " + hours + "H";
    if (minutes > 0) diff += " " + minutes + "M";
    if (seconds > 0) diff += " " + seconds + "S";

    return diff;
  };

  return (
    <>
      <div className="flex flex-1 mt-6 overflow-y-auto bg-gray-700">
        <div className="-mr-3 bg-gray-700">
          <div className="flex flex-col h-full overflow-y-scroll">
            {/* <Link to='/dashboard'  className="mr-auto ml-auto mb-2 bg-gray-500 text-white p-2 rounded-md">Go Back</Link> */}
            {order.phases &&
              order.phases.map((phase, index) => (
                <>
                  {index === 0 ? (
                    <div key={index} className="h-full mx-auto px-10">
                      <CountdownCircleTimer
                        isPlaying
                        duration={
                          (order.orderTimeline * 1000 -
                            (new Date().getTime() - order.startTime)) /
                          1000
                        }
                        colors={[["#ff7675"]]}
                      >
                        {({ remainingTime }) => diffForHumans(remainingTime)}
                      </CountdownCircleTimer>
                    </div>
                  ) : (
                    ""
                  )}
                  <TimelineItem
                    title={phase.title}
                    last={index === order.phases.length - 1}
                    state={phase.state}
                    setPhase={(_) => {
                      dispatch({
                        type: "SET_TITLE",
                        payload: `Orders / ${props.name} / ${phase.title}`,
                      });
                      setPhase(index);
                    }}
                    completePhase={(_) => {
                      phaseClicked(index);
                    }}
                    active={phase === order.phases.length - index - 1}
                    nested={phase.nested}
                    completeNestedPhase={(i) => {
                      nestedClicked(index, i);
                    }}
                  />
                </>
              ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 pb-4 mr-6 bg-white gap-y-2 rounded-t-xl">
          <nav className="flex items-center bg-gray-100 rounded-t-xl">
            <NavItem
              label="Chat"
              active={!tab}
              src={chatIcon}
              onClick={(_) => setTab(0)}
              path=""
            />
            <NavItem
              label="Forum"
              src={forumIcon}
              active={tab}
              onClick={(_) => setTab(1)}
              path="forum"
            />
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                order.phases &&
                order.phases.length > 0 && <Chat order_id={id} phase={phase} />
              }
            />
            <Route path="forum" element={<Forum order_id={id} />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
