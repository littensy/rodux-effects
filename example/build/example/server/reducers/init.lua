-- Compiled with roblox-ts v1.3.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local Rodux = TS.import(script, TS.getModule(script, "@rbxts", "rodux").src)
local alarmReducer = TS.import(script, game:GetService("ServerScriptService"), "Server", "reducers", "alarm").default
local rootReducer = Rodux.combineReducers({
	alarm = alarmReducer,
})
local default = rootReducer
return {
	default = default,
}
