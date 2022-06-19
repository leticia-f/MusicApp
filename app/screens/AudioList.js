import React, {Component} from 'react'
import { Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import {AudioContext} from '../context/AudioProvider'
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import {AudioListItem} from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModal from '../components/OptionModal'
import {Audio} from 'expo-av'
import {pause, play, resume, playNext, selectAudio} from '../misc/audioController'
import { storeAudioForNextOpening } from '../misc/helper'

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props){
        super(props);
        this.state = {
            OptionModalVisible: false,
        }

        this.currentItem = {}
    }


    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => { //"arruma"/"organiza" a lista
        switch(type){
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 80; //espaço entre itens
                break;
                default:
                dim.width = 0;
                dim.height = 0;
        }
    })


    // onPlaybackStatusUpdate = async(playbackStatus) => {
    //     if(playbackStatus.isLoaded && playbackStatus.isPlaying){
    //         this.context.updateState(this.context, {
    //             playbackPosition: playbackStatus.positionMillis,
    //             playbackDuration: playbackStatus.durationMillis,
    //         })
    //     }
        
    //     if(playbackStatus.didJustFinish){ // checa se o áudio acabou e se sim passa pro próximo
    //         const nextAudioIndex = this.context.currentAudioIndex+1
            
    //         if(nextAudioIndex >= this.context.totalAudioCount){ //não tem mais "próximo"
    //             this.context.playbackObj.unloadAsync()
    //             this.context.updateState(this.context, {
    //                 soundObj:null,
    //                 currentAudio:this.context.audioFiles[0],
    //                 isPlaying:false,
    //                 currentAudioIndex:0,
    //                 playbackPosition:null,
    //                 playbackDuration:null,
    //             })
    //             return await storeAudioForNextOpening(this.context.audioFiles[0], 0)
    //         }

    //         //caso contrário, selecionando próximo áudio
    //         const audio = this.context.audioFiles[nextAudioIndex]
    //         const status = await playNext(this.context.playbackObj, audio.uri)
            
    //         this.context.updateState(this.context, {
    //             soundObj:status,
    //             currentAudio:audio,
    //             isPlaying:true,
    //             currentAudioIndex:nextAudioIndex,
    //         })

    //         await storeAudioForNextOpening(audio, nextAudioIndex)
    //     }
    // }


    handleAudioPress = async(audio) => { //checar se tem áudio tocando, alternar áudios
        await selectAudio(audio,this.context)
    //     const{soundObj,
    //         playbackObj,
    //         currentAudio,
    //         updateState,
    //         audioFiles} = this.context

    //     if(soundObj===null){ // nenhum áudio tocando
    //         const playbackObj = new Audio.Sound()
    //         const status = await play(playbackObj, audio.uri)
    //         const index = audioFiles.indexOf(audio)

    //         updateState(this.context, {currentAudio:audio,
    //             playbackObj:playbackObj, soundObj:status,
    //             isPlaying:true, currentAudioIndex:index});

    //         playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate) //mudar a seekbar
    //             return storeAudioForNextOpening(audio, index)
    //     }

    //     // pausa áudio quando - isLoaded: tem áudio carregado / isPlaying: tem áudio tocando
    //     if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id===audio.id){
    //         const status = await pause(playbackObj)
    //         return updateState(this.context, {soundObj:status, isPlaying:false})
    //     }

    //     // continuar áudio quando está carregado mas não tocando
    //     if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id===audio.id){
    //         const status = await resume(playbackObj)
    //         return updateState(this.context, {soundObj:status, isPlaying:true})
    //     }

    //     // selecionar/ir pra outro áudio
    //     if(soundObj.isLoaded && currentAudio.id!==audio.id){
    //         const status = await playNext(playbackObj, audio.uri)
    //         const index = audioFiles.indexOf(audio)
    //         updateState(this.context, {currentAudio:audio, 
    //             soundObj:status, isPlaying:true, currentAudioIndex:index})
    //         return storeAudioForNextOpening(audio, index)
    //     }
    // }
    }


    componentDidMount(){
        this.context.loadPreviousAudio()
    }

    rowRenderer = (type, item, index, extendedState) => { // renderiza item
        return <AudioListItem
            title={item.filename}
            duration={item.duration}
            isPlaying={extendedState.isPlaying}
            activeListItem={this.context.currentAudioIndex===index}
            onAudioPress={() => this.handleAudioPress(item)}
            onOptionPress={() => {
                this.currentItem = item
                this.setState({...this.state, OptionModalVisible: true})
            }}/>        
    }


    render() { // renderiza lista e modal
        return <AudioContext.Consumer>
            {({dataProvider, isPlaying}) => {
                if(!dataProvider._data.length) return null;
                return<Screen>
                    <RecyclerListView // lista
                    dataProvider={dataProvider}
                    layoutProvider={this.layoutProvider}
                    rowRenderer={this.rowRenderer}
                    extendedState={{isPlaying}}/>

                    <OptionModal // modal
                    onPlayPress={() => {}}
                    onPlaylistPress={() => {
                        this.context.updateState(this.context, {
                            addToPlaylist:this.currentItem
                        })
                        this.props.navigation.navigate('Playlists')
                    }}
                    currentItem={this.currentItem}
                    onClose={() =>
                        this.setState({...this.state, OptionModalVisible:false})}
                    visible={this.state.OptionModalVisible}/>
                </Screen>
            }}
        </AudioContext.Consumer>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default AudioList;