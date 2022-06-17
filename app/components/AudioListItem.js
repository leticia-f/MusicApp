import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const AudioListItem = () => {
  return (
    <>
    <View style={styles.container}>
        <View style={styles.leftContainer}>
            <View style={styles.image}>
                <Text style={styles.imageText}>A</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.title}>Song title</Text>
                <Text style={styles.time}>Artist</Text>
            </View>
        </View>

        <View style={styles.rightContainer}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>
    </View>
    <View style={styles.separator} />
    </>
  )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create ({
    container:{
        flexDirection:'row',
        alignSelf:'center',
        width:width-80,
    },
    leftContainer:{
        flexDirection:'row',
        alignItems:'center',
        flex: 1,
    },
    rightContainer:{
        flexDirection:'row',
        flexBasis:50,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        height:50,
        flexBasis:50,
        backgroundColor: '#DCDCDC',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    imageText:{
        fontSize:25,
        fontWeight:'bold',
        color: '#C97B7B',
    },
    titleContainer:{
        width:width-185,
        paddingLeft:10,
    },
    title:{
        fontSize:16,
        fontWeight:'bold',
        color: '#000',
    },
    separator:{
        width:width-80,
        backgroundColor: '#D3D3D3',
        height:0.5,
        opacity:0.3,
        alignSelf: 'center',
        alignItems:'center',
        marginTop:10,
    },
    time:{
        fontSize:12,
        color:'grey',
    }
})

export default AudioListItem;