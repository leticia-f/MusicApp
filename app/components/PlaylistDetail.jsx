import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Dimensions } from 'react-native';
import color from '../misc/color';
import { AudioListItem } from './AudioListItem'

function removeExtension(filename) {
    return filename.replace(/\.[^\/.]+$/, '');
}

const PlaylistDetails = ({visible, playlist, onClose}) => {
    return (
        <Modal visible={visible} animationType='fade' transparent onRequestClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>{playlist.title}</Text>
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={playlist.audios}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) =>
                        <View>
                            <AudioListItem title={removeExtension(item.filename)} duration={item.duration} />
                        </View>
                    }
                />
            </View>
            <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}/>
        </Modal>
    );
};

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        backgroundColor:color.modal_color,
        alignSelf:'center',
        bottom:0,
        height:height-200,
        width:width-20,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    title:{
        alignSelf:'center',
        alignItems:'center',
        marginTop:20,
        fontSize:25,
        color:color.pink_inactive,
        fontWeight:'bold'
    },
    listContainer:{
    },
    modalBG:{
        backgroundColor:color.modal_bg,
        zIndex:-1,
    },
});

//make this component available to the app
export default PlaylistDetails;
