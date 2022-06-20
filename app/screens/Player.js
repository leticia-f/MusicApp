import react, {useContext, useEffect, useState} from "react";
import { View, StyleSheet, Text, StatusBar, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, resume, playNext, selectAudio, changeAudio } from "../misc/audioController";
import { playbackObj, soundObj } from 'expo-av'
import { storeAudioForNextOpening } from "../misc/helper";
import { convertTime } from "../misc/helper";
import { moveAudio } from "../misc/audioController";

function removeExtension(filename) {
    return filename.replace(/\.[^\/.]+$/, '');
}

const Player = () => {

    const [currentPosition, setCurrentPosition] = useState(0)
    const context = useContext(AudioContext)
    const {playbackPosition, playbackDuration} = context

    const calculateSeekBar = () => {
        if(playbackPosition!==null && playbackDuration!==null){
            return playbackPosition/playbackDuration
        }
        else{
            return 0;
        }
    }

    useEffect(() => {
        context.loadPreviousAudio()
    }, [])


    const handlePlayPause = async() => { //controlar áudio pelo player
        await selectAudio(context.currentAudio, context)
        // if(context.soundObj===null){ //pra áudio dar play
        //     const audio = context.currentAudio
        //     const status = await play(context.playbackObj,audio.uri)
        //     context.playbackObj.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate) 

        //     return context.updateState(context, {
        //         soundObj:status,
        //         currentAudio:audio,
        //         isPlaying:true,
        //         currentAudioIndex:context.currentAudioIndex,
        //     })
        // }

        // if(context.soundObj && context.soundObj.isPlaying){ //pra áudio dar pause
        //     const status = await pause(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj:status,
        //         isPlaying:false,
        //     })
        // }

        // if(context.soundObj && !context.soundObj.isPlaying){ //pra áudio continuar
        //     const status = await resume(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj:status,
        //         isPlaying:true,
        //     })
    }


    const handleNext = async() => { //botão de próximo
        await changeAudio(context,'next')
        // // const {isLoaded} = await context.playbackObj.getStatusAsync()
        // // const isLastAudio = context.currentAudioIndex+1===context.totalAudioCount
        // // let audio = context.audioFiles[context.currentAudioIndex+1]
        // // let index
        // // let status

        // // //app rodando pela primeira vez, música não é a última
        // // if(!isLoaded && !isLastAudio){
        // //     index = context.currentAudioIndex+1
        // //     status = await play(context.playbackObj,audio.uri)
        // // }
        // // if(isLoaded && !isLastAudio){
        // //     index = context.currentAudioIndex+1
        // //     status = await playNext(context.playbackObj,audio.uri)
        // // }
        // // if(isLastAudio){
        // //     index = 0
        // //     audio = context.audioFiles[index]
            
        // //     if(isLoaded){
        // //         status = await playNext(context.playbackObj,audio.uri)
        // //     } else{
        // //         status = await play(context.playbackObj,audio.uri)
        // //     }
        // // }

        // context.updateState(context, {currentAudio:audio,
        //     playbackObj:context.playbackObj, soundObj:status,
        //     isPlaying:true, currentAudioIndex:index,
        //     playbackPosition: null, playbackDuration: null});
        // storeAudioForNextOpening(audio,index)
    }


    const handlePrev = async() => { //botão de prévio(?)
        await changeAudio(context,'previous')
        // const {isLoaded} = await context.playbackObj.getStatusAsync()
        // const isFirstAudio = context.currentAudioIndex<=0
        // let audio = context.audioFiles[context.currentAudioIndex-1]
        // let index
        // let status

        // //app rodando pela primeira vez, música não é a primeira
        // if(!isLoaded && !isFirstAudio){
        //     index = context.currentAudioIndex-1
        //     status = await play(context.playbackObj,audio.uri)
        // }
        // if(isLoaded && !isFirstAudio){
        //     index = context.currentAudioIndex-1
        //     status = await playNext(context.playbackObj,audio.uri)
        // }
        // if(isFirstAudio){
        //     index = context.totalAudioCount-1
        //     audio = context.audioFiles[index]
            
        //     if(isLoaded){
        //         status = await playNext(context.playbackObj,audio.uri)
        //     } else{
        //         status = await play(context.playbackObj,audio.uri)
        //     }
        

        // context.updateState(context, {currentAudio:audio,
        //     playbackObj:context.playbackObj, soundObj:status,
        //     isPlaying:true, currentAudioIndex:index,
        //     playbackPosition: null, playbackDuration: null});
        // storeAudioForNextOpening(audio,index)
    }


    const renderCurrentTime = () => {
        return convertTime(context.playbackPosition / 1000)
    }


    if(!context.currentAudio) return null;


    return (
        <Screen>
            <View style={styles.container}>
                {/* context.currentAudioIndex + 1 pra tirar o index 0 */}
                <Text style={styles.audioCount}>{`${context.currentAudioIndex+1} / ${context.totalAudioCount}`}</Text>

                <View style={styles.midBannerContainer}>
                    <MaterialCommunityIcons name="music-box" size={300} color={context.isPlaying?color.pink_active:color.pink_inactive} />
                </View>
                
                <View style={styles.audioPlayerContainer}>
                    
                    <Text numberOfLines={2} style={styles.title}>{removeExtension(context.currentAudio.filename)}</Text>
                    
                    <Slider
                    style={{width: width, height: 30}}
                    minimumValue={0}
                    maximumValue={1}
                    value={calculateSeekBar()}
                    thumbTintColor={context.isPlaying?color.pink_active:color.pink_inactive}
                    minimumTrackTintColor={context.isPlaying?color.pink_active:color.pink_inactive}
                    maximumTrackTintColor="#000"
                    onValueChange={(value) => {
                        setCurrentPosition(convertTime(value*context.currentAudio.duration))
                    }}
                    onSlidingStart={ //pausar áudio quando começar a usar a seekbar
                        async() => {
                            if(!context.isPlaying) return
                            try {
                                await pause(context.playbackObj)
                            } catch (error) {console.log('erro no onSlidingStart -', error)}
                        }
                    }
                    onSlidingComplete={ 
                        async(value) => {
                            await moveAudio(context, value)
                            setCurrentPosition(0)}}/>
                    
                    <View style={styles.liveTimestamps}>
                        <Text>{currentPosition?currentPosition:renderCurrentTime()}</Text>
                        <Text>{convertTime(context.currentAudio.duration)}</Text>
                    </View>

                    <View style={styles.audioControllers}>
                        <PlayerButton iconType='PREV' onPress={handlePrev}/>
                        <PlayerButton
                            onPress={handlePlayPause}
                            style={{marginHorizontal:26}}
                            iconType={context.isPlaying?'PLAY':'PAUSE'}/>
                        <PlayerButton iconType='NEXT' onPress={handleNext}/>

                    </View>

                </View>
            </View>
        </Screen>
    );
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignSelf:'center',
        paddingVertical:60,
    },
    audioCount:{
        alignSelf:'center',
        paddingTop: StatusBar.currentHeight,
        fontSize: 20,
        color: color.font_medium,
    },
    midBannerContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    title:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft:25,
        marginBottom:20,
        width: width-50
    },
    audioControllers:{
        width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
    },
    liveTimestamps:{
        flexDirection:'row',
        width:width-50,
        justifyContent:'space-between',
        marginLeft:25
    }
})

export default Player;