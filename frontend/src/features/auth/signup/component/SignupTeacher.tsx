import type { FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import useManualFetch from "../../../../shared/hooks/useManualFetch";
import { updateAuth } from "../../authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TeacherLogin from "../../../../assets/TeacherLogin.webp"

const SignupTeacher: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { execute, data, status, error } = useManualFetch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await execute(
      `${import.meta.env.VITE_BACKEND_URL}/auth/signupTeacher`,
      "POST",
      {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }
    );
  };

  useEffect(() => {
    if (status === "success" && data) {
      dispatch(
        updateAuth({
          authenticated: true,
          user: `${firstName} ${lastName}`,
        })
      );
      navigate("/teacher");
    } else if (status === "error") {
      console.log(error);
    }
  }, [status, data, dispatch, navigate, firstName, lastName]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex w-[70%] max-w-5xl shadow-2xl rounded-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 bg-white p-10">
          <h2 className="text-2xl font-semibold mb-6">
            Register as a Teacher
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
              />
              <span className="text-sm">
                I accept the{" "}
                <Link to="/terms" className="text-blue-600">
                  Terms and Conditions
                </Link>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition-colors"
            >
              {status === "loading" ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Already have an account */}
            <Link className="text-blue-600 text-center" to="/auth/signin">
              Already have an account?
            </Link>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100 p-10">
          <h2 className="text-xl font-semibold mb-4">Welcome Teacher!</h2>
          <div className="text-6xl font-bold flex items-center gap-3">
            <img
              src={TeacherLogin}
              alt="Teacher"
              className="w-full h-full"
            />
          </div>
          <p className="mt-6 text-gray-600">
            Already registered?{" "}
            <Link to="/auth/signin" className="text-blue-600 font-medium">
              Log in now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupTeacher;
