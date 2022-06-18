import React, {Component} from 'react'
import { Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import {AudioContext} from '../context/AudioProvider'
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import {AudioListItem} from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModal from '../components/OptionModal'

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props){
        super(props);
        this.state = {
            OptionModalVisible: false,
        }

        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch(type){
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 80; //espaço entre itens
                break;
                default:
                dim.width = 0;
                dim.height = 0;
        }
    })

    rowRenderer = (type, item) => {
        return <AudioListItem
            title={item.filename}
            duration={item.duration}
            onOptionPress={() => {
                this.currentItem = item
                this.setState({...this.state, OptionModalVisible: true})
            }}/>        
    }

    render() {
        return <AudioContext.Consumer>
            {({dataProvider}) => {
                return<Screen>
                    <RecyclerListView
                    dataProvider={dataProvider}
                    layoutProvider={this.layoutProvider}
                    rowRenderer={this.rowRenderer}/>
                    <OptionModal
                    onPlayPress={() => {}}
                    onPlaylistPress={() => {}}
                    currentItem={this.currentItem}
                    onClose={() =>
                        this.setState({...this.state, OptionModalVisible:false})}
                    visible={this.state.OptionModalVisible}/>
                </Screen>
            }}
        </AudioContext.Consumer>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default AudioList;