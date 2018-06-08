import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
  }
  render() {
    const { errors } = this.state;
    const options = [
      //options for status
      { label: "* Select Professional Status", value: "0" },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: "Student or Learning", value: "Student or Learning" },
      { label: "Instructor or Teacher", value: "Instructor or Teacher" },
      { label: "Intern", value: "Intern" },
      { label: "Other", value: "Other" }
    ];
    return (
      <div className="create-profile">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Create Your Profile</h1>
            <p className="lead">
              Let's get some information to make your profile stand out.
            </p>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="* Profile Handle"
                name="handle"
                value={this.state.handle}
                onChange={this.onChange}
                error={errors.handle}
                info="The unique handle for your profile URL. You full name, company name, nickname, etc."
              />
              <SelectListGroup
                name="status"
                value={this.state.status}
                onChange={this.onChange}
                error={errors.status}
                info="Give us an idea of where you are at in your career."
                options={options}
              />
              <TextFieldGroup
                placeholder="Company"
                name="company"
                value={this.state.company}
                onChange={this.onChange}
                error={errors.company}
                info="Could be your own company or one you work for."
              />
              <TextFieldGroup
                placeholder="Website"
                name="website"
                value={this.state.website}
                onChange={this.onChange}
                error={errors.website}
                info="Could be your own company or one you work for."
              />
              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={this.state.location}
                onChange={this.onChange}
                error={errors.location}
                info="City or city & state."
              />
              <TextFieldGroup
                placeholder="Skills"
                name="skills"
                value={this.state.skills}
                onChange={this.onChange}
                error={errors.skills}
                info="Please use comma separated values e.g. HTML, CSS, PHP, JavaScript"
              />
              <TextFieldGroup
                placeholder="GitHub Username"
                name="githubusername"
                value={this.state.githubusername}
                onChange={this.onChange}
                error={errors.githubusername}
                info="If you want your latest repo on github"
              />
              <TextAreaFieldGroup
                placeholder="Short Bio..."
                name="bio"
                value={this.state.bio}
                onChange={this.onChange}
                error={errors.bio}
                info="Tell us a little about yourself"
              />
              <div className="mb-3">
                <button
                  onClick={() => {
                    this.setState(prevState => ({
                      displaySocialInputs: !prevState.displaySocialInputs
                    }));
                  }}
                  className="btn btn-white">
                  Add Social Network Links
                </button>
                <span className="text-muted">Optional</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object,
  errors: PropTypes.object
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});
export default connect(mapStateToProps, {})(CreateProfile);
