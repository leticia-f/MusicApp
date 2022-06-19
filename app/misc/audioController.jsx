import { storeAudioForNextOpening } from "./helper"

export const play = async(playbackObj, uri) => { //tocar
    try {
        return await playbackObj.loadAsync({uri},{shouldPlay:true, progressUpdateIntervalMillis:1000})
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

export const selectAudio = async(audio, context) => {
    const{soundObj,
        playbackObj,
        currentAudio,
        updateState,
        onPlaybackStatusUpdate,
        audioFiles} = context

    try {
        if(soundObj===null){ // nenhum áudio tocando
            const status = await play(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
    
            updateState(context, {currentAudio:audio,
                soundObj:status, isPlaying:true,
                currentAudioIndex:index});
    
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate) //mudar a seekbar
                return storeAudioForNextOpening(audio, index)
        }
    
        // pausa áudio quando - isLoaded: tem áudio carregado / isPlaying: tem áudio tocando
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id===audio.id){
            const status = await pause(playbackObj)
            return updateState(context, {soundObj:status, isPlaying:false})
        }
    
        // continuar áudio quando está carregado mas não tocando
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id===audio.id){
            const status = await resume(playbackObj)
            return updateState(context, {soundObj:status, isPlaying:true})
        }
    
        // selecionar/ir pra outro áudio
        if(soundObj.isLoaded && currentAudio.id!==audio.id){
            const status = await playNext(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            updateState(context, {currentAudio:audio, 
                soundObj:status, isPlaying:true, currentAudioIndex:index})
            return storeAudioForNextOpening(audio, index)
        }
    } catch (error) {
        console.log('erro no selectAudio -', error.message)
    }

}

export const changeAudio = async(context, select) => {
    const {playbackObj,
        currentAudioIndex,
        totalAudioCount,
        audioFiles,
        updateState} = context
    
    try {
        const {isLoaded} = await playbackObj.getStatusAsync()
        const isLastAudio = currentAudioIndex+1===totalAudioCount
        const isFirstAudio = currentAudioIndex<=0
        let audio;
        let index
        let status

        //pra próxima
        if(select==='next'){
            audio = audioFiles[currentAudioIndex+1]

            if(!isLoaded && !isLastAudio){
                index = currentAudioIndex+1
                status = await play(playbackObj,audio.uri)
            }
            if(isLoaded && !isLastAudio){
                index = currentAudioIndex+1
                status = await playNext(playbackObj,audio.uri)
            }
            if(isLastAudio){
                index = 0
                audio = audioFiles[index]
                
                if(isLoaded){
                    status = await playNext(playbackObj,audio.uri)
                } else{
                    status = await play(playbackObj,audio.uri)
                }
            }
        }

        //pra previous
        if(select==='previous'){
            audio = audioFiles[currentAudioIndex-1]

            if(!isLoaded && !isFirstAudio){
                index = currentAudioIndex-1
                status = await play(playbackObj,audio.uri)
            }
            if(isLoaded && !isFirstAudio){
                index = currentAudioIndex-1
                status = await playNext(playbackObj,audio.uri)
            }
            if(isFirstAudio){
                index = totalAudioCount-1
                audio = audioFiles[index]
                
                if(isLoaded){
                    status = await playNext(playbackObj,audio.uri)
                } else{
                    status = await play(playbackObj,audio.uri)
                }
            }
        }

        updateState(context, {currentAudio:audio,
            soundObj:status, isPlaying:true,
            currentAudioIndex:index, playbackPosition: null,
            playbackDuration: null});
        storeAudioForNextOpening(audio,index)
    } catch (error) {
        console.log('erro no changeAudio -', error.message)
    }
}