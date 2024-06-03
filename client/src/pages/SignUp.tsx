import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export type SignUpType = {
  username: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpType>({
    username: "",
    email: "",
    password: "",
  });
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const { loading, error } = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      return toast.error("Please fill in all fields");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        // dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }

      setLoading(false);
      toast.success("User registered successfully");
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      // dispatch(signInFailure((error as Error).message));
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col justify-center h-screen">
      <h1 className="text-3xl font-bold text-center my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100"
          id="username"
          required
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100"
          id="email"
          onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
        />
        <div className="w-full relative">
          <input
            type={passwordType}
            placeholder="Password"
            className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100 text-black"
            id="password"
            onChange={handleChange}
          />
          <span
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
            className="absolute right-3 top-4"
          >
            {passwordType === "password" ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </span>
        </div>
        <button
          className="
            bg-blue-700
            text-white
            p-3
            rounded-lg
            uppercase
            hover:opacity-95
            disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-1 items-center justify-end mt-2">
        <p className="text-gray-400 text-sm">Already have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700 hover:underline text-sm">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
