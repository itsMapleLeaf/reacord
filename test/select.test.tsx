import React, { useState } from "react"
import { Button, Option, Select } from "../library/main"
import { setupReacordTesting } from "./setup-testing"

const { adapter, reply, assertMessages } = setupReacordTesting()

test("single select", async () => {
  function TestSelect() {
    const [value, setValue] = useState<string>()
    const [disabled, setDisabled] = useState(false)
    return (
      <>
        <Select
          placeholder="choose one"
          value={value}
          onSelectValue={setValue}
          disabled={disabled}
        >
          <Option value="1">one</Option>
          <Option value="2">two</Option>
          <Option value="3">three</Option>
        </Select>
        <Button label="disable" onClick={() => setDisabled(true)} />
      </>
    )
  }

  reply.render(<TestSelect />)

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "choose one",
            values: [],
            disabled: false,
            options: [
              { label: "one", value: "1" },
              { label: "two", value: "2" },
              { label: "three", value: "3" },
            ],
          },
        ],
        [{ type: "button", style: "secondary", label: "disable" }],
      ],
    },
  ])

  adapter.findSelectByPlaceholder("choose one").select("2")

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "choose one",
            values: ["2"],
            disabled: false,
            options: [
              { label: "one", value: "1" },
              { label: "two", value: "2" },
              { label: "three", value: "3" },
            ],
          },
        ],
        [{ type: "button", style: "secondary", label: "disable" }],
      ],
    },
  ])

  adapter.findButtonByLabel("disable").click()

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "choose one",
            values: ["2"],
            disabled: true,
            options: [
              { label: "one", value: "1" },
              { label: "two", value: "2" },
              { label: "three", value: "3" },
            ],
          },
        ],
        [{ type: "button", style: "secondary", label: "disable" }],
      ],
    },
  ])

  adapter.findSelectByPlaceholder("choose one").select("1")

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "choose one",
            values: ["2"],
            disabled: true,
            options: [
              { label: "one", value: "1" },
              { label: "two", value: "2" },
              { label: "three", value: "3" },
            ],
          },
        ],
        [{ type: "button", style: "secondary", label: "disable" }],
      ],
    },
  ])
})

test("multiple select", async () => {
  function TestSelect() {
    const [values, setValues] = useState<string[]>([])
    return (
      <Select
        placeholder="select"
        multiple
        values={values}
        onSelectMultiple={setValues}
      >
        <Option value="1">one</Option>
        <Option value="2">two</Option>
        <Option value="3">three</Option>
      </Select>
    )
  }

  reply.render(<TestSelect />)

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "select",
            values: [],
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

  adapter.findSelectByPlaceholder("select").select("1", "3")

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "select",
            values: expect.arrayContaining(["1", "3"]),
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

  adapter.findSelectByPlaceholder("select").select("2")

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "select",
            values: ["2"],
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

  adapter.findSelectByPlaceholder("select").select()

  await assertMessages([
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "select",
            placeholder: "select",
            values: [],
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
})

test.todo("select minValues and maxValues")
