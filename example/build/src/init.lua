local TS = _G[script]
local Promise = TS.Promise

local RunService = game:GetService("RunService")

local watchingActions = {}
local currentStore

local function assertStore()
	if not currentStore then
		error("@rbxts/rodux-effects: middleware is not initialized, did you call waitForStore()?")
	end
end

local function bind(store)
	currentStore = store
end

local function effectMiddleware(nextDispatch)
	return function(action)
		if type(action) ~= "table" then
			return nextDispatch(action)
		end

		for watcher in pairs(watchingActions) do
			if action.type == watcher.type then
				task.defer(watcher.callback, action)
			end
		end

		return nextDispatch(action)
	end
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

local function actionEffect(type, callback)
	local watcher = {
		type = type,
		callback = callback,
	}

	watchingActions[watcher] = true

	return function()
		watchingActions[watcher] = nil
	end
end

local function stateEffect(selector, callback)
	local handle
	local lastSelectedState

	local function onChange(state)
		local selectedState = selector(state)

		if selectedState ~= lastSelectedState then
			task.defer(callback, selectedState, lastSelectedState)
		end

		lastSelectedState = selectedState
	end

	local promise = waitForStore()
		:andThen(function(store)
			handle = store.changed:connect(onChange)

			task.defer(function()
				onChange(store:getState())
			end)
		end)

	return function()
		if handle then
			handle:disconnect()
		else
			promise:cancel()
		end
	end
end

return {
	bind = bind,
	effectMiddleware = effectMiddleware,
	waitForStore = waitForStore,
	getState = getState,
	dispatch = dispatch,
	destruct = destruct,
	actionEffect = actionEffect,
	stateEffect = stateEffect,
}
