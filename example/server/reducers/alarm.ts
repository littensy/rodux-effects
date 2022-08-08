import { AlarmAction } from "server/actions/alarm";

export interface AlarmState {
	clock: number;
	alarm: number;
}

const initialState: AlarmState = {
	clock: 0,
	alarm: 6 * 60 * 60,
};

export default function alarmReducer(state = initialState, action: AlarmAction): AlarmState {
	switch (action.type) {
		case "SET_CLOCK":
			return {
				...state,
				clock: action.clock,
			};
		case "SET_ALARM":
			return {
				...state,
				alarm: action.alarm,
			};
		case "CLOCK_TICK":
			return {
				...state,
				clock: (state.clock + 1) % (12 * 60 * 60),
			};
		default:
			return state;
	}
}
