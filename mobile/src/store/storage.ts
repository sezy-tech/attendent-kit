import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
    key: string
    constructor(key: string) {
        this.key = key
    }

    save = async (value: any) => {
        try {
            await AsyncStorage.setItem(this.key, JSON.stringify(value))
        } catch (e) {
            // saving error
        }
    }
    get = async () => {
        try {
            const value = await AsyncStorage.getItem(this.key)
            if (value !== null) {
                return JSON.parse(value)
            }
        } catch (e) {
            // error reading value
        }
    }
    remove = async () => {
        try {
            await AsyncStorage.removeItem(this.key)
        } catch (e) {
            // remove error
        }
    }
}

export default Storage