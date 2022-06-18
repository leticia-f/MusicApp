import react from "react";
import { View, StyleSheet, StatusBar } from 'react-native'
import color from "../misc/color";

const Screen = ({children}) => { //desestrutura children
    return (
        <View style={styles.container}>{children}</View> //renderiza children
    )
}

const styles = StyleSheet.create ({
    container:{
        flex:1,
        backgroundColor:color.font_light,
    },
})

export default Screen;