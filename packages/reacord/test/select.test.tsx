import React, { useState } from "react"
import { expect, test, vi } from "vitest"
import { Button, Option, Select } from "../library/main"
import { ReacordTester } from "./test-adapter"
import { assertMessages } from "./utils"

test("single select", async () => {
  const tester = new ReacordTester()
  const onSelect = vi.fn()

  function TestSelect() {
    const [value, setValue] = useState<string>()
    const [disabled, setDisabled] = useState(false)
    return (
      <>
        <Select
          placeholder="choose one"
          value={value}
          onChange={onSelect}
          onChangeValue={setValue}
          disabled={disabled}
        >
          <Option value="1" />
          <Option value="2" label="two" />
          <Option value="3">three</Option>
        </Select>
        <Button label="disable" onClick={() => setDisabled(true)} />
      </>
    )
  }

  async function assertSelect(values: string[], disabled = false) {
    await assertMessages([
      {
        content: "",
        embeds: [],
        actionRows: [
          [
            {
              type: "select",
              placeholder: "choose one",
              values,
              disabled,
              options: [
                { label: "1", value: "1" },
                { label: "two", value: "2" },
                { label: "three", value: "3" },
              ],
            },
          ],
          [{ type: "button", style: "secondary", label: "disable" }],
        ],
      },
    ], tester.sampleMessages())
  }

  const reply = tester.reply()

  reply.render(<TestSelect />)
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledTimes(0)

  let sel = await tester.findSelectByPlaceholder("choose one")
  await sel!.select("2")
  await assertSelect(["2"])
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ values: ["2"] }),
  )

  let btn = await tester.findButtonByLabel("disable")
  await btn!.click()
  await assertSelect(["2"], true)

  sel = await tester.findSelectByPlaceholder("choose one")
  await sel!.select("1")
  await assertSelect(["2"], true)
  expect(onSelect).toHaveBeenCalledTimes(1)
})

test("multiple select", async () => {
  const tester = new ReacordTester()
  const onSelect = vi.fn()

  function TestSelect() {
    const [values, setValues] = useState<string[]>([])
    return (
      <Select
        placeholder="select"
        multiple
        values={values}
        onChange={onSelect}
        onChangeMultiple={setValues}
      >
        <Option value="1">one</Option>
        <Option value="2">two</Option>
        <Option value="3">three</Option>
      </Select>
    )
  }

  async function assertSelect(values: string[]) {
    await assertMessages([
      {
        content: "",
        embeds: [],
        actionRows: [
          [
            {
              type: "select",
              placeholder: "select",
              values,
              minValues: 0,
              maxValues: 25,
              options: [
                { label: "one", value: "1" },
                { label: "two", value: "2" },
                { label: "three", value: "3" },
              ],
            },
          ],
        ],
      },
    ], tester.sampleMessages())
  }

  const reply = tester.reply()

  reply.render(<TestSelect />)
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledTimes(0)

  let sel = await tester.findSelectByPlaceholder("select")
  await sel!.select("1", "3")
  await assertSelect(expect.arrayContaining(["1", "3"]) as unknown as string[])
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ values: expect.arrayContaining(["1", "3"]) }),
  )

  sel = await tester.findSelectByPlaceholder("select")
  await sel!.select("2")
  await assertSelect(expect.arrayContaining(["2"]) as unknown as string[])
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ values: expect.arrayContaining(["2"]) }),
  )

  sel = await tester.findSelectByPlaceholder("select")
  await sel!.select()
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ values: [] }))
})

test("optional onSelect + unknown value", async () => {
  const tester = new ReacordTester()
  tester.reply().render(<Select placeholder="select" />)
  let sel = await tester.findSelectByPlaceholder("select")
  await sel!.select("something")
  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [{ type: "select", placeholder: "select", options: [], values: [] }],
      ],
    },
  ], tester.sampleMessages())
})

test.todo("select minValues and maxValues")
