



// // Register User
// export const register = ({ name, email, password }) => (
//   dispatch
// ) => {
//   // Headers
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   // Request body
//   const body = JSON.stringify({ name, email, password });

//   axios
//     .post('/api/auth/register', body, config)
//     .then(res =>
//       dispatch({
//         type: REGISTER_SUCCESS,
//         payload: res.data
//       })
//     )
//     .catch(err => {
//       dispatch(
//         returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
//       );
//       dispatch({
//         type: REGISTER_FAIL
//       });
//     });
// };

// // Login User
// export const login = ({ email, password }) => {

//   alert('i am here');

// };

// // Logout User
// export const logout = () => {
//   return {
//     type: LOGOUT_SUCCESS
//   };
// };

