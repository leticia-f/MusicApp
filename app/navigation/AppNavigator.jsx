import react from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import Playlists from "../screens/Playlists";
import {Entypo, Ionicons, MaterialIcons} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Músicas' component={AudioList}
                options={{ tabBarIcon: ({color, size}) => (<Entypo name="folder-music" size={size} color={color} />) }} />

            <Tab.Screen name='Player' component={Player}
                options={{ tabBarIcon: ({color, size}) => (<Ionicons name="play" size={size} color={color} />) }} />

            <Tab.Screen name='Playlists' component={Playlists}
                options={{ tabBarIcon: ({color, size}) => (<MaterialIcons name="playlist-play" size={size} color={color} />) }} />
        </Tab.Navigator>
    )
}

export default AppNavigator;