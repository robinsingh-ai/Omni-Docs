import { Button } from "@nextui-org/react";

// LandingPage.tsx
const LandingPage = () => {
    const handleNavigateToChat = () => {
        

        window.location.href = 'http://chat.localhost:3000'; // Navigate to the subdomain
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Chat App</h1>
                <Button
                    onPress={handleNavigateToChat}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Get Started
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;