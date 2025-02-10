const { useAppContext } = require("@/context/AppContext")
const { Moon, Sun } = require("lucide-react")

const NightModeButton = () => {
    const { nightModeOn, setNightModeOn} = useAppContext();
    return (
            !nightModeOn ? <Moon onClick={() => {
            setNightModeOn(!nightModeOn)
        }} /> 
        :
        <Sun onClick={() => {
            setNightModeOn(!nightModeOn)
        }} /> 
    )
}

export default NightModeButton;