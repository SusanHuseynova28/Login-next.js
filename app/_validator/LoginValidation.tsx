import * as yup from "yup";

export const LoginValidationSchema = yup.object({
  username: yup.string().trim().required("Username is required"),
  password: yup.string().trim().required("Password is required"),
});
