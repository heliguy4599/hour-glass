import { createSignal } from "solid-js"

export function create_prop<T>(starting: T): { value: T } {
	const [get, set] = createSignal(starting)
	return {
		get value(): T { return get() },
		set value(v: T) { set(() => v) },
	}
}
