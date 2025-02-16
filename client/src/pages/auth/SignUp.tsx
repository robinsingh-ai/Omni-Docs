import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "src/components/ui/button";
import Constants from "src/utils/Constants";
import EmailSent from "./EmailSent";
import { SupabaseFactory } from "src/services/db/SupabaseFactory";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prevState) => !prevState);
    const authService = SupabaseFactory.authService;

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;

        if (!email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await authService.signUp(email, password);
            if (response.error) {
                console.error("Error signing up:", response.error);
                setLoading(false);
                return;
            }
            setLoading(false);
            setEmailSent(true);
        } catch (error) {
            setLoading(false);
        }
    }

    if (emailSent) {
        return <EmailSent />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className={Constants.styles.cardBackground}>
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="DeepSeek Logo" className="w-12 h-12 mb-2" />
                    <h1 className="text-2xl text-blue-400 font-semibold">AI Chatbot</h1>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        {Constants.signUpDescription}
                    </p>
                </div>
                <form
                    onSubmit={handleSignUp}
                    className="space-y-4">
                    <div>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email address"
                            className={Constants.styles.inputClassName}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            className={Constants.styles.inputClassName}
                        />
                        <Button
                            className="absolute inset-y-0 right-2 flex items-center bg-transparent hover:bg-transparent"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent any potential form submission
                                togglePasswordVisibility();
                            }}
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
                            className={Constants.styles.inputClassName}
                        />
                        <Button
                            className="absolute inset-y-0 right-2 flex items-center bg-transparent hover:bg-transparent"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleConfirmPasswordVisibility();
                            }}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                            )}
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
                        className="w-full py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600 mt-4">
                        {loading ? "Signing Up..." : "Sign Up"}
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
