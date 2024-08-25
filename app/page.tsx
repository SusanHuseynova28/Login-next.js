"use client";

import { useRequestMutation } from "./_http/axiosFetcher";
import CustomButtonLoading from "./_components/LoadingButton";
import { useFormik } from "formik";
import { LoginValidationSchema } from "./_validator/LoginValidation";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {
    trigger: loginservice,
    isMutating: loaading,
    error: isErr,
  } = useRequestMutation("login", {
    method: "POST",
    module: "devApi",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const InitialForm = {
    username: "",
    password: "",
    expiresInMins: 30,
  };
  const formik = useFormik({
    initialValues: InitialForm,
    validationSchema: LoginValidationSchema,
    onSubmit: (values) => {
      loginservice({
        body: values,
      }).then((res) => {
        setCookie("token", res.token, {
          expires: new Date(Date.now() + values.expiresInMins * 60000),
        });

        if (res.token && res) {
          router.push("/dashboard");
        }
      });
    },
  });

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1673526759327-54f1f5b27322?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="bg-white/10 backdrop-blur-md max-w-md w-full p-8 rounded-lg shadow-lg">
        {isErr && (
          <div className="bg-red-200 text-red-500 px-4 py-2 rounded-md mb-4">
            {isErr.message}
          </div>
        )}
        <form
          id="login"
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >
          <div className="text-center text-white text-2xl font-semibold mb-6">
            Login
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="username"
              placeholder="Email"
              className="w-full px-4 py-3 outline-none bg-transparent text-white placeholder-gray-300 rounded-md border border-gray-300"
            />
            {formik.errors.username && formik.touched.username ? (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            ) : null}
            <input
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 outline-none bg-transparent text-white placeholder-gray-300 rounded-md border border-gray-300"
            />
            {formik.errors.password && formik.touched.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            ) : null}
          </div>
          <div className="flex justify-between text-gray-300 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="text-blue-600 bg-transparent border border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            id="login"
            className="w-full flex items-center justify-center gap-2 p-3 my-2 bg-violet-900 text-white rounded-full shadow-lg transition duration-300 ease-in-out"
          >
            {loaading ? <CustomButtonLoading /> : "Login"}
          </button>
          <div className="text-center text-white text-sm mt-4">
            Don’t have an account?{" "}
            <a href="#" className="font-semibold hover:underline">
              Register
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
