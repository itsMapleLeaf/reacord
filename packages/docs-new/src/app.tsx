import { description } from "reacord/package.json"
import { Meta, Title } from "react-head"
import "tailwindcss/tailwind.css"
import "./styles/prism-theme.css"

export function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Title>Reacord</Title>
      <Meta name="description" content={description} />
      {children}
    </>
  )
}
