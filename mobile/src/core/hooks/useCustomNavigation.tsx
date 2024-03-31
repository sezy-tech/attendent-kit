import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../models/route.model";

const useCustomNavigation = () => {
    const navigation = useNavigation<NavigationProp>()
    return navigation
}

export default useCustomNavigation