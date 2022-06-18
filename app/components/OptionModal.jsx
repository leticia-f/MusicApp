import react from "react";
import { View, StyleSheet, StatusBar, Modal, Text, TouchableWithoutFeedback, EdgeInsetsPropType } from 'react-native'
import color from "../misc/color";

const OptionModal = ({ visible, currentItem, onClose, onPlayPress, onPlaylistPress }) => {
    const {filename} = currentItem

    return (
        <>
            <StatusBar hidden />
            <Modal animationType='fade' transparent visible={visible}>
                <View style={styles.modal}>
                    <Text style={styles.title} numberOfLines={2}>{filename}</Text>
                    <View style={styles.optionContainer}>
                        <TouchableWithoutFeedback onPress={onPlayPress}>
                            <Text style={styles.option}>Reproduzir</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onPlaylistPress}>
                            <Text style={styles.option}>Adicionar à playlist</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBG} />
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        zIndex: 1000,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.font_medium,
    },
    optionContainer: {
        padding: 20,
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.font,
        paddingVertical: 10,
        letterSpacing: 1,
    },
    modalBG: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: color.modal_bg,
    }
})

export default OptionModal;