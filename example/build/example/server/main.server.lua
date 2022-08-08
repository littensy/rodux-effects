-- Compiled with roblox-ts v1.3.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local Rodux = TS.import(script, TS.getModule(script, "@rbxts", "rodux").src)
local _rodux_effects = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "rodux-effects")
local bind = _rodux_effects.bind
local effectMiddleware = _rodux_effects.effectMiddleware
local rootReducer = TS.import(script, game:GetService("ServerScriptService"), "Server", "reducers").default
local store = Rodux.Store.new(rootReducer, nil, { effectMiddleware })
bind(store)
