import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const GRID_SIZE = 20;
const COLORS = [
  "#FF4500",
  "#FFD700",
  "#008000",
  "#00FFFF",
  "#0000FF",
  "#800080",
  "#FFFFFF",
  "#000000",
];

const RPlaceClone = ({
  handlePixelClickSocket,
  socket,
}: {
  handlePixelClickSocket: (index: number, color: string) => void;
  socket: Socket;
}) => {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE * GRID_SIZE).fill("#FFFFFF")
  );
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handlePixelClick = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = selectedColor;
    setGrid(newGrid);
    handlePixelClickSocket(index, selectedColor);
  };

  useEffect(() => {
    socket.on("place", ({ index, color }: { index: number; color: string }) => {
      const newGrid = [...grid];
      newGrid[index] = color;
      setGrid(newGrid);
    });

    return () => {
      socket.off("place");
    };
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gap: "1px",
        }}
      >
        {grid.map((color, index) => (
          <div
            key={index}
            onClick={() => handlePixelClick(index)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: color,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      <div>
        <label>Select Color: </label>
        <select
          onChange={(e) => setSelectedColor(e.target.value)}
          value={selectedColor}
        >
          {COLORS.map((color) => (
            <option
              key={color}
              value={color}
              style={{ backgroundColor: color }}
            >
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RPlaceClone;
