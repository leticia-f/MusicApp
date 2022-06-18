import react from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
import Screen from "../components/Screen";

const Player = () => {
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioCount}>ABCDE</Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    audioCount:{
        alignSelf:'center',
        padding: StatusBar.currentHeight,
        fontSize:16,
    }
})

export default Player;