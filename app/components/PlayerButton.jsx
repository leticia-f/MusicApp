import React from 'react'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const PlayerButton = (props) => {
    const {iconType, size=40, color='#000', onPress} = props

    const getIconName = (type) => {
        switch(type){
            case 'PLAY':
                return 'controller-paus';
            case 'PAUSE':
                return 'controller-play';
            case 'NEXT':
                return 'controller-fast-forward';
            case 'PREV':
                return 'controller-fast-backward';
        }
    }

    return (
        <Entypo {...props} onPress={onPress} name={getIconName(iconType)} size={size} color={color}/>
    )
}

export default PlayerButton;