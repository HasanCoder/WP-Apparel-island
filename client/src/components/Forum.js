import React, { useState, useEffect, useContext } from "react";
import { Context } from "./Store";
import axios from "../actions/axios";
import Modal from "./Modal";
import ForumModal from "./ForumModal";

import { useModal } from "../hooks/useModal";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default ({ order_id }) => {
  const [modalOpen, toggleModal] = useModal();
  const [isAdmin, setIsAdmin] = useState(false);
  const [state, dispatch] = useContext(Context);

  const [forums, setForums] = useState([]);

  const checkAdmin = (_) => {
    if (state.auth) {
      if (state.auth.user) {
        if (state.auth.user.isAdmin === true) {
          setIsAdmin(true);
        }
      }
    }
    setIsAdmin(false);
  };

  useEffect(() => {
    axios
      .get("/forum/sync")
      .then((res) => {
        setForums(res.data);
      })
      .catch((err) => {
        console.log("cannot get forums", err);
      });
  }, []);

  const addForum = (payload) => {
    axios
      .post("/forum/new", payload)
      .then((res) => {
        toggleModal();
      })
      .catch((err) => {
        console.log("could not create forum", err);
      });
  };

  useEffect(() => {
    checkAdmin();
  }, [state]);
  return (
    <>
      <Modal
        title="Post a thread"
        isActive={modalOpen}
        handleClose={(_) => {
          toggleModal();
        }}
      >
        <ForumModal addForum={(payload) => addForum(payload)} />
      </Modal>
      <button
        onClick={toggleModal}
        className="w-full py-2 bg-purple-500 text-white font-bold hover:bg-purple-700"
      >
        Post Thread
      </button>
      <div className="flex flex-col-reverse flex-1 overflow-y-auto">
        {forums.map((forum) => (
          <div className="flex flex-col p-4 cursor-pointer bg-gray-50 hover:shadow hover:bg-gray-100">
            <dix className="flex gap-x-2">
              <img
                alt="profile"
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                className="w-10 h-10 bg-gray-200 rounded-full"
              />
              <div className="flex flex-col flex-1">
                <h1 className="font-semibold">{forum.sender}</h1>
                <p className="text-sm text-gray-400">{forum.sent}</p>
              </div>
              <div className="flex items-center h-6 px-2 pb-1 mr-8 text-white bg-yellow-500 rounded-xl">
                {forum.status} {isAdmin && <p>testing</p>}
              </div>
              {isAdmin && (
                <>
                  <div className="flex items-center h-6 px-2 pb-1 mr-8 text-white bg-blue-500">
                    Marks as Resolved
                  </div>
                  <div className="flex items-center h-6 px-2 pb-1 mr-8 text-white bg-red-500">
                    Marks as Closed
                  </div>
                </>
              )}
            </dix>
            <div className="h-12 mt-2 overflow-hidden overflow-ellipsis">
              {forum.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
