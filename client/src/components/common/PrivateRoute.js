import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, ...rest, auth, }) => (
  <Route
    {...rest}
    render={props => {
      return auth.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;
    }}
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(PrivateRoute);
