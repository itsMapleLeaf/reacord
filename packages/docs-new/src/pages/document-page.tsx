import { Suspense } from "react"
import { Outlet } from "react-router"

export function DocumentPage() {
  return (
    <>
      <h1>Docs</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </>
  )
}
