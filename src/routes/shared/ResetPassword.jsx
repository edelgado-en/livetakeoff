import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { CheckCircleIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

import * as api from "./apiService";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        uid,
        token,
        new_password: newPassword,
      });

      setMessage("Your password has been reset. You can now log in.");
    } catch (err) {
      setError(
        "Failed to reset password. The link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 flex items-start justify-center">
      <div className="w-full max-w-md mt-12">
        {message ? (
          <div className="text-center px-4">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-lg font-medium text-gray-900 mt-4">
              Password reset successful
            </p>
            <p className="mt-2 text-md text-gray-500">
              You can now sign in with your new password.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block rounded-md bg-red-600 px-5 py-2 text-white font-medium hover:bg-red-700 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Reset Your Password
            </h2>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm pr-10"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500 relative top-3" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500 relative top-3" />
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm pr-10"
                />
              </div>

              {error && (
                <p className="text-red-600 text-md font-semibold">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
