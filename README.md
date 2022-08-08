# ✨ rodux-effects

An experimental side-effect library for Rodux. It allows running side effects when a selector updates or an action dispatches.

Rodux-effects is designed to simplify interactions within game state where UI is not applicable, like the server.

## 🔌 Installation and Setup

You need to first install [Rodux](https://www.npmjs.com/package/@rbxts/rodux) and add the rodux-effects package:

```bash
npm install @rbxts/rodux-effects

yarn add @rbxts/rodux-effects

pnpm add @rbxts/rodux-effects
```

If your game's state falls under one Rodux store, you can use `bind(store)` to load it into rodux-effects.

The `effectMiddleware` value is optional, but it's required to use side effects with actions.

```ts
import Rodux from "@rbxts/rodux";
import { bind, effectMiddleware } from "@rbxts/rodux-effects";
import rootReducer from "./reducer";

const store = new Rodux.Store(rootReducer, undefined, [effectMiddleware]);

bind(store);
```

## 📚 Usage

See the [example](https://github.com/littensy/rodux-effects/tree/master/example) for detailed usage.

Running a side effect for a selector update is straightforward:

```ts
// main.server.ts
import { stateEffect } from "@rbxts/rodux-effects";
import { selectCounter } from "./selectors/counter";

stateEffect(selectCounter, (counter, prevCounter) => {
	if (prevCounter === undefined) {
		print(`Counter started at ${counter}`);
	} else {
		const sign = math.sign(counter - prevCounter) === -1 ? "-" : "+";
		const diff = math.abs(counter - prevCounter);
		print(`Counter changed to ${counter} (${sign}${diff})`);
	}
});
```

You can also run an effect for a specific action dispatch, though the types need improvement.

```ts
// main.server.ts
import { actionEffect } from "@rbxts/rodux-effects";
import { RootAction } from "./reducer";

actionEffect<RootAction>("CLEAR", () => {
	print("Counter cleared");
});

// The second generic is a shortcut for extracting the type of the action.

actionEffect<RootAction, "INCREMENT">("INCREMENT", (action) => {
	print(`Incremented by ${action.payload}`);
});
```

More complex interactions with the store are also possible.

```ts
// main.server.ts
import { dispatch, getState, stateEffect } from "@rbxts/rodux-effects";
import { setPlayers } from "../actions/players";
import { selectRoundStatus } from "../selectors/round";
import { selectPlayers } from "../selectors/players";
import { spawnPlayers, killPlayers } from "./player-service";

function onRoundStart() {
	const players = spawnPlayers();
	dispatch(setPlayers(players));
}

function onRoundEnd() {
	const playersLeft = getState(selectPlayers);
	for (const player of playersLeft) {
		print(`Player ${player.name} wins!`);
	}
	dispatch(setPlayers([]));
}

stateEffect(selectRoundStatus, (roundStatus) => {
	if (roundStatus === "started") {
		onRoundStart();
	} else if (roundStatus === "ended") {
		onRoundEnd();
	}
});
```
