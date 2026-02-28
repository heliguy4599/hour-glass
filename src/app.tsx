import { type JSX } from "solid-js"
import { Component, Debounce } from "./classified"

export class App extends Component() {
	@Debounce(200)
	stuff(text: string): void {
		console.log(text)
	}

	template(): JSX.Element {
		return <div class="box">
			<input
				onInput={(e) => this.stuff(e.currentTarget.value)}
			></input>
		</div >
	}
}
