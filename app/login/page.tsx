"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="h-full  min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center h-full flex-9/12">
        <Link href={"/"} className="text-5xl font-bold self-start">
          The <br />
          Movie <br /> Tracker
        </Link>

        <form className="flex flex-col space-y-4 w-2xs mt-4" autoComplete="off">
          <input
            className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2  rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="email"
            name="email"
            placeholder="Username or email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative flex justify-between items-center gap-2">
            <input
              className="border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2 rounded-xl bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:focus:ring-[#444444] dark:text-[#d5d3d3] flex-1"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {/* show/hide password */}
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
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold">
            Sign Up
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
