-- Compiled with roblox-ts v1.3.3
local selectClock = function(state)
	return state.alarm.clock
end
local selectAlarmTime = function(state)
	return state.alarm.alarm
end
local selectClockMinutes = function(state)
	return math.floor(state.alarm.clock / 60)
end
local selectClockHours = function(state)
	return math.floor(state.alarm.clock / (60 * 60))
end
return {
	selectClock = selectClock,
	selectAlarmTime = selectAlarmTime,
	selectClockMinutes = selectClockMinutes,
	selectClockHours = selectClockHours,
}
