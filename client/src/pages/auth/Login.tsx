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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out hover:shadow-blue-500/10">
                <div className="flex justify-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>
                </div>
                <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-2">Welcome Back</h1>
                <p className="text-center text-gray-400 text-sm mb-6">Sign in to continue to your account</p>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                        <input
                            type="text"
                            autoComplete="email"
                            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 group cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-blue-500 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                        </label>
                        <Link to="/forgot_password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                    </div>
                    <Button
                        color="primary"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                    {auth.error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-red-400 text-center text-sm">{auth.error}</p>
                        </div>
                    )}
                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-600/50"></div>
                        <span className="px-4 text-gray-400 text-sm">or continue with</span>
                        <div className="flex-grow border-t border-gray-600/50"></div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center bg-white/5 backdrop-blur-sm text-white py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300 border border-gray-600/50"
                        onClick={handleGoogleLogin}
                    >
                        <FaGoogle className="mr-2 text-lg" />
                        Sign in with Google
                    </button>
                    <div className="text-center pt-4">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;