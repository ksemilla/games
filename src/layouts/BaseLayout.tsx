import { Link, Outlet } from "react-router-dom"

export function BaseLayout() {
  return (
    <div>
      <nav>
        <Link to="/snake">Snake</Link>
        <Link to="/Minesweeper">Minesweeper</Link>
      </nav>
      <Outlet />
    </div>
  )
}
