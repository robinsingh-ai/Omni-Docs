import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Button } from "./components/ui/button";
const App: React.FC = () => {
  const [counter, setCounter] = React.useState<number>(0);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        You have tapped the button
        <span className="text-4xl">{counter}</span>
        times
      </div>
      <Button
        className="mt-4"
        onClick={() => setCounter(counter + 1)}> <div className="flex space-x-2 items-center justify-center">
          <FaPlus />
        </div> </Button>
    </div>
  );
}

export default App;

