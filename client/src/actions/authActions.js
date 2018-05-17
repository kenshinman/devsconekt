import axios from "axios";
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
