import React, { useState } from "react";
import { SupabaseFactory } from "src/services/db/SupabaseFactory";
import { Button } from "src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Constants from "src/utils/Constants";
import EmailSent from "./EmailSent";

interface AuthResponse {
    data: {
        user: any;
        session: any;
    } | null;
    error: Error | null;
}

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const authService = SupabaseFactory.authService;

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await authService.resetPasswordForEmail(email) as AuthResponse;
            if (response.error) {
                console.error("Error sending reset email:", response.error);
                alert("Error sending reset email. Please try again.");
                setLoading(false);
                return;
            }
            setEmailSent(true);
            setLoading(false);
        } catch (error) {
            console.error("Error sending reset email:", error);
            alert("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <EmailSent />
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className={Constants.styles.cardBackground}>
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-2">Reset Password</h1>
                    <p className="text-center text-gray-400 text-sm mb-2">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={Constants.styles.inputClassName}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className={Constants.styles.primaryButtonClassName}
                        disabled={loading}>
                        {loading ? "Sending Instructions..." : "Send Reset Instructions"}
                    </Button>

                    <div className="text-center pt-4">
                        <a
                            href="/sign_in"
                            className="flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;