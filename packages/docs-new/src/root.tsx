import { Counter } from "./counter"

export function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="test description" />
        <title>Reacord</title>
        <script
          type="module"
          src={
            import.meta.env.PROD ? "/entry.client.js" : "/src/entry.client.tsx"
          }
        />
      </head>
      <body>
        <h1>hi</h1>
        <Counter />
      </body>
    </html>
  )
}
