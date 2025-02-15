import { logEvent } from "firebase/analytics";
import { analytics } from "./";
import { storage } from "@/app/utility";

export const logGAEvent = (eventName, params = {userId: JSON.parse(storage.getItem('user')).email.replace('@', '[at]')}) => {
    logEvent(analytics, eventName, params);
};
