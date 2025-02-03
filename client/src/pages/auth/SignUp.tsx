import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "src/components/ui/button";
import Constants from "src/utils/Constants";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="DeepSeek Logo" className="w-12 h-12 mb-2" />
                    <h1 className="text-2xl text-blue-400 font-semibold">AI Chatbot</h1>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        {Constants.signUpDescription}
                    </p>
                </div>
                <form className="space-y-4">
                    <div>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email address"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                        />
                        <Button
                            className="absolute inset-y-0 right-2 flex items-center bg-transparent hover:bg-transparent"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                            )}
                        </Button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Confirm password"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                        />
                        <Button
                            className="absolute inset-y-0 right-2 flex items-center bg-transparent hover:bg-transparent"
                            onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                            )}
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Code"
                            className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600"
                        >
                            Send Code
                        </Button>
                    </div>
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-blue-500 bg-gray-700 rounded focus:ring-blue-400 focus:ring-2"
                        />
                        <label htmlFor="terms" className="ml-2 text-gray-400 text-sm">
                            {Constants.signUpConsent}{" "}
                            <a href="/terms-of-service" className="text-blue-400 hover:underline">
                                Terms of Use
                            </a>{" "}
                            and{" "}
                            <a href="/privacy-policy" className="text-blue-400 hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600 mt-4"
                    >
                        Sign Up
                    </Button>
                </form>
                <div className="flex justify-between items-center mt-4 text-sm">
                    <a href="/forgot-password" className="text-gray-400 hover:underline">
                        Forgot password?
                    </a>
                    <a href="/sign_in" className="text-blue-400 hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
