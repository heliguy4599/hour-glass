import { type JSX } from "solid-js"
// import solidLogo from "./assets/solid.svg"
// import viteLogo from "/vite.svg"
import { Component, Memo, Signal } from "./classified"

export const App = (): JSX.Element => <div
	class="box"
>
	<input alpha={false}></input>
	<Thing.new />
</div>

class Thing extends Component<{ start_at?: number }>() {
	@Signal count = 0

	@Memo get doubled(): number {
		return this.count * 2
	}

	template(): JSX.Element {
		if (this._props.start_at !== undefined) {
			this.count = this._props.start_at
		}
		return <div>
			<button>+ Inc</button>
			Count: {this.count}!
			Doubled: {this.doubled}!
			<button>- Dec</button>
		</div>
	}
}
