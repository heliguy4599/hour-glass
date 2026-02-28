import { type JSX } from "solid-js"
import { Component, Effect, Memo, Signal } from "./classified"

export class App extends Component() {
	template(): JSX.Element {
		return <div class="box">
			<input alpha={false}></input>
			<Thing.new start_at={10} />
		</div >
	}
}

class Thing extends Component<{ start_at?: number }>() {
	@Signal count = 0

	@Effect loggy(): void {
		console.log("Count is now", this.count)
	}

	@Memo get combined(): number {
		return this.doubled + this.count
	}

	@Memo get doubled(): number {
		return this.count * 2
	}

	template(): JSX.Element {
		if (this._props.start_at !== undefined) {
			this.count = this._props.start_at
		}
		return <div>
			Count: {this.count}<br />
			Dobule: {this.doubled}<br />
			Combined: {this.combined}<br />
			<button onClick={() => this.count += 1}>+ Inc</button>
			<button onClick={() => this.count -= 1}>- Dec</button>
		</div>
	}
}
