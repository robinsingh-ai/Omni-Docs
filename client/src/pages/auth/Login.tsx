import { setUser } from "src/redux/reducers/authSlice";
import { AppDispatch } from "src/redux/store";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = () => {
        // Handle login logic here
        dispatch(setUser({ email, password }));
        navigate("/");
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg">
                <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="AI Chatbot Logo" className="h-10" />
                </div>
                <h1 className="text-center text-xl font-bold text-blue-500 mb-4">Login</h1>
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone number / email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="remember" className="text-sm text-gray-400">
                            I confirm that I have read, consent, and agree to DeepSeek's
                            <a href="#" className="text-blue-500"> Terms of Use</a> and
                            <a href="#" className="text-blue-500"> Privacy Policy</a>.
                        </label>
                    </div>
                    <Button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600"
                        onPress={handleLogin}
                    >
                        Log in
                    </Button>
                    <div className="flex justify-between text-sm text-gray-400 mt-4">
                        <Link to="/forgot_password" className="hover:underline">Forgot password?</Link>
                        <Link to="/sign_up" className="hover:underline">Sign up</Link>
                    </div>
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-600"></div>
                        <span className="px-4 text-gray-400">OR</span>
                        <div className="flex-grow h-px bg-gray-600"></div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200"
                        onClick={handleGoogleLogin}
                    >
                        <FaGoogle className="mr-2" /> Log in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
