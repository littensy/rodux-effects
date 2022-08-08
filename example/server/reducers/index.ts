import Rodux from "@rbxts/rodux";
import { AlarmAction } from "server/actions/alarm";
import alarmReducer, { AlarmState } from "./alarm";

export interface RootState {
	alarm: AlarmState;
}

export type RootAction = AlarmAction;

const rootReducer = Rodux.combineReducers({
	alarm: alarmReducer,
});

export default rootReducer;
