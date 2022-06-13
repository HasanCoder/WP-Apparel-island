import React, { createContext, useReducer } from "react";
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/types";

const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };
    case GET_ERRORS:
      return {
        ...state,
        error: {
          msg: action.payload.msg,
          status: action.payload.status,
          id: action.payload.id,
        },
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: {
          msg: {},
          status: null,
          id: null,
        },
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", action.payload.user.id);
      localStorage.setItem("userName", action.payload.user.name);
      console.log(`token set :: ${action.payload.token}`);
      return {
        ...state,
        auth: {
          ...action.payload,
          isAuthenticated: true,
          isLoading: false,
        },
      };
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
    case LOGIN_FAIL:
      localStorage.setItem("token", null);
      localStorage.setItem("user", null);
      localStorage.setItem("userName", null);
      return {
        ...state,
        auth: {
          ...state.auth,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};

const initialState = {
  title: "",
  auth: {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: null,
  },
  error: {
    msg: {},
    status: null,
    id: null,
  },
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
