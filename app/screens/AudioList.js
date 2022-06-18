import React, {Component} from 'react'
import { Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import {AudioContext} from '../context/AudioProvider'
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import {AudioListItem} from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModal from '../components/OptionModal'
import {Audio} from 'expo-av'
import {pause, play, resume, playNext} from '../misc/audioController'

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

    handleAudioPress = async(audio) => { //checar se tem áudio tocando, alternar áudios
        const{soundObj, playbackObj, currentAudio, updateState, audioFiles} = this.context

        if(soundObj===null){ // nenhum áudio tocando
            const playbackObj = new Audio.Sound()
            const status = await play(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            return updateState(this.context, {currentAudio:audio,
                playbackObj:playbackObj, soundObj:status,
                isPlaying:true, currentAudioIndex:index})
        }

        // pausa áudio quando - isLoaded: tem áudio carregado / isPlaying: tem áudio tocando
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id===audio.id){
            const status = await pause(playbackObj)
            return updateState(this.context, {soundObj:status, isPlaying:false})
        }

        // continuar áudio quando está carregado mas não tocando
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id===audio.id){
            const status = await resume(playbackObj)
            return updateState(this.context, {soundObj:status, isPlaying:true})
        }

        // selecionar/ir pra outro áudio
        if(soundObj.isLoaded && currentAudio.id!==audio.id){
            const status = await playNext(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            return updateState(this.context, {currentAudio:audio, 
                soundObj:status, isPlaying:true, currentAudioIndex:index})
        }
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
                return<Screen>
                    <RecyclerListView // lista
                    dataProvider={dataProvider}
                    layoutProvider={this.layoutProvider}
                    rowRenderer={this.rowRenderer}
                    extendedState={{isPlaying}}/>

                    <OptionModal // modal
                    onPlayPress={() => {}}
                    onPlaylistPress={() => {}}
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