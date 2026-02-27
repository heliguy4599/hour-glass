import { createSignal, type JSX } from "solid-js"

type ComponentClass<P, C = abstract new ()=> {
	template(): JSX.Element,
	readonly _props: P,
}> = C & {
	readonly new: (props: P)=> JSX.Element,
}

export function Component<P extends Record<string, any>>(): ComponentClass<P> {
	abstract class Base {
		static get new(): (props: P)=> JSX.Element {
			function to_ret<T extends typeof Base>(
				this: new ()=> InstanceType<T>,
				props: P,
			): JSX.Element {
				const instance = new this()
				; (instance._props as any) = props
				return instance.template()
			}
			// @ts-expect-error
			return to_ret.bind(this)
		}

		abstract template(): JSX.Element
		readonly _props!: P
	}
	return Base
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
