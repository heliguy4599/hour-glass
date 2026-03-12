import { type Component, For } from "solid-js"
import { type JSX } from "solid-js"

type Props = {
	onKeyPress?: (key: string)=> void,
}

const style: JSX.CSSProperties = {
	display: "grid",
	"grid-template-columns": "80px 80px 80px",
}

const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "<"]

export const Keypad: Component<Props> = (props) => <div class="keypad" style={style}>
	<For each={keys}>{
		(key) => <button onClick={() => props.onKeyPress?.(key)}>
			{key}
		</button>
	}</For>
</div>
