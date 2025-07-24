import * as yup from "yup";

export const RegisterSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is required"),
    lastName: yup
        .string()
        .required("Last name is required"),
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
    resetPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passwords must match")
        .required("Confirm password is required")
});