import { createBrowserRouter } from "react-router-dom"
import { SnakePage } from "./views/snake/Snake"
import { BaseLayout } from "./layouts/BaseLayout"
import { MinesweeperPage } from "./views/minesweeper/Minesweeper"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/snake",
        element: <SnakePage />,
      },
      {
        path: "/minesweeper",
        element: <MinesweeperPage />,
      },
    ],
  },
])
