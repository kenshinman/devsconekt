import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";

class Dashboard extends Component {
  state = {};

  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    return <h1>Dashboard</h1>;
  }
}

export default connect(null, { getCurrentProfile })(Dashboard);
