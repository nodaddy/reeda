import { logEvent } from "firebase/analytics";
import { analytics } from "./";

export const logGAEvent = (eventName, params = null) => {
    logEvent(analytics, eventName, params);
};
