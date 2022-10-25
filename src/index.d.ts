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
 * Returns the store that was bound to this library.
 */
export declare function getStore<T extends Rodux.Store<any>>(): T | undefined;

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
 * Invokes callback when an action of the given type is dispatched.
 * Returns a cleanup function that disconnects it or cancels its creation.
 *
 * @example
 * ```ts
 * import { onDispatch } from "@rbxts/rodux-effects";
 * import { RootAction } from "./reducer";
 *
 * onDispatch<RootAction, "INCREMENT">("INCREMENT", (action) => {
 * 	print(`Incrementing by ${action.payload}`);
 * });
 * ```
 *
 * @param type The type of the action to listen for.
 * @param callback Called when the action is dispatched.
 * @returns A cleanup function.
 */
export declare function onDispatch<T extends Rodux.Action, U extends T["type"]>(
	type: U,
	callback: (action: ExtractAction<T, U>) => void,
): () => void;

/**
 * Invokes callback when an action of the given type is dispatched, then
 * disconnects it.
 *
 * @example
 * ```ts
 * import { onDispatchOnce } from "@rbxts/rodux-effects";
 * import { RootAction } from "./reducer";
 *
 * onDispatchOnce<RootAction, "INCREMENT">("INCREMENT", (action) => {
 * 	print(`Incrementing by ${action.payload}`);
 * });
 * ```
 *
 * @param type The type of the action to listen for.
 * @param callback Called when the action is dispatched.
 * @returns A cleanup function.
 * @see onDispatch
 */
export declare function onDispatchOnce<T extends Rodux.Action, U extends T["type"]>(
	type: U,
	callback: (action: ExtractAction<T, U>) => void,
): () => void;

/**
 * Returns a Promise that resolves when an action of the given type is
 * dispatched.
 *
 * @example
 * ```ts
 * import { waitForDispatch } from "@rbxts/rodux-effects";
 * import { RootAction } from "./reducer";
 *
 * async function doSomething() {
 * 	const action = await waitForDispatch<RootAction, "INCREMENT">("INCREMENT");
 * 	print(`Incrementing by ${action.payload}`);
 * }
 * ```
 *
 * @param type The type of the action to wait for.
 * @returns A Promise that resolves with the action.
 */
export declare function waitForDispatch<T extends Rodux.Action, U extends T["type"]>(
	type: U,
): Promise<ExtractAction<T, U>>;

/**
 * Fires when the value returned by the selector changes on a store update.
 * Returns a cleanup function that disconnects it or cancels its creation.
 *
 * If `isImmediate` is true, the callback will run on a new thread after the
 * store has been loaded. Defaults to false.
 *
 * @example
 * ```ts
 * import { onUpdate } from "@rbxts/rodux-effects";
 * import { selectCounter } from "./reducer";
 *
 * onUpdate(selectCounter, (counter, prevCounter) => {
 * 	const sign = math.sign(counter - prevCounter) === -1 ? "-" : "+";
 * 	const diff = math.abs(counter - prevCounter);
 * 	print(`Counter changed to ${counter} (${sign}${diff})`);
 * });
 * ```
 *
 * @param selector A selector function that returns the value to watch.
 * @param callback Called when the selector returns a new value.
 * @param isImmediate Whether to run the callback immediately after creation. Defaults to false.
 * @returns A cleanup function.
 */
export declare function onUpdate<T, U>(
	selector: (state: T) => U,
	callback: (selectedState: U, lastSelectedState: U) => void,
	isImmediate?: boolean,
): () => void;

// onUpdateImmediate

/**
 * Fires immediately on subscription and when the value returned by the
 * selector changes on a store update. Returns a cleanup function that
 * disconnects it or cancels its creation.
 *
 * Alias for `onUpdate(selector, callback, true)`.
 *
 * @example
 * ```ts
 * import { onUpdateImmediate } from "@rbxts/rodux-effects";
 * import { selectCounter } from "./reducer";
 *
 * onUpdateImmediate(selectCounter, (counter, prevCounter) => {
 * 	const sign = math.sign(counter - prevCounter) === -1 ? "-" : "+";
 * 	const diff = math.abs(counter - prevCounter);
 * 	print(`Counter changed to ${counter} (${sign}${diff})`);
 * });
 * ```
 *
 * @param selector A selector function that returns the value to watch.
 * @param callback Called when the selector returns a new value.
 * @returns A cleanup function.
 */
export declare function onUpdateImmediate<T, U>(
	selector: (state: T) => U,
	callback: (selectedState: U, lastSelectedState: U) => void,
): () => void;

/**
 * Fires when the value returned by the selector changes on a store update,
 * then disconnects it. Returns a cleanup function that disconnects it or
 * cancels its creation.
 *
 * @example
 * ```ts
 * import { onUpdateOnce } from "@rbxts/rodux-effects";
 * import { selectCounter } from "./reducer";
 *
 * onUpdateOnce(selectCounter, (counter, prevCounter) => {
 * 	const sign = math.sign(counter - prevCounter) === -1 ? "-" : "+";
 * 	const diff = math.abs(counter - prevCounter);
 * 	print(`Counter changed to ${counter} (${sign}${diff})`);
 * });
 *
 * @param selector A selector function that returns the value to watch.
 * @param callback Called when the selector returns a new value.
 */
export declare function onUpdateOnce<T, U>(
	selector: (state: T) => U,
	callback: (selectedState: U, lastSelectedState: U) => void,
): () => void;

/**
 * Returns a Promise that resolves when the value returned by the selector
 * changes on a store update.
 *
 * @example
 * ```ts
 * import { waitForUpdate } from "@rbxts/rodux-effects";
 * import { selectCounter } from "./reducer";
 *
 * async function doSomething() {
 * 	const counter = await waitForUpdate(selectCounter);
 * 	print(`Counter changed to ${counter}`);
 * }
 * ```
 *
 * @param selector A selector function that returns the value to watch.
 * @returns A Promise that resolves with the new value.
 */
export declare function waitForUpdate<T, U>(selector: (state: T) => U): Promise<U>;
