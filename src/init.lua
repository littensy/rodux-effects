local TS = _G[script]
local Promise = TS.Promise

local RunService = game:GetService("RunService")

local actionCallbacksByType = {}
local actionCallbackId = 0
local currentStore

local function assertStore()
	if not currentStore then
		error("@rbxts/rodux-effects: store is not initialized, did you call waitForStore() before using an effect?")
	end
end

local function bind(store)
	if currentStore ~= nil then
		warn("@rbxts/rodux-effects: store is already initialized, did you call bind() twice?")
	end
	currentStore = store
end

local function effectMiddleware(nextDispatch)
	return function(action)
		if type(action) ~= "table" then
			return nextDispatch(action)
		end

		local callbacks = actionCallbacksByType[action.type]
		if callbacks then
			for _, callback in ipairs(callbacks) do
				task.spawn(callback, action)
			end
		end

		return nextDispatch(action)
	end
end

local function getStore()
	return currentStore
end

local function waitForStore()
	if currentStore then
		return Promise.resolve(currentStore)
	end

	return Promise.new(function(resolve, _, onCancel)
		local handle
		handle = RunService.Heartbeat:Connect(function()
			if currentStore then
				handle:Disconnect()
				resolve(currentStore)
			end
		end)

		onCancel(function()
			handle:Disconnect()
		end)
	end)
end

local function getState(selector)
	assertStore()
	return if selector then selector(currentStore:getState()) else currentStore:getState()
end

local function dispatch(action)
	assertStore()
	return currentStore:dispatch(action)
end

local function destruct()
	assertStore()
	currentStore:destruct()
end

local function onDispatch(type, callback)
	local callbacks = actionCallbacksByType[type]

	if not callbacks then
		callbacks = {}
		actionCallbacksByType[type] = callbacks
	end

	actionCallbackId += 1
	callbacks[actionCallbackId] = callback

	return function()
		callbacks[actionCallbackId] = nil
	end
end

local function onUpdate(selector, callback, isImmediate)
	local handle
	local lastSelectedState

	local function onChange(state)
		local selectedState = selector(state)

		if selectedState ~= lastSelectedState then
			task.spawn(callback, selectedState, lastSelectedState)
			lastSelectedState = selectedState
		end
	end

	local promise = waitForStore()
		:andThen(function(store)
			handle = store.changed:connect(onChange)

			if isImmediate then
				task.defer(function()
					onChange(store:getState())
				end)
			else
				lastSelectedState = selector(store:getState())
			end
		end)

	return function()
		if handle then
			handle:disconnect()
		else
			promise:cancel()
		end
	end
end

local function onUpdateImmediate(selector, callback)
	return onUpdate(selector, callback, true)
end

local function onUpdateOnce(selector, callback)
	local handle = onUpdate(selector, function(current, previous)
		handle()
		callback(current, previous)
	end)

	return handle
end

local function onDispatchOnce(type, callback)
	local handle = onDispatch(type, function(action)
		handle()
		callback(action)
	end)

	return handle
end

local function waitForUpdate(selector)
	return Promise.new(function(resolve, _, onCancel)
		onCancel(onUpdateOnce(selector, resolve))
	end)
end

local function waitForDispatch(type)
	return Promise.new(function(resolve, _, onCancel)
		onCancel(onDispatchOnce(type, resolve))
	end)
end

return {
	bind = bind,
	effectMiddleware = effectMiddleware,
	waitForStore = waitForStore,
	getStore = getStore,
	getState = getState,
	dispatch = dispatch,
	destruct = destruct,
	onUpdate = onUpdate,
	onUpdateImmediate = onUpdateImmediate,
	onUpdateOnce = onUpdateOnce,
	waitForUpdate = waitForUpdate,
	onDispatch = onDispatch,
	onDispatchOnce = onDispatchOnce,
	waitForDispatch = waitForDispatch,
}
