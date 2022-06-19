import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import color from '../misc/color';

const PlaylistInputModal = ({visible, onClose, onSubmit}) => {

    const [playlistName, setPlaylistName] = useState('')

    const handleOnSubmit = () => {
        if(!playlistName.trim()){
            onClose() //fechar modal se não tiver nome
        } else{
            onSubmit(playlistName)
            setPlaylistName('') //apagar input depois de setar nome
            onClose() //fechar modal
        }
    }

    return (
        <Modal visible={visible} animationType='fade' transparent>
            <View style={styles.modalContainer}>
                <View style={styles.inputContainer}>
                    <Text style={{color:color.pink_active, fontSize:15, letterSpacing:0.5,}}>
                        Dê um nome à sua playlist.
                    </Text>
                    
                    <TextInput value={playlistName}
                    onChangeText={(text) => setPlaylistName(text)}
                    selectionColor={color.pink_active}
                    style={styles.input} />

                    <FontAwesome
                    style={styles.submitIcon}
                    name="check" size={30}
                    color={color.pink_active}
                    onPress={handleOnSubmit}/>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}/>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
    },
    inputContainer:{
        width:width-50,
        height:200,
        borderRadius:10,
        backgroundColor:color.modal_color,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom:20
    },
    input:{
        paddingTop:20,
        width:width-90,
        borderBottomWidth:1,
        borderBottomColor:color.separator,
        fontSize:18,
        justifyContent:'center',
    },
    submitIcon:{
        marginTop:30,
    },
    modalBG:{
        backgroundColor:color.modal_bg,
        zIndex:-1,
    }
});

export default PlaylistInputModal;