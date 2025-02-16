
interface ThreeDotLoaderProps {
    animationDuration?: string;
    animation?: "typing" | "wave";
    transition?: string;
    size?: number;
}

const ThreeDotLoader: React.FC<ThreeDotLoaderProps> = ({ animation = "wave", transition = "ease-in-out", size = 10 }) => {

    let childrenAnimationDelay: string[] = ['0', '0.2', '0.4'];

    function Dot(animationDelay: string) {
        return <span
            key={Math.random()}
            style={{
                backgroundColor: 'currentColor',
                borderRadius: '50%',
                width: `${size}px`,
                height: `${size}px`,
                animation: `${`${animation} 1.2s infinite ${transition}`}`,
                animationDelay: `${animationDelay}s`
            }}
            className="dot"></span>;
    }
    return (
        <div
            key={Math.random()}
            className="flex justify-center items-center gap-2">
            {
                [0, 1, 2].map((i) => {
                    return Dot(childrenAnimationDelay[i]);
                }, [])
            }
        </div>
    );
};

export default ThreeDotLoader;