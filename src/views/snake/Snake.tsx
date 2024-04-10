import { useEffect, useRef, useState } from "react"

type Box = {
  color: string
}

type SnakePixel = {
  pos: number[]
  prevPos: number[]
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function RenderBoxes(props: { boxes: Box[][] }) {
  return (
    <div style={{ border: "1px solid gray", display: "inline-block" }}>
      {props.boxes.map((line, i) => (
        <div
          key={i}
          style={{
            padding: "0",
            margin: "0",
            display: "flex",
          }}
        >
          {line.map((box, j) => {
            return (
              <div
                key={j}
                style={{
                  padding: "0",
                  margin: "0",
                  width: "10px",
                  height: "10px",
                  border: `1px solid gray`,
                  backgroundColor: `${box.color}`,
                }}
              ></div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function generateBoxes(n: number, foodPos: number[]): Box[][] {
  const boxArray: Box[][] = []

  for (let i = 0; i < n; i++) {
    boxArray.push([])
    for (let j = 0; j < n; j++) {
      if (foodPos[0] === i && foodPos[1] === j) {
        boxArray[i].push({
          color: "black",
        })
      } else {
        boxArray[i].push({
          color: "white",
        })
      }
    }
  }
  return boxArray
}

export function SnakePage() {
  const n = 10
  const [food, setFood] = useState([
    Math.floor(Math.random() * n),
    Math.floor(Math.random() * n),
  ])
  const [score, setScore] = useState(0)
  const [boxes, setBoxes] = useState<Box[][]>(generateBoxes(n, food))
  const [snake, setSnake] = useState<SnakePixel[]>([
    {
      pos: [0, 2],
      prevPos: [0, 1],
    },
    {
      pos: [0, 1],
      prevPos: [0, 0],
    },
    {
      pos: [0, 0],
      prevPos: [1, 0],
    },
  ])
  const [direction, setDirection] = useState<"l" | "r" | "d" | "u">("r")

  const [delay, setDelay] = useState<number | null>(100)

  useInterval(() => {
    if (
      snake[0].pos[1] >= n ||
      snake[0].pos[1] < 0 ||
      snake[0].pos[0] < 0 ||
      snake[0].pos[0] >= n ||
      (boxes[snake[0].pos[0]][snake[0].pos[1]].color === "black" &&
        food[0] !== snake[0].pos[0] &&
        food[1] !== snake[0].pos[1])
    ) {
      setDelay(null)
      resetAll()
    } else {
      if (food[0] === snake[0].pos[0] && food[1] === snake[0].pos[1]) {
        const length = snake.length
        setSnake((snake) => [
          ...snake,
          {
            pos: [snake[length - 1].prevPos[0], snake[length - 1].prevPos[1]],
            prevPos: [0, 0],
          },
        ])
        generateFood()
        setDelay((prevState) => {
          if (prevState) {
            return prevState - 1
          } else return prevState
        })
        setScore((prevState) => prevState + 1)
      }

      switch (direction) {
        case "r":
          setSnake((snake) =>
            snake.map((snek, i) => {
              if (i === 0) {
                return {
                  pos: [snek.pos[0], snek.pos[1] + 1],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              } else {
                return {
                  pos: [snake[i - 1].pos[0], snake[i - 1].pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              }
            })
          )
          break
        case "l":
          setSnake((snake) =>
            snake.map((snek, i) => {
              if (i === 0) {
                return {
                  pos: [snek.pos[0], snek.pos[1] - 1],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              } else {
                return {
                  pos: [snake[i - 1].pos[0], snake[i - 1].pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              }
            })
          )

          break
        case "d":
          setSnake((snake) =>
            snake.map((snek, i) => {
              if (i === 0) {
                return {
                  pos: [snek.pos[0] + 1, snek.pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              } else {
                return {
                  pos: [snake[i - 1].pos[0], snake[i - 1].pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              }
            })
          )

          break
        case "u":
          setSnake((snake) =>
            snake.map((snek, i) => {
              if (i === 0) {
                return {
                  pos: [snek.pos[0] - 1, snek.pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              } else {
                return {
                  pos: [snake[i - 1].pos[0], snake[i - 1].pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              }
            })
          )

          break
        default:
          setSnake((snake) =>
            snake.map((snek, i) => {
              if (i === 0) {
                return {
                  pos: [snek.pos[0], snek.pos[1] + 1],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              } else {
                return {
                  pos: [snake[i - 1].pos[0], snake[i - 1].pos[1]],
                  prevPos: [snek.pos[0], snek.pos[1]],
                }
              }
            })
          )

          break
      }
      snake.forEach((snek, i) => {
        setBoxColor(snek.pos, "black")
        if (i === snake.length - 1) {
          setBoxColor(snek.prevPos, "white")
        }
      })
    }
  }, delay)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" && direction !== "u") {
        setDirection("d")
      } else if (event.key === "ArrowUp" && direction !== "d") {
        setDirection("u")
      } else if (event.key === "ArrowRight" && direction !== "l") {
        setDirection("r")
      } else if (event.key === "ArrowLeft" && direction !== "r") {
        setDirection("l")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [direction])

  function setBoxColor(pos: number[], color: string) {
    setBoxes((prevState) =>
      prevState.map((line, i) => {
        return line.map((box, j) => {
          if (i === pos[0] && j === pos[1]) {
            return {
              color,
            }
          } else {
            return box
          }
        })
      })
    )
  }

  function generateFood() {
    let isValid: boolean = false
    while (!isValid) {
      const randomNumber = Math.floor(Math.random() * n * n)

      const y = Math.floor(randomNumber / n)

      const x = randomNumber - y * n
      if (boxes[y][x].color === "white") {
        setFood([y, x])
        setBoxColor([y, x], "black")
        isValid = true
      }
    }
  }

  function resetAll() {
    const foodPos = [
      Math.floor(Math.random() * n),
      Math.floor(Math.random() * n),
    ]
    setBoxes(generateBoxes(n, foodPos))
    setSnake([
      {
        pos: [0, 2],
        prevPos: [0, 1],
      },
      {
        pos: [0, 1],
        prevPos: [0, 0],
      },
      {
        pos: [0, 0],
        prevPos: [1, 0],
      },
    ])
    setDirection("r")
    setDelay(null)
    setFood(foodPos)
    setScore(0)
  }

  return (
    <div>
      <p>{score}</p>
      <RenderBoxes boxes={boxes} />
      <div>
        <button
          onClick={() => {
            resetAll()
          }}
        >
          Reset
        </button>
        <button onClick={() => setDelay(100)}>Start</button>
      </div>
    </div>
  )
}
