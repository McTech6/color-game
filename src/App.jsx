import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5",
        "#FFC300", "#C70039", "#900C3F", "#581845", "#1A5276", "#1E8449"
    ];

    const [targetColor, setTargetColor] = useState("");
    const [colorOptions, setColorOptions] = useState([]);
    const [gameStatus, setGameStatus] = useState("");
    const [score, setScore] = useState(0);
    const [showColorBox, setShowColorBox] = useState(false);

    useEffect(() => {
        trackVisit();
        startNewGame();
    }, []);

    const trackVisit = async () => {
        try {
            const response = await axios.get("https://api64.ipify.org?format=json");
            const ip = response.data.ip;

            await axios.post("https://wesite-traffic-tracking-1.onrender.com/tick", {
                ip,
                userAgent: navigator.userAgent
            });

            console.log("Visit tracked successfully.");
        } catch (error) {
            console.error("Error tracking visit:", error);
        }
    };

    const startNewGame = () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setTargetColor(randomColor);
        setColorOptions(generateColorOptions(randomColor));
        setGameStatus("");
        setShowColorBox(false);
    };

    const generateColorOptions = (correctColor) => {
        const options = [correctColor];
        while (options.length < 6) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (!options.includes(randomColor)) options.push(randomColor);
        }
        return shuffleArray(options);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleGuess = (color) => {
        if (color === targetColor) {
            setGameStatus("Correct!");
            setScore(score + 1);
            setShowColorBox(true);
        } else {
            setGameStatus("Wrong!");
            setShowColorBox(false);
        }
    };

    return (
        <div className="game-container">
            <p className="game-instructions" data-testid="gameInstructions">
                Guess the correct color!
            </p>
            {showColorBox && (
                <div
                    className="color-box"
                    style={{ backgroundColor: targetColor }}
                    data-testid="colorBox"
                ></div>
            )}
            <div className="color-options">
                {colorOptions.map((color, index) => (
                    <button
                        key={index}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        onClick={() => handleGuess(color)}
                        data-testid="colorOption"
                    ></button>
                ))}
            </div>
            <p className="game-status" data-testid="gameStatus">
                {gameStatus}
            </p>
            <p className="score" data-testid="score">
                Score: {score}
            </p>
            <button
                className="new-game-button"
                onClick={startNewGame}
                data-testid="newGameButton"
            >
                New Game
            </button>
        </div>
    );
}

export default App;
