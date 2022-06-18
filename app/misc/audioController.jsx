
export const play = async(playbackObj, uri) => { //tocar
    try {
        return await playbackObj.loadAsync({uri},{shouldPlay:true})
    } catch (error){
        console.log('erro no play', error.message)
    }
}

export const pause = async(playbackObj) => { //pausar
    try {
        return await playbackObj.setStatusAsync({shouldPlay:false})
    } catch (error){
        console.log('erro no pausar', error.message)
    }
}

export const resume = async(playbackObj) => { //continuar
    try {
        return await playbackObj.playAsync()
    } catch (error){
        console.log('erro no continuar', error.message)
    }
}

export const playNext = async(playbackObj, uri) => { //mudar música
    try{
        await playbackObj.stopAsync()
        await playbackObj.unloadAsync()
        return await play(playbackObj, uri)
    } catch(error){
        console.log('erro no selecionar música', error.message)
    }
}