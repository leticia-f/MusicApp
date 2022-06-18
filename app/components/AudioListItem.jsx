import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const getImageText = (filename) =>{
    return filename[0] //pega inicial do nome do arquivo
}

const convertTime = minutes => {
    if(minutes){
        const hrs = minutes/60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0,2));
        const sec = Math.ceil((60*percent)/100)

        if(parseInt(minute)<10 && sec<10){
            return `0${minute}:0${sec}`;
        }
        if(parseInt(minute)<10){
            return `0${minute}:${sec}`;
        }
        if(sec<10){
            return `${minute}:${sec}`;
        }

        return `${minute}:${sec}`;
    }
}

export const AudioListItem = ({title, duration, onOptionPress}) => {
  return (
    <>
    <View style={styles.container}>
        <View style={styles.leftContainer}>
            <View style={styles.image}><Text style={styles.imageText}>{getImageText(title)}</Text></View>
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.time}>
                    {convertTime(duration)}
                </Text>
            </View>
        </View>

        <View style={styles.rightContainer}>
            <Entypo onPress={onOptionPress} name="dots-three-vertical" size={24} color="black" style={{padding:12}}/>
        </View>
    </View>
    <View style={styles.separator}/>
    
    </>
  )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create ({
    container:{
        flexDirection:'row',
        alignSelf:'center',
        width:width-80,
        marginTop:15,
        marginBottom:15,
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
        backgroundColor: '#C97B7B',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    imageText:{
        fontSize:25,
        fontWeight:'bold',
        color: '#FFF',
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
        width:width-100,
        backgroundColor: '#D3D3D3',
        height:0.5,
        alignSelf:'center',
        alignItems:'center',
        marginTop:0,
    },
    time:{
        fontSize:12,
        color:'grey',
    }
})