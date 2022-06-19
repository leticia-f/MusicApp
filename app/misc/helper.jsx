import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeAudioForNextOpening = async(audio, index) => {
    await AsyncStorage.setItem('previousAudio', JSON.stringify({audio, index}))

}

// audio vai ser usado pra atualizar a ui
// index pra selecionar áudio na próxima renderização do app