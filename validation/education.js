const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';



  if (Validator.isEmpty(data.school)) {
    errors.title = 'School field is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of field is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}