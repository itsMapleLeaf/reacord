export function html({
  head,
  body,
  scriptSource,
}: {
  head: string
  body: string
  scriptSource: string
}): string {
  return /* HTML */ `
    <!DOCTYPE html>
    <html lang="en" class="bg-slate-900 text-slate-100">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link href="/src/styles/tailwind.css" rel="stylesheet" />
        <link href="/src/styles/prism-theme.css" rel="stylesheet" />
        ${head}
        <script type="module" src="${scriptSource}"></script>
      </head>
      <body>
        <div id="app" class="contents">${body}</div>
      </body>
    </html>
  `
}
