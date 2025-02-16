import Constants from "../utils/Constants"
import { ArrowLeft, Mail } from "lucide-react";

const EmailSent = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className={Constants.styles.cardBackground}>
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Mail className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent mb-4">Check Your Email</h1>
                    <p className="text-center text-gray-400 text-sm mb-6">
                        An email has been sent to your email address. Follow the instructions to reset your password.
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
    )
}

export default EmailSent;