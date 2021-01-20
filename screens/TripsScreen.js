import React, {Component} from 'react'
import {View, Text, SafeAreaView, StatusBar, Platform} from 'react-native'
import Button from '../components/Button'

export default class Trips extends Component{


    render(){
        return(
            <SafeAreaView forceInset={{ top: 'always' }} >
                <Text>This is trips.</Text>
                {/* <Button onPress={() => this.props.navigation.navigate('Profile')}>Go to Profile</Button> */}
            </SafeAreaView>
        )
    }
}