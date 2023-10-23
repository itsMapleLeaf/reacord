---
title: Select Menus
description: Using select menu components
slug: select-menus
---

# Select Menus

To create a select menu, use the `Select` component, and pass a list of `Option` components as children. Use the `value` prop to set a currently selected value. You can respond to changes in the value via `onChangeValue`.

```jsx
export function FruitSelect({ onConfirm }) {
	const [value, setValue] = useState()

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

```jsx
const instance = reacord.send(
	channelId,
	<FruitSelect
		onConfirm={(value) => {
			instance.render(`you chose ${value}`)
			instance.deactivate()
		}}
	/>,
)
```

For a multi-select, use the `multiple` prop, then you can use `values` and `onChangeMultiple` to handle multiple values.

```jsx
export function FruitSelect({ onConfirm }) {
	const [values, setValues] = useState([])

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
