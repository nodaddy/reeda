import { logGAEvent } from "@/firebase/googleAnalytics";

const { useAppContext } = require("@/context/AppContext")
const { Moon, Sun } = require("lucide-react")

const NightModeButton = () => {
    const { nightModeOn, setNightModeOn} = useAppContext();
    return (
            !nightModeOn ? <Moon onClick={() => {
            setNightModeOn(!nightModeOn);
            logGAEvent('click_night_mode');
        }} /> 
        :
        <Sun onClick={() => {
            setNightModeOn(!nightModeOn);
            logGAEvent('click_bright_mode');
        }} /> 
    )
}

export default NightModeButton;