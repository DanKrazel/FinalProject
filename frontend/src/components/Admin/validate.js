import validator from "validator"

const validateSignUpForm = payload => {
  const errors = {};
  let message = "";
  let isFormValid = true;


  if (
    !payload ||
    typeof payload.user_id !== "string" ||
    payload.user_id.trim().length === 0
  ) {
    isFormValid = false;
    errors.user_id = "Please provide an ID.";
  }

  if (
    !payload ||
    typeof payload.username !== "string" ||
    payload.username.trim().length === 0
  ) {
    isFormValid = false;
    errors.username = "Please provide a user name.";
  }

  if (
    !payload ||
    typeof payload.mail !== "string" ||
    !validator.isEmail(payload.mail)
  ) {
    isFormValid = false;
    errors.mail = "Please provide a correct email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 4
  ) {
    isFormValid = false;
    errors.password = "Password must have at least 8 characters.";
  }

  if (
    !payload ||
    typeof payload.role !== "string" ||
    payload.username.trim().length === 0
  ) {
    isFormValid = false;
    errors.role = "Please provide a role";
  }

//   if (!payload || payload.pwconfirm !== payload.password) {
//     isFormValid = false;
//     errors.pwconfirm = "Password confirmation doesn't match.";
//   }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
};

const validateLoginForm = payload => {
  const errors = {};
  let message = "";
  let isFormValid = true;

  if (
    !payload ||
    typeof payload.username !== "string" ||
    payload.username.trim().length === 0
  ) {
    isFormValid = false;
    errors.username = "Please provide your user name.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length === 0
  ) {
    isFormValid = false;
    errors.password = "Please provide your password.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
};

// module.exports = {
//   validateLoginForm: validateLoginForm,
//   validateSignUpForm: validateSignUpForm
// };
export default validateSignUpForm;