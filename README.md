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
import rootReducer from "reducers";

const store = new Rodux.Store(rootReducer, undefined, [effectMiddleware]);

bind(store);
```

## 📚 Usage

See the [example](https://github.com/littensy/rodux-effects/tree/master/example) for detailed usage.

Running a side effect for a selector update is straightforward:

```ts
import { onUpdate } from "@rbxts/rodux-effects";
import { selectCounter } from "reducers/counter";

onUpdate(selectCounter, (counter, prevCounter) => {
	print(`Counter changed to ${counter} (${counter - prevCounter})`);
});
```

You can also run an effect for a specific action dispatch:

```ts
import { onDispatch } from "@rbxts/rodux-effects";
import { RootAction } from "reducers";

onDispatch<RootAction>("CLEAR", () => {
	print("Counter cleared");
});

// The second generic is a shortcut for extracting the type of the action.

onDispatch<RootAction, "INCREMENT">("INCREMENT", (action) => {
	print(`Incremented by ${action.amount}`);
});
```

More complex interactions with the store are also possible.

```ts
import { dispatch, getState, onUpdate } from "@rbxts/rodux-effects";
import { setPlayers, selectPlayers } from "reducers/players";
import { selectRoundStatus } from "reducers/round";

function onRoundStart() {
	const players = game.GetService("Players").GetPlayers();
	
	for (const player of players) {
		task.defer(() => player.LoadCharacter());
	}
	
	dispatch(setPlayers(players));
}

function onRoundEnd() {
	const playersLeft = getState(selectPlayers);
	
	for (const player of playersLeft) {
		print(`Player ${player.name} wins!`);
		
		task.defer(() => player.LoadCharacter());
	}
	
	dispatch(setPlayers([]));
}

onUpdate(selectRoundStatus, (roundStatus) => {
	if (roundStatus === "started") {
		onRoundStart();
	} else if (roundStatus === "ended") {
		onRoundEnd();
	}
});
```

```ts
import { dispatch, getState, waitForUpdate } from "@rbxts/rodux-effects";
import { makeSelectPlayerData } from "reducers/player-data";

function getPlayerData(player: Player) {
	const selectPlayerData = makeSelectPlayerData(player.UserId);
	const playerData = getState(selectPlayerData);
	return playerData ? Promise.resolve(playerData) : waitForUpdate(selectPlayerData);
}
```

