import { dispatch, getState, waitForStore, actionEffect, stateEffect } from "@rbxts/rodux-effects";
import { clockTick, setAlarm } from "server/actions/alarm";
import { RootAction } from "server/reducers";
import { selectAlarmTime, selectClock } from "server/selectors/alarm";

let tickTock = false;

// Prints the alarm time when the SET_ALARM action is dispatched.
actionEffect<RootAction, "SET_ALARM">("SET_ALARM", ({ alarm }) => {
	const hours = math.floor(alarm / 3600);
	const minutes = math.floor((alarm - hours * 3600) / 60);
	const seconds = alarm % 60;

	print(`Alarm is being set to ${hours}:${minutes}:${seconds}`);
});

// Prints "Tick" or "Tock" every second and schedules the next tick.
stateEffect(selectClock, (clock) => {
	tickTock = !tickTock;
	print(`${tickTock ? "Tick" : "Tock"} · ${clock}`);

	task.delay(1, () => {
		dispatch(clockTick());
	});
});

// Sounds an alarm for three seconds when the alarm time is reached.
stateEffect(selectClock, (clock) => {
	const alarm = getState(selectAlarmTime);
	const timePassed = clock - alarm;

	if (timePassed >= 0 && timePassed < 3) {
		print("Alarm!");
	}
});

// Sets the alarm to go off in five seconds.
waitForStore().then(() => {
	dispatch(setAlarm(5));
});
