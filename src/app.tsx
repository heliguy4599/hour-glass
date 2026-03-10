import { createEffect, type JSX } from "solid-js"
import { ezSignal, debounce } from "./helpers"
import { formatters, type FormatConfig } from "./formatters"
import { Parser } from "./temporax/parser"
import { createStore } from "solid-js/store"

export const App = (): JSX.Element => {
	const parser = ezSignal(new Parser())
	const result = ezSignal("")
	const text = ezSignal("")

	const [config, setConfig] = createStore<FormatConfig>({
		time_hr: "12",
	})

	const show_result = debounce(200, (text: string, local_config: FormatConfig) => {
		text = text.trim()
		if (!text) {
			result.$val = ""
			return
		}
		try {
			const token = parser.$val.evaluate(text)
			result.$val = formatters[token.kind](token, local_config)
		} catch (e) {
			result.$val = e instanceof Error ? e.message : String(e)
		}
	})

	createEffect(() => {
		config.time_hr // trigger a re-run
		show_result(text.$val, config)
	})

	return <div>
		<h3>{result.$val}</h3>
		<input value={text.$val} onInput={(e) => text.$val = e.currentTarget.value} />
		{/* <label for="duration_format">Choose Duration Format:</label>
		<select id="duration_format">
			<option value="diminish">Diminishing</option>
			<option value="largest">Multiples of Largest</option>
			<option value="millis">Raw Milliseconds</option>
		</select> */}
		<label for="time_format">Choose Time Format</label>
		<select
			id="duration_format"
			value={config.time_hr}
			onChange={(e) => setConfig("time_hr", e.currentTarget.value as "12" | "24")}
		>
			<option value="12">12 Hour</option>
			<option value="24">24 Hour</option>
		</select>
	</div>
}
