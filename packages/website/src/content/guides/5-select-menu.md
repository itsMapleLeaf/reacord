---
title: Select Menus
description: Using select menu components
slug: select-menus
---

# Select Menus

To create a select menu, use the `Select` component, and pass a list of `Option` components as children. Use the `value` prop to set a currently selected value. You can respond to changes in the value via `onChangeValue`.

```tsx
import { Button, Option, Select } from "reacord"
import { useState } from "react"

interface FruitSelectProps {
	onConfirm: (choice: string) => void
}

export function FruitSelect({ onConfirm }: FruitSelectProps) {
	const [value, setValue] = useState<string>()

	return (
		<>
			<Select
				placeholder="choose a fruit"
				value={value}
				onChangeValue={setValue}
			>
				<Option value="🍎" />
				<Option value="🍌" />
				<Option value="🍒" />
			</Select>
			<Button
				label="confirm"
				disabled={value == undefined}
				onClick={() => {
					if (value) onConfirm(value)
				}}
			/>
		</>
	)
}
```

```tsx
const instance = reacord.createChannelMessage(channel).render(
	<FruitSelect
		onConfirm={(value) => {
			instance.render(`you chose ${value}`)
			instance.deactivate()
		}}
	/>,
)
```

For a multi-select, use the `multiple` prop, then you can use `values` and `onChangeMultiple` to handle multiple values.

```tsx
interface FruitSelectProps {
	onConfirm: (choices: string[]) => void
}

export function FruitSelect({ onConfirm }: FruitSelectProps) {
	const [values, setValues] = useState<string[]>([])

	return (
		<Select
			placeholder="choose a fruit"
			values={values}
			onChangeMultiple={setValues}
		>
			<Option value="🍎" />
			<Option value="🍌" />
			<Option value="🍒" />
		</Select>
	)
}
```

The Select component accepts a variety of props beyond what's shown here. See the [API reference](/api/index.html#SelectChangeEvent) for more information.
