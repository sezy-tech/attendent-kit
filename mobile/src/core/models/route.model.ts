
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    AddFace: undefined;
    VerifyFace: undefined;
    AddVoice: undefined;
    VerifyVoice: undefined;
    // Details: { userId: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;