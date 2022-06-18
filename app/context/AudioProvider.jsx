import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import {DataProvider} from 'recyclerlistview';

export const AudioContext = createContext();

export class AudioProvider extends Component {
    constructor(props){
        super(props)
        this.state = {
            audioFiles:[],
            permissionError:false,
            dataProvider:new DataProvider((r1,r2)=>r1!==r2),
            playbackObj:null,
            soundObj:null,
            currentAudio:{},
            isPlaying:false,
            currentAudioIndex:null,
        }
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
        media = await MediaLibrary.getAssetsAsync({mediaType:'audio', first: media.totalCount})

        this.setState({... this.state, dataProvider:dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles:[...audioFiles, ...media.assets]})
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

    componentDidMount(){
        this.getPermission() // pedir permissão ao usuário para acessar arquivos
    }

    updateState = (prevState,newState = {}) => {
        this.setState({...prevState, ...newState})
    }

    render() {
        const {audioFiles,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex} = this.state

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
                dataProvider,
                playbackObj,
                soundObj,
                currentAudio,
                isPlaying,
                currentAudioIndex,
                updateState: this.updateState}}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}

export default AudioProvider;