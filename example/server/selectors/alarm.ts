import { RootState } from "server/reducers";

export const selectClock = (state: RootState) => state.alarm.clock;
export const selectAlarmTime = (state: RootState) => state.alarm.alarm;
export const selectClockMinutes = (state: RootState) => math.floor(state.alarm.clock / 60);
export const selectClockHours = (state: RootState) => math.floor(state.alarm.clock / (60 * 60));
