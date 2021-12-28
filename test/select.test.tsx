import { jest } from "@jest/globals"
import React, { useState } from "react"
import { Button, Option, ReacordTester, Select } from "../library/main"

test("single select", async () => {
  const tester = new ReacordTester()
  const onSelect = jest.fn()

  function TestSelect() {
    const [value, setValue] = useState<string>()
    const [disabled, setDisabled] = useState(false)
    return (
      <>
        <Select
          placeholder="choose one"
          value={value}
          onSelect={onSelect}
          onSelectValue={setValue}
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
    await tester.assertMessages([
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
    ])
  }

  const reply = tester.reply()

  reply.render(<TestSelect />)
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledTimes(0)

  tester.findSelectByPlaceholder("choose one").select("2")
  await assertSelect(["2"])
  expect(onSelect).toHaveBeenCalledWith({ values: ["2"] })

  tester.findButtonByLabel("disable").click()
  await assertSelect(["2"], true)

  tester.findSelectByPlaceholder("choose one").select("1")
  await assertSelect(["2"], true)
  expect(onSelect).toHaveBeenCalledTimes(1)
})

test("multiple select", async () => {
  const tester = new ReacordTester()
  const onSelect = jest.fn()

  function TestSelect() {
    const [values, setValues] = useState<string[]>([])
    return (
      <Select
        placeholder="select"
        multiple
        values={values}
        onSelect={onSelect}
        onSelectMultiple={setValues}
      >
        <Option value="1">one</Option>
        <Option value="2">two</Option>
        <Option value="3">three</Option>
      </Select>
    )
  }

  async function assertSelect(values: string[]) {
    await tester.assertMessages([
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
    ])
  }

  const reply = tester.reply()

  reply.render(<TestSelect />)
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledTimes(0)

  tester.findSelectByPlaceholder("select").select("1", "3")
  await assertSelect(expect.arrayContaining(["1", "3"]))
  expect(onSelect).toHaveBeenCalledWith({
    values: expect.arrayContaining(["1", "3"]),
  })

  tester.findSelectByPlaceholder("select").select("2")
  await assertSelect(expect.arrayContaining(["2"]))
  expect(onSelect).toHaveBeenCalledWith({
    values: expect.arrayContaining(["2"]),
  })

  tester.findSelectByPlaceholder("select").select()
  await assertSelect([])
  expect(onSelect).toHaveBeenCalledWith({ values: [] })
})

test("optional onSelect + unknown value", async () => {
  const tester = new ReacordTester()
  tester.reply().render(<Select placeholder="select" />)
  tester.findSelectByPlaceholder("select").select("something")
  await tester.assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [{ type: "select", placeholder: "select", options: [], values: [] }],
      ],
    },
  ])
})

test.todo("select minValues and maxValues")
