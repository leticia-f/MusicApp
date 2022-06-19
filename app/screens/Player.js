import react, {useContext, useEffect} from "react";
import { View, StyleSheet, Text, StatusBar, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, resume } from "../misc/audioController";
import { playbackObj, soundObj } from 'expo-av'

const {width} = Dimensions.get('window')

function removeExtension(filename) {
    return filename.replace(/\.[^\/.]+$/, '');
}

const Player = () => {

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
        if(context.soundObj===null){ //pra áudio dar play
            const audio = context.currentAudio
            const status = await play(context.playbackObj,audio.uri)
            return context.updateState(context, {
                soundObj:status,
                currentAudio:audio,
                isPlaying:true,
                currentAudioIndex:context.currentAudioIndex,
            })
        }

        if(context.soundObj && context.soundObj.isPlaying){ //pra áudio dar pause
            const status = await pause(context.playbackObj)
            return context.updateState(context, {
                soundObj:status,
                isPlaying:false,
            })
        }

        if(context.soundObj && !context.soundObj.isPlaying){ //pra áudio continuar
            const status = await resume(context.playbackObj)
            return context.updateState(context, {
                soundObj:status,
                isPlaying:true,
            })
        }
    }

    if(!context.currentAudio) return null;

    return (
        <Screen>
            <View style={styles.container}>
                {/* context.currentAudioIndex + 1 pra tirar o index 0 */}
                <Text style={styles.audioCount}>{`${context.currentAudioIndex+1} / ${context.totalAudioCount}`}</Text>
                <View style={styles.midBannerContainer}><MaterialCommunityIcons name="music-box" size={300} color={context.isPlaying?'#C97B7B':'#EA9997'} /></View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.title}>{context.currentAudio.filename}</Text>
                    <Slider
                        style={{width: width, height: 40}}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeekBar()}
                        thumbTintColor={context.isPlaying?'#C97B7B':'#EA9997'}
                        minimumTrackTintColor={context.isPlaying?'#C97B7B':'#EA9997'}
                        maximumTrackTintColor="#000"/>
                        <View style={styles.audioControllers}>
                            <PlayerButton iconType='PREV'/>
                            <PlayerButton
                                onPress={handlePlayPause}
                                style={{marginHorizontal:26}}
                                iconType={context.isPlaying?'PLAY':'PAUSE'}/>
                            <PlayerButton iconType='NEXT'/>
                        </View>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignSelf:'center',
        paddingVertical:75,
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
        marginLeft:20,
        marginBottom:13,
    },
    audioControllers:{
        width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
    }
})

export default Player;