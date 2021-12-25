import * as React from "react"
import { Button } from "../src.new/button.js"
import { EmbedField } from "../src.new/embed/embed-field.js"
import { EmbedTitle } from "../src.new/embed/embed-title.js"
import { Embed } from "../src.new/embed/embed.js"

export function Counter() {
  const [count, setCount] = React.useState(0)
  const [embedVisible, setEmbedVisible] = React.useState(false)

  return (
    <>
      this button was clicked {count} times
      {embedVisible && (
        <Embed>
          <EmbedTitle>the counter</EmbedTitle>
          {count > 0 && (
            <EmbedField name="is it even?">
              {count % 2 === 0 ? "yes" : "no"}
            </EmbedField>
          )}
        </Embed>
      )}
      {embedVisible && (
        <Button label="hide embed" onClick={() => setEmbedVisible(false)} />
      )}
      <Button
        style="primary"
        label="clicc"
        onClick={() => setCount(count + 1)}
      />
      {!embedVisible && (
        <Button label="show embed" onClick={() => setEmbedVisible(true)} />
      )}
    </>
  )
}
