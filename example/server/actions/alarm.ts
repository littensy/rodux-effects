export function setClock(clock: number) {
	return {
		type: "SET_CLOCK",
		clock,
	} as const;
}

export function setAlarm(alarm: number) {
	return {
		type: "SET_ALARM",
		alarm,
	} as const;
}

export function clockTick() {
	return {
		type: "CLOCK_TICK",
	} as const;
}

export type AlarmAction = ReturnType<typeof setClock> | ReturnType<typeof setAlarm> | ReturnType<typeof clockTick>;
