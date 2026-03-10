import { createSignal, on, type SignalOptions } from "solid-js"

type EzSignalObj<T> = {
	get $val(): T,
	set $val(v: T | ((prev: T)=> T)),
	get(): T,
	set(v: T | ((prev: T)=> T)): void,
}

export const ezSignal = <T>(initial: T, options?: SignalOptions<T>): EzSignalObj<T> => {
	const [get, set] = createSignal(initial, options)
	return {
		get $val(): T {
			return get()
		},
		set $val(v: T | ((prev: T)=> T)) {
			set(v as any)
		},
		get,
		set,
	}
}

export const debounce = <F extends (...args: any[])=> void>(delay = 200, fn: F): F => {
	let timeout: ReturnType<typeof setTimeout> | undefined
	const debounce = (...args: Parameters<F>): void => {
		if (timeout !== undefined) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => fn(...args), delay)
	}
	return debounce as F
}

export const attempt = <T, E = undefined>(
	to_try: ()=> T,
	on_err?: (e: unknown)=> E,
): E extends undefined ? T | undefined : T | E => {
	try {
		return to_try() as any
	} catch (e) {
		return on_err?.(e) as any
	}
}
