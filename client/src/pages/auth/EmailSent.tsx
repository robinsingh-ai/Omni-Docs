import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router";
import Constants from "src/utils/Constants";

const EmailSent = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="AI Chatbot Logo" className="w-12 h-12 mb-2" />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl text-blue-400 font-semibold">Email Sent</h1>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        {Constants.emailSentDescription}
                    </p>
                </div>
                <Button
                    type="submit"
                    onPress={() => {
                        navigate("/");
                    }}
                    className="mt-24 w-full py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600">
                    Back to Login
                </Button>
            </div>
        </div>
    );
};

export default EmailSent;
