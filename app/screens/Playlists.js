import AsyncStorage from "@react-native-async-storage/async-storage";
import react, {useContext, useEffect, useState} from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList, Alert } from "react-native";
import PlaylistInputModal from "../components/PlaylistInputModal";
import color from "../misc/color";
import {AudioContext} from '../context/AudioProvider'
import { play } from "../misc/audioController";
import Screen from "../components/Screen";
import PlaylistDetails from "../components/PlaylistDetail";

let selectedPlaylist = {}

const Playlists = () => {
    const [modalVisible,setModalVisible] = useState(false)
    const [showPlaylist,setShowPlaylist] = useState(false)

    const context = useContext(AudioContext)
    const {playlist, addToPlaylist, updateState} = context

    const createPlaylist = async(playlistName) =>{ //depois do user ir no submit
       const result = await AsyncStorage.getItem('playlist')
       
       if(result!==null){ //colocar áudios dentro de uma playlist existente (criada)
        const audios = []

        if(addToPlaylist){ //colocar audios dentro do addToPlaylist dentro do array
            audios.push(addToPlaylist)
        }

        const newList = {
            id:Date.now(), //pro id ser único
            title:playlistName, //nome colocado no input
            audios:audios, //array vazio quando a lista é nova
        }

        const updatedList = [...playlist, newList]
        updateState(context, {addToPlaylist:null, playlist:updatedList}) //audios já foram adicionados
        await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
       }
       setModalVisible(false)
    }

    const renderPlaylist = async() =>{
        const result = await AsyncStorage.getItem('playlist')
        if(result===null){ //rodando app pela primeira vez
            const defaultPlaylist = { //setando playlist base
                id: Date.now(),
                title: "Favoritas",
                audios: [] //playlist vazia
            }

            const newPlaylist = [...playlist, defaultPlaylist]
            updateState(context, {playlist: [...newPlaylist]})
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlaylist]))
        }
        updateState(context, {playlist: JSON.parse(result)})
    }

    useEffect(() => {
        if(!playlist.length){
            renderPlaylist()
        }
    }, [])

    const handleBannerPress = async(playlist) => {
        //atualizar playlist só se tiver algum áudio selecionado
        if(addToPlaylist){
            const result = await AsyncStorage.getItem('playlist')
            
            let oldList = []
            let updatedList = []
            let sameAudio = false

            if(result!==null){
                oldList = JSON.parse(result)

                updatedList = oldList.filter(list => {
                    if(list.id===playlist.id){
                        for(let audio of list.audios){
                            if(audio.id===addToPlaylist.id){ //o áudio já está nessa playlist, não vai atualizar
                                sameAudio=true
                                return;
                            }
                        }

                        //atualizar playlist se áudio estiver selecionado e não estiver na playlist
                        list.audios = [...list.audios, addToPlaylist]
                    }

                    return list;
                })
            }

            if(sameAudio){
                Alert.alert('Áudio já adicionado', `${addToPlaylist.filename} já está nessa playlist.`)
                sameAudio=false
                return updateState(context, {addToPlaylist:null})
            }

            updateState(context, {addToPlaylist:null, playlist: [...updatedList]})
            return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]))
        }

        //abrir playlist se não tem áudio selecionado
        selectedPlaylist = playlist
        setShowPlaylist(true)
    }

    return (
        <>
            <Screen>
            <ScrollView contentContainerStyle={styles.container}>

                {playlist.length?playlist.map(item =>
                <TouchableOpacity onPress={() => handleBannerPress(item)} key={item.id.toString()} style={styles.playlistBanner}>
                    <Text style={styles.playlistTitle}>{item.title}</Text>
                    <Text style={styles.audioCount}>
                        {item.audios.length>1?
                        `${item.audios.length} músicas`:
                        `${item.audios.length} música`}
                    </Text>
                </TouchableOpacity>):null}

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.addPlaylist}> + Criar nova playlist</Text>
                </TouchableOpacity>

                <PlaylistInputModal visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={createPlaylist}/>
        
            </ScrollView>

            <PlaylistDetails visible={showPlaylist} playlist={selectedPlaylist} onClose={() => setShowPlaylist(false)}/>

            </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        padding:20,
    },
    playlistBanner:{
        padding:5,
        backgroundColor:'rgba(204,204,204,0.7)',
        borderRadius:5,
        marginBottom:20,
    },
    playlistTitle:{
        fontWeight:'bold',
        fontSize:16,
        letterSpacing:1,
    },
    audioCount:{
        opacity:0.5,
        marginTop:5,
        fontSize:14,
    },
    addPlaylist:{
        color:color.pink_active,
        fontSize:16,
        fontWeight: 'bold',
    }
})

export default Playlists;