import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import {DataProvider} from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av'
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/audioController';

export const AudioContext = createContext();

export class AudioProvider extends Component {

    constructor(props){
        super(props)
        this.state = {
            audioFiles:[],
            playlist:[],
            addToPlaylist:null,
            permissionError:false,
            dataProvider:new DataProvider((r1,r2)=>r1!==r2),
            playbackObj:null,
            soundObj:null,
            currentAudio:{},
            isPlaying:false,
            currentAudioIndex:null,
            playbackPosition:null,
            playbackDuration:null,
        }
        this.totalAudioCount=0
    }




    permissionAlert = () => {
        Alert.alert("Permissão necessária",
            "Este app precisa de acesso aos arquivos de áudio do dispositivo para funcionar.", [
                {text:"Negar",
                onPress: () => this.permissionAlert() },
                {text:"Permitir",
                onPress: () => this.getPermission() }])
    }




    getAudioFiles = async() => {
        const {dataProvider, audioFiles} = this.state 

        let media = await MediaLibrary.getAssetsAsync({mediaType:'audio'})
        media = await MediaLibrary.getAssetsAsync({mediaType:'audio', first: media.totalCount}) //totalCount: número total
        this.totalAudioCount = media.totalCount

        this.setState({... this.state, dataProvider:dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles:[...audioFiles, ...media.assets]})
    }




    loadPreviousAudio = async() => {
        let previousAudio = await AsyncStorage.getItem('previousAudio')
        let currentAudio
        let currentAudioIndex

        if(previousAudio===null){ //nenhum áudio foi tocado antes
            currentAudio = this.state.audioFiles[0] //selecionar primeiro áudio
            currentAudioIndex = 0
        }
        else{ //seleciona áudio de antes, se antes ele já estava selecionado
            previousAudio = JSON.parse(previousAudio)
            currentAudio = previousAudio.audio
            currentAudioIndex = previousAudio.index
        }

        this.setState({...this.state, currentAudio, currentAudioIndex})
    }




    getPermission = async() => { // async: em segundo plano, é uma janela
        const permission = await MediaLibrary.getPermissionsAsync()
        // espera que a expressão MediaLibrary.getPermissionsAsync() receba uma resposta
        
        if(permission.granted){ // pegar arquivos se permissão for garantida
            this.getAudioFiles()
        }

        if(!permission.canAskAgain && !permission.granted){
            this.setState({...this.state, permissionError: true})
            // colocar link pras configurações
        }

        if(!permission.granted && permission.canAskAgain){
            const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync()
            if(status === 'denied' && canAskAgain){ // mostrar alerta que o usuário precisa autorizar o acesso
                this.permissionAlert()
            }

            if(status === 'granted'){ // pegar arquivos
                this.getAudioFiles()
            }

            if(status === 'denied' && !canAskAgain){ // mensagem de erro
                this.setState({...this.state, permissionError: true})
                // colocar link pras configurações
            }
        }
    }




    onPlaybackStatusUpdate = async(playbackStatus) => {
        if(playbackStatus.isLoaded && playbackStatus.isPlaying){
            this.updateState(this, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }
        
        if(playbackStatus.didJustFinish){ // checa se o áudio acabou e se sim passa pro próximo
            const nextAudioIndex = this.state.currentAudioIndex+1
            
            if(nextAudioIndex >= this.totalAudioCount){ //não tem mais "próximo"
                this.state.playbackObj.unloadAsync()
                this.updateState(this, {
                    soundObj:null,
                    currentAudio:this.state.audioFiles[0],
                    isPlaying:false,
                    currentAudioIndex:0,
                    playbackPosition:null,
                    playbackDuration:null,
                })
                return await storeAudioForNextOpening(this.state.audioFiles[0], 0)
            }

            //caso contrário, selecionando próximo áudio
            const audio = this.state.audioFiles[nextAudioIndex]
            const status = await playNext(this.state.playbackObj, audio.uri)
            
            this.updateState(this, {
                soundObj:status,
                currentAudio:audio,
                isPlaying:true,
                currentAudioIndex:nextAudioIndex,
            })

            await storeAudioForNextOpening(audio, nextAudioIndex)
        }
    }




    componentDidMount(){
        this.getPermission() // pedir permissão ao usuário para acessar arquivos
        if(this.state.playbackObj===null){
            this.setState({...this.state, playbackObj:new Audio.Sound()})
        }
    }




    updateState = (prevState,newState = {}) => {
        this.setState({...prevState, ...newState})
    }




    render() {
        const {audioFiles,
            playlist,
            addToPlaylist,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            loadPreviousAudio,
            playbackDuration} = this.state

        if(permissionError){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize:20, textAlign:'center', fontWeight:'bold', paddingBottom:10}}>A permissão não foi aceita.</Text>
                </View>
            )
        }

        return (
            <AudioContext.Provider value={{
                audioFiles,
                playlist,
                addToPlaylist,
                dataProvider,
                playbackObj,
                soundObj,
                currentAudio,
                isPlaying,
                currentAudioIndex,
                totalAudioCount: this.totalAudioCount,
                playbackPosition,
                playbackDuration,
                onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
                loadPreviousAudio: this.loadPreviousAudio,
                updateState: this.updateState}}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}

export default AudioProvider;