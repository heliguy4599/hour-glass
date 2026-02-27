import { type JSX } from "solid-js"
// import solidLogo from "./assets/solid.svg"
// import viteLogo from "/vite.svg"
import { Component, Signal } from "./classified"

export const App = (): JSX.Element => <div
	class="box"
>
	<input alpha={false}></input>
	<Counter.new count={5} />
</div>

class Counter extends Component<{ count: number }>() {
	@Signal count: number = 0

	template(): JSX.Element {
		this.count = this._props.count
		return <div>
			<button onClick={() => this.count += 1}>+ Inc</button>
			<div>Count: {this.count}</div>
			<button onClick={() => this.count -= 1}>- Dec</button>
		</div>
	}
}
