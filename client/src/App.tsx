import ChatScreen from "./ChatScreen";
import Sidebar from "./components/Sidebar";

export default function App() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-grow relative">
                <ChatScreen />
            </div>
        </div>
    )
}