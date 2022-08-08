import Rodux from "@rbxts/rodux";
import { bind, effectMiddleware } from "@rbxts/rodux-effects";
import rootReducer from "./reducers";

const store = new Rodux.Store(rootReducer, undefined, [effectMiddleware]);

bind(store);
