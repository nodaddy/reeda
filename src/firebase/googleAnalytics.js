import { logEvent } from "firebase/analytics";
import { analytics } from "./";

export const logGAEvent = (eventName, params) => {
    logEvent(analytics, eventName, params);
};
