import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import image from "../assets/icons/image.svg";
import send from "../assets/icons/send.svg";
import Pusher from "pusher-js";
import axios from "../actions/axios";
import hdate from "human-date";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
axios.defaults.headers.common["uid"] = localStorage.getItem("user");

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default ({ order_id, phase }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ name: "null" });
  const [input, setInput] = useState("");

  useEffect(() => {
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
          setUser(res.data);
        })
        .catch((err) => {
          navigate("/logout");
        });
    } else {
      navigate("/logout");
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    let allowSend = false;
    if (input.trim() != "") {
      allowSend = true;
    }
    let formData = new FormData();

    let array = document.getElementById("file").files;

    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        console.log("appending", array[i]);
        allowSend = true;
        formData.append("files", array[i]);
      }
    }

    var d = new Date();

    formData.append("sender", user.name);
    formData.append("time", d.getTime());
    formData.append("content", input);
    formData.append("order", order_id);
    formData.append("phase", phase);
    if (allowSend) {
      await axios.post("/chat/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    setInput("");
    document.getElementById("file").value = "";
    document.getElementById("fileMessage").innerText = "";
  };

  useEffect(() => {
    axios.get("/chat/sync/" + order_id).then((msgs) => {
      let arr = msgs.data.reduce((r, a) => {
        r[a.phase] = r[a.phase] || [];
        r[a.phase].push(a);
        return r;
      }, Object.create(null));
      setMessages(arr);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("529cf8119f342b5e04b2", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      if (messages[phase]) {
        setMessages({ ...messages, [phase]: [data, ...messages[phase]] });
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, phase]);

  useEffect(() => {
    console.log("messages", messages[phase], phase);
  }, [messages]);

  useEffect(() => {
    if (!messages[phase]) {
      messages[phase] = [];
    }
  }, [phase]);

  return (
    <React.Fragment>
      <div className="flex flex-col-reverse flex-1 overflow-y-auto">
        {messages[phase] &&
          messages[phase].length > 0 &&
          messages[phase].map((message) => (
            <div className="flex px-4 py-3 gap-x-4 hover:bg-gray-100 hover:shadow">
              <div className="flex justify-center">
                <img
                  src={
                    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                  }
                  alt="pic"
                  className="w-8 h-8 bg-gray-200 rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-x-3">
                  <h1 className="text-lg font-semibold">{message.sender}</h1>
                  <span className="-mb-1 text-sm text-gray-400">
                    {hdate.relativeTime(message.time)}
                  </span>
                </div>
                {message.content}
                <div className="flex flex-wrap gap-2 py-2">
                  {message.images.map((file) =>
                    file.indexOf(".pdf") !== -1 ? (
                      <a target="_blank" href={`http://localhost:9000/${file}`}>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                          className="w-24 h-24 rounded-sm"
                          alt={file}
                        />
                      </a>
                    ) : (
                      <img
                        src={`http://localhost:9000/${file}`}
                        alt="img"
                        className="w-24 h-24 rounded-sm"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="relative mx-4">
        <form method="POST" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            className="w-full py-4 pl-16 pr-12 text-gray-800 bg-gray-200 rounded-sm focus:outline-none focus:bg-white focus:ring-2 ring-gray-500"
          ></input>
          <button
            type="submit"
            className="absolute top-0 right-0 mt-3 mr-4 text-gray-500 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
          >
            <SVG src={send} className="w-8 h-8 fill-current" />
          </button>
        </form>
        <div id="fileMessage"></div>
        <div className="group">
          <input
            type="file"
            onChange={(e) => {
              document.getElementById("fileMessage").innerText =
                e.target.files.length + " files selected";
            }}
            multiple
            id="file"
            className="hidden"
          />
          <button
            onClick={() => document.getElementById("file").click()}
            className="absolute top-0 left-0 z-10 mt-3 ml-3 text-gray-500 group-hover:text-white focus:outline-none focus:text-gray-800"
          >
            <SVG src={image} className="w-8 h-8 fill-current " />
          </button>
          <div className="absolute top-0 left-0 h-full rounded-l-sm group-hover:bg-gray-500 w-14" />
        </div>
      </div>
    </React.Fragment>
  );
};
