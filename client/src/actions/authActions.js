import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER } from "../actions/types";

import { GET_ERRORS } from "./types";

//REGISTER USER
//same as (userData) => {
//    (dispatch ) => {
//      doo all the stuff
//    }
//  }
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      //receive data
      history.push("/login");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Login - Get User Token
//a thunk type of reducer

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save token to local storage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      //set token to auth header
      setAuthToken(token);
      //decode
      const decoded = jwt_decode(token);
      console.log(decoded);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user

export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  //remove auth Header from axios
  setAuthToken(false);
  //set current user to {} and isAuthenricated to false
  dispatch(setCurrentUser({}));
};
