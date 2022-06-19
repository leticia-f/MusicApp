import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeAudioForNextOpening = async(audio, index) => {
    await AsyncStorage.setItem('previousAudio', JSON.stringify({audio, index}))
}

export const convertTime = minutes => {
    if (minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100)

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if(sec==60){
            return `${minute+1}:00`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }
        if (sec < 10) {
            return `${minute}:${sec}`;
        }

        return `${minute}:${sec}`;
    }
}

// audio vai ser usado pra atualizar a ui
// index pra selecionar áudio na próxima renderização do app