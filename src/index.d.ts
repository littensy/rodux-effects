import type Rodux from "@rbxts/rodux";

export type ExtractAction<T extends Rodux.Action, U extends T["type"]> = Extract<T, { type: U }>;

/**
 * Binds this library to the given Rodux store. Should be called once on the
 * client or server.
 * @param store The store to bind rodux-effects to.
 */
export declare function bind(store: Rodux.Store<any>): void;

/**
 * A middleware that runs callbacks bound to actions using `actionEffect()`.
 * Optional if you do not use action effects.
 */
export declare const effectMiddleware: Rodux.Middleware;

/**
 * Returns a Promise that resolves when the store is ready to use.
 */
export declare function waitForStore<T extends Rodux.Store<any>>(): Promise<T>;

/**
 * Returns the current state of the store. Takes an optional selector function.
 * Must be called after `bind()`, in an effect, or with `waitForStore()`.
 * @param selector Optional selector to pass the state through.
 * @returns The current state of the store.
 */
export declare function getState<T, U = T>(selector?: (state: T) => U): U;

/**
 * Dispatches an action to the store.
 * Must be called after `bind()`, in an effect, or with `waitForStore()`.
 * @param action The action to dispatch.
 * @returns The action that was dispatched.
 */
export declare function dispatch<T extends Rodux.Action>(action: T): T;

/**
 * Destructs the store.
 * Must be called after `bind()`, in an effect, or with `waitForStore()`.
 */
export declare function destruct(): void;

/**
 * Creates an effect that is run whenever the given action is dispatched.
 * Returns a cleanup function that removes the effect or cancels its creation.
 *
 * Effects will be deferred on new threads.
 *
 * @example
 * ```ts
 * import { actionEffect } from "@rbxts/rodux-effects";
 * import { RootAction } from "./reducer";
 *
 * actionEffect<RootAction, "INCREMENT">("INCREMENT", (action) => {
 * 	print(`Incrementing by ${action.payload}`);
 * });
 * ```
 *
 * @param type The type of the action to listen for.
 * @param callback Called when the action is dispatched.
 * @returns A cleanup function.
 */
export declare function actionEffect<T extends Rodux.Action, U extends T["type"] = T["type"]>(
	type: U,
	callback: (action: ExtractAction<T, U>) => void,
): () => void;

/**
 * Creates an effect that is run whenever the value returned by the selector
 * changes. Returns a cleanup function that removes the effect or cancels its
 * creation.
 *
 * Unlike `actionEffect()`, the callback will run once the effect is mounted
 * and the store is loaded. Effects will be deferred on new threads.
 *
 * @example
 * ```ts
 * import { stateEffect } from "@rbxts/rodux-effects";
 * import { selectCounter } from "./selectors/counter";
 *
 * stateEffect(selectCounter, (counter, prevCounter) => {
 * 	if (prevCounter === undefined) {
 * 		print(`Counter started at ${counter}`);
 * 	} else {
 * 		const sign = math.sign(counter - prevCounter) === -1 ? "-" : "+";
 * 		const diff = math.abs(counter - prevCounter);
 * 		print(`Counter changed to ${counter} (${sign}${diff})`);
 * 	}
 * });
 * ```
 *
 * @param selector A selector function that returns the value to watch.
 * @param callback Called when the value changes and once on creation.
 * @returns A cleanup function.
 */
export declare function stateEffect<T, U>(
	selector: (state: T) => U,
	callback: (selectedState: U, lastSelectedState?: U) => void,
): () => void;
