-- Compiled with roblox-ts v1.3.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local _rodux_effects = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "rodux-effects")
local dispatch = _rodux_effects.dispatch
local getState = _rodux_effects.getState
local waitForStore = _rodux_effects.waitForStore
local actionEffect = _rodux_effects.actionEffect
local stateEffect = _rodux_effects.stateEffect
local _alarm = TS.import(script, game:GetService("ServerScriptService"), "Server", "actions", "alarm")
local clockTick = _alarm.clockTick
local setAlarm = _alarm.setAlarm
local _alarm_1 = TS.import(script, game:GetService("ServerScriptService"), "Server", "selectors", "alarm")
local selectAlarmTime = _alarm_1.selectAlarmTime
local selectClock = _alarm_1.selectClock
local tickTock = false
actionEffect("SET_ALARM", function(_param)
	local alarm = _param.alarm
	local hours = math.floor(alarm / 3600)
	local minutes = math.floor((alarm - hours * 3600) / 60)
	local seconds = alarm % 60
	print("Alarm is being set to " .. (tostring(hours) .. (":" .. (tostring(minutes) .. (":" .. tostring(seconds))))))
end)
stateEffect(selectClock, function(clock)
	tickTock = not tickTock
	print((if tickTock then "Tick" else "Tock") .. (" · " .. tostring(clock)))
	task.delay(1, function()
		dispatch(clockTick())
	end)
end)
stateEffect(selectClock, function(clock)
	local alarm = getState(selectAlarmTime)
	local timePassed = clock - alarm
	if timePassed >= 0 and timePassed < 3 then
		print("Alarm!")
	end
end)
local _exp = waitForStore()
local _arg0 = function()
	dispatch(setAlarm(5))
end
_exp:andThen(_arg0)
