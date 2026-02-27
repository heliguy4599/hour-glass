import { createEffect, createMemo, createRenderEffect, createSignal, onCleanup, onMount, type JSX } from "solid-js"

type Props = Record<string, any>

type PublifyConstructor<T, Args extends any[] = []> = (T extends { prototype: infer P }
	? new (...args: Args)=> P
	: never
)

// eslint-disable-next-line
export function Component<P extends Props>() {
	abstract class BaseComponent {
		static get new(): (props: P)=> JSX.Element {
			function to_ret<T extends PublifyConstructor<typeof BaseComponent, [P]>>(this: T, props: P): JSX.Element {
				const instance = new this(props)
				onMount(() => instance.onMount?.())
				onCleanup(() => instance.onCleanup?.())
				return instance.template()
			}
			return to_ret.bind(this as any)
		}

		protected readonly _props: P

		protected constructor(props: P) {
			this._props = props
		}

		abstract template(): JSX.Element
		onMount(): void {}
		onCleanup(): void {}
	}
	return BaseComponent
}

export function Signal(_target: undefined, context: ClassFieldDecoratorContext): void {
	context.addInitializer(function () {
		const value = (this as any)[context.name]
		const [get, set] = createSignal(value)
		Object.defineProperty(this, context.name, {
			get,
			set,
			enumerable: true,
			configurable: true,
		})
	})
}

export function Memo(_target: unknown, context: ClassGetterDecoratorContext): void {
	context.addInitializer(function () {
		const getter = find_getter(this, context.name)
		const memo = createMemo(() => getter.call(this))
		Object.defineProperty(this, context.name, {
			get: memo,
			enumerable: true,
			configurable: true,
		})
	})
}

export function Effect(
	_target: unknown,
	context: ClassMethodDecoratorContext<unknown, ()=> any>,
): void {
	context.addInitializer(function () {
		const original = (this as any)[context.name]
		if (typeof original !== "function") return
		createEffect(() => original.call(this))
	})
}

export function RenderEffect(
	_target: unknown,
	context: ClassMethodDecoratorContext<unknown, ()=> any>,
): void {
	context.addInitializer(function () {
		const original = (this as any)[context.name]
		if (typeof original !== "function") return
		createRenderEffect(() => original.call(this))
	})
}

function find_getter(obj: any, key: string | symbol): ()=> any {
	while (obj) {
		const desc = Object.getOwnPropertyDescriptor(obj, key)
		if (typeof desc?.get === "function") return desc.get
		obj = Object.getPrototypeOf(obj)
	}
	throw new Error(`@Memo: getter not found for ${String(key)}`)
}
