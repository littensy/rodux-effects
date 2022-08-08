-- Compiled with roblox-ts v1.3.3
local initialState = {
	clock = 0,
	alarm = 6 * 60 * 60,
}
local function alarmReducer(state, action)
	if state == nil then
		state = initialState
	end
	local _exp = action.type
	repeat
		if _exp == "SET_CLOCK" then
			local _object = {}
			for _k, _v in pairs(state) do
				_object[_k] = _v
			end
			_object.clock = action.clock
			return _object
		end
		if _exp == "SET_ALARM" then
			local _object = {}
			for _k, _v in pairs(state) do
				_object[_k] = _v
			end
			_object.alarm = action.alarm
			return _object
		end
		if _exp == "CLOCK_TICK" then
			local _object = {}
			for _k, _v in pairs(state) do
				_object[_k] = _v
			end
			_object.clock = (state.clock + 1) % (12 * 60 * 60)
			return _object
		end
		return state
	until true
end
return {
	default = alarmReducer,
}
