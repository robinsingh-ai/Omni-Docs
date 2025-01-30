export default function SignUp() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-4 space-y-4 bg-gray-800 rounded-lg">
                <h1 className="text-3xl text-white font-bold">Sign Up</h1>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number / email address"
                    />
                </div>
                <div className="relative">
                    <input
                        type="password"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="remember"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-400">
                        I confirm that I have read, consent, and agree to DeepSeek's
                        <a href="#" className="text-blue-500"> Terms of Use</a> and
                        <a href="#" className="text-blue-500"> Privacy Policy</a>.
                    </label>
                </div>
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600"
                >
                    Sign Up
                </button>
                <div className="flex justify-between text-sm text-gray-400 mt-4">
                    <a href="#" className="hover:underline">Forgot password?</a>
                    <a href="#" className="hover:underline">Sign in</a>
                </div>
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-600"></div>
                    <span className="px-4 text-gray-400">OR</span>
                    <div className="flex-grow h-px bg-gray-600"></div>
                </div>
                <button
                    className="w-full flex items-center justify-center bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200"
                >
                    Log in with Google
                </button>
            </div>
        </div>
    );
}