import { createReducer } from "@rbxts/rodux";

export interface AlarmState {
	clock: number;
	alarm: number;
}

// Actions

export function setClock(clock: number) {
	return { type: "SET_CLOCK", clock } as const;
}

export function setAlarm(alarm: number) {
	return { type: "SET_ALARM", alarm } as const;
}

export function incrementClock() {
	return { type: "INCREMENT_CLOCK" } as const;
}

export type AlarmAction = ReturnType<typeof setClock | typeof setAlarm | typeof incrementClock>;

// Reducer

export const alarmReducer = createReducer<AlarmState, AlarmAction>(
	{ clock: 0, alarm: 6 * 3600 },
	{
		SET_CLOCK: (state, { clock }) => ({ ...state, clock }),

		SET_ALARM: (state, { alarm }) => ({ ...state, alarm }),

		INCREMENT_CLOCK: (state) => ({ ...state, clock: (state.clock + 1) % (12 * 60 * 60) }),
	},
);

// Selectors

type State = { alarm: AlarmState };

export const selectClock = (state: State) => state.alarm.clock;
export const selectAlarmTime = (state: State) => state.alarm.alarm;
export const selectClockMinutes = (state: State) => math.floor(state.alarm.clock / 60);
export const selectClockHours = (state: State) => math.floor(state.alarm.clock / (60 * 60));
