import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import axios from '../actions/axios';

import { Context } from "./Store";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  GET_ERRORS, CLEAR_ERRORS
} from '../actions/types';

export default _ => {

   
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [err, setErr] = useState('');
   const navigate = useNavigate();

   const [state, dispatch] = useContext(Context);

   const returnErrors = (msg, status, id = null) => {
      return {
        type: GET_ERRORS,
        payload: { msg, status, id }
      };
    };

   const handleOnSubmit = (e) => {

      e.preventDefault();
      dispatch({ type: CLEAR_ERRORS });

      // Headers
      const config = {
         headers: {
            'Content-Type': 'application/json'
         }
      };

      // Request body
      const body = JSON.stringify({ email, password });

      axios
         .post('/auth', body, config)
            .then(res => {
               if(res.status){
                  console.log('1',res.data);
                  dispatch({
                     type: LOGIN_SUCCESS,
                     payload: res.data
                  });
               }else{
                  setErr(res.message);
                  console.log('2',res.message);
                  dispatch(returnErrors(res.message,res.status,'LOGIN_FAIL'));
                  dispatch({ type: LOGIN_FAIL });
               }
            }
            
         )
         .catch(err => {
            setErr(err.response.data.message);
            dispatch(
               returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
            );
            dispatch({
               type: LOGIN_FAIL
            });
         });
      // const user = { email, password };
      // login(user);
   };



   useEffect(() => {
      console.log('state changed' , state);
      if(state.auth.isAuthenticated){
         navigate('/dashboard');
      }
   }, [state]);

   useEffect(_ => {
      dispatch({
         type: "SET_TITLE",
         payload: `Login`,
      });
   }, []);
   return (
      <div className="flex items-center justify-center h-full bg-gray-50">
         <div className="min-h-screen md:w-1/3 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className=" w-full space-y-8">
               <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                     Sign in
                  </h2>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleOnSubmit} action="#" method="POST">
                  <input type="hidden" name="remember" value="true" />
                  {state.error.msg.msg ? <div className="mt-2 mb-2">
                     <p style={{color:"red"}}>{state.error.msg.msg}</p>
                  </div> : err!="" && <div className="mt-2 mb-2"><p style={{color:"red"}}>{err}</p></div>}
                  <div className="rounded-md shadow-sm -space-y-px">
                     <div>
                        <label htmlFor="email" className="sr-only">
                           Email
                        </label>
                        <input
                           id="email"
                           name="email"
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Email address"
                        />
                     </div>
                     <div>
                        <label htmlFor="password" className="sr-only">
                           Password
                        </label>
                        <input
                           id="password"
                           name="password"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           autoComplete="current-password"
                           required
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Password"
                        />
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-between">
                     <div className="flex items-center">
                        <input
                           id="remember_me"
                           name="remember_me"
                           type="checkbox"
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                           htmlFor="remember_me"
                           className="ml-2 block text-sm text-gray-900"
                        >
                           Remember me
                        </label>
                     </div>

                     <div className="text-sm">
                        <a
                           href="##"
                           className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                           Forgot your password?
                        </a>
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                           <svg
                              className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fillRule="currentColor"
                              aria-hidden="true"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </span>
                        Sign in
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};
