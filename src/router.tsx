import { createBrowserRouter } from "react-router-dom"
import { SnakePage } from "./views/snake/Snake"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SnakePage />,
  },
])
