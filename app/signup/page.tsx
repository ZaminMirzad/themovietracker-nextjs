"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <main className="h-full min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center h-full flex-9/12">
        <form
          className="flex flex-col space-y-4 w-2xs mt-4"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <input
            className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2  rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2  rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text  "
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative flex justify-between items-center gap-2 rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] ">
            <input
              className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2 rounded-xl flex-1 bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:focus:ring-[#444444] dark:text-[#d5d3d3]"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 bg-[#D9D9D9] dark:bg-[#1c1c1c] p-0.5 pl-2 border-none cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* confirm password */}

          <div className="relative flex justify-between items-center gap-2 rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] ">
            <input
              className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2 rounded-xl flex-1 bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:focus:ring-[#444444] dark:text-[#d5d3d3]"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 bg-[#D9D9D9] dark:bg-[#1c1c1c] p-0.5 pl-2 border-none cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#37C6F3] text-white font-semibold py-2 px-4 rounded-xl mt-3"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold">
            Log In
          </Link>
        </p>
      </div>

      {/* built with love by */}
      <p className="text-sm text-gray-400  ">
        Built with <span className="text-red-500">❤️</span> by Zamin Mirzad
      </p>
    </main>
  );
}
