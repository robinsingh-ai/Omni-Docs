import React, { useState } from "react";
import { SupabaseFactory } from "src/services/db/SupabaseFactory";
import { Button } from "src/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-blue-500/10">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Mail className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent mb-4">Check Your Email</h1>
                        <p className="text-center text-gray-400 text-sm mb-6">
                            We've sent password reset instructions to {email}. Please check your inbox and follow the link to reset your password.
                        </p>
                        <a 
                            href="/sign_in"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-blue-500/10">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-2">Reset Password</h1>
                    <p className="text-center text-gray-400 text-sm mb-6">
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
                            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        disabled={loading}
                    >
                        {loading ? "Sending Instructions..." : "Send Reset Instructions"}
                    </Button>

                    <div className="text-center pt-4">
                        <a 
                            href="/sign_in"
                            className="flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
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