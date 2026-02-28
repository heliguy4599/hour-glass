import {
	createEffect,
	createMemo,
	createRenderEffect,
	createSignal,
	onCleanup,
	onMount,
	type JSX,
} from "solid-js"

type Props = Record<string, any>

type PublifyConstructor<T, Args extends any[] = []> = (T extends { prototype: infer P }
	? new (...args: Args)=> P
	: never
)

const no_construct = Symbol("no_construct")

const REGISTER = Symbol("REGISTER_WTIH")

type RegistrableFunction = ((...args: any[])=> any) & {
	[REGISTER]: (instance: object)=> ((...args: any[])=> any) | void,
}
const is_registrable_function = (fn: Function): fn is RegistrableFunction => (fn as any)[REGISTER] !== undefined

// eslint-disable-next-line
export function Component<P extends Props>() {
	abstract class BaseComponent {
		static get new(): (props: P)=> JSX.Element {
			function to_ret<T extends PublifyConstructor<typeof BaseComponent, [P]>>(this: T, props: P): JSX.Element {
				const instance = new this(props)
				onMount(() => instance.onMount?.())
				onCleanup(() => instance.onCleanup?.())
				const proto = Object.getPrototypeOf(instance)
				for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(proto))) {
					if (typeof desc.value === "function" && is_registrable_function(desc.value)) {
						const value = (desc.value as RegistrableFunction)[REGISTER](instance)
						if (value) {
							Object.defineProperty(instance, key, {
								value,
								enumerable: desc.enumerable,
								configurable: desc.configurable,
								writable: desc.writable,
							})
						}
					}
				}
				return instance.template()
			}
			return to_ret.bind(this as any)
		}

		protected readonly _props: P

		protected constructor(props: P & typeof no_construct) {
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

export function Effect(
	target: ()=> void,
	_context: ClassMethodDecoratorContext<unknown, ()=> any>,
): void {
	(target as RegistrableFunction)[REGISTER] = (instance: object): void => createEffect(
		() => target.call(instance),
	)
}

export function RenderEffect(
	target: ()=> void,
	_context: ClassMethodDecoratorContext<unknown, ()=> any>,
): void {
	(target as RegistrableFunction)[REGISTER] = (instance: object): void => createRenderEffect(
		() => target.call(instance),
	)
}

export function Memo(
	target: ()=> any,
	_context: ClassGetterDecoratorContext,
): void {
	(target as RegistrableFunction)[REGISTER] = (instance: object): (()=> any) => createMemo(
		() => target.call(instance),
	)
}
