import React from "react";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdVideocam,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthHooks } from "../../hooks/auth";
import { variants } from "../../data/authanimationvariant";
import { useForm } from "react-hook-form";
import { useLogInHooks } from "../../hooks/form/login";

const AuthPage: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const {
    isLogin,
    setIsLogin,
    showConfirmPassword,
    showPassword,
    isMobile,
    setShowConfirmPassword,
    setShowPassword,
    viewportChecker,
  } = useAuthHooks();

  const { isLoggingIn, login } = useLogInHooks();

  viewportChecker();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div
        className={`backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl p-8 border border-white/20 transition-all duration-300 
        ${
          isMobile ? "w-full max-w-sm" : "w-full max-w-md"
        } relative overflow-hidden`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-md">
              <MdVideocam className="text-white text-2xl" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">AutoClip Farm</h1>
              <p className="text-xs text-gray-300 tracking-wide">
                AI Video Clip Generator
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait" custom={isLogin ? -1 : 1}>
            {isLogin ? (
              <motion.div
                key="login"
                custom={-1}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h2 className="text-lg font-semibold text-gray-100 mb-4 text-center">
                  Welcome back 👋
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(login)}>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("email", {
                        required: "This field is required",
                      })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.email.message as String}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password", {
                        required: "This field is required",
                        minLength: {
                          value: 8,
                          message: "Password must be 8 character atleast",
                        },
                      })}
                      className="w-full pl-10 pr-10 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.password.message as String}
                      </p>
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-pink-500/50 hover:scale-[1.02] transition transform cursor-pointer"
                  >
                    {isLoggingIn ? "Signing you in..." : "Sign In"}
                  </button>
                </form>

                <p className="text-center text-gray-300 mt-6 text-sm">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-pink-400 font-semibold hover:underline cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                custom={1}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h2 className="text-lg font-semibold text-gray-100 mb-4 text-center">
                  Join the AI Revolution 🚀
                </h2>
                <form className="space-y-4">
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                  </div>

                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                  </div>

                  <div className="relative">
                    <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>

                  <div className="relative">
                    <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full pl-10 pr-10 py-2 border border-gray-600 bg-black/30 text-white rounded-lg focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-pink-500/50 hover:scale-[1.02] transition transform cursor-pointer"
                  >
                    Sign Up
                  </button>
                </form>

                <p className="text-center text-gray-300 mt-6 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-pink-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
