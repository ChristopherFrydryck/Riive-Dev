import React from 'react'
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import Text from './Txt'
import Colors from '../constants/Colors'
import Icon from './Icon'
import * as Font from 'expo-font'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { inject, observer } from 'mobx-react/native';



function cacheFonts(fonts){
    return fonts.map(font => Font.loadAsync(font))
}


@inject('ComponentStore')
@observer
class SpacesList extends React.Component{

    async componentDidMount(){
        const iconAssets = cacheFonts([FontAwesome.font, MaterialCommunityIcons.font])
        await Promise.all([...iconAssets])
        this.props.ComponentStore.spotsLoaded = true;
    }

    render(){
        if(this.props.ComponentStore.spotsLoaded){
        return(
            <Text>Hello.</Text>
        )}else{
            return(
                <Text>Loading...</Text>
            )
        }
    }
}

export default SpacesList