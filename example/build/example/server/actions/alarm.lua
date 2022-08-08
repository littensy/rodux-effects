-- Compiled with roblox-ts v1.3.3
local function setClock(clock)
	return {
		type = "SET_CLOCK",
		clock = clock,
	}
end
local function setAlarm(alarm)
	return {
		type = "SET_ALARM",
		alarm = alarm,
	}
end
local function clockTick()
	return {
		type = "CLOCK_TICK",
	}
end
return {
	setClock = setClock,
	setAlarm = setAlarm,
	clockTick = clockTick,
}
