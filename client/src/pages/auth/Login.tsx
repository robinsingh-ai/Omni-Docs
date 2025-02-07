import { setAuth, setAuthError, setLoading } from "src/redux/reducers/authSlice";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { SupabaseFactory } from "src/services/db/SupabaseFactory";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/redux/store";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const authService = SupabaseFactory.authService;
    const loading = useSelector((state: RootState) => state.auth.isLoading);
    const auth = useSelector((state: RootState) => state.auth);

    const handleLogin = () => {
        dispatch(setLoading(true));
        authService.signIn(email, password)
            .then((response: any) => {
                if (response.error) {
                    console.error("Error logging in:", response.error);
                    dispatch(setLoading(false));
                    dispatch(setAuthError("Invalid email or password."));
                    setTimeout(() => {
                        dispatch(setAuthError(null));
                    }, 5000);
                    return;
                }
                dispatch(setAuth({
                    session: response.data.session,
                    user: response.data.user,
                    isAuthenticated: true,
                    provider: "email",
                    loading: false,
                    error: null
                }));
                navigate("/");
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                dispatch(setLoading(false));
            });
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await authService.signInWithGoogle();
            if (response.error) {
                console.error("Error signing in with Google:", response.error);
                return;
            }
            dispatch(setAuth({
                session: (response.data as any).session,
                user: (response.data as any).user,
                isAuthenticated: true,
                provider: "google",
                loading: false,
            }));
        } catch (e) {
            console.error("Error signing in with Google:", e);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6 animate-glow-slow">
                <div className="flex justify-center">
                    <img src="/logo.png" alt="Logo" className="w-20 h-20 mb-4" />
                </div>
                <h1 className="text-center text-3xl font-bold text-blue-500 mb-4">Login</h1>
                <div className="space-y-4">
                    <input
                        type="text"
                        autoComplete="email"
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        autoComplete="current-password"
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="form-checkbox rounded text-blue-500 focus:ring-blue-500"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <span className="text-sm text-gray-400">Remember me</span>
                        </label>
                        <Link to="/forgot_password" className="text-sm text-blue-500 hover:underline">Forgot password?</Link>
                    </div>
                    <Button
                        color="primary"
                        className="w-full text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Log in"}
                    </Button>
                    {auth.error && (
                        <p className="text-red-500 text-center text-sm mt-2">{auth.error}</p>
                    )}
                    <div className="relative flex items-center my-4">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="px-4 bg-gray-800 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 transition duration-300"
                        onClick={handleGoogleLogin}
                    >
                        <FaGoogle className="mr-2" />
                        Log in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;