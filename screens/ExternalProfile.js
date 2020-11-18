import React, {Component} from 'react'
import {View, Text} from 'react-native'
import Button from '../components/Button'

export default class Home extends Component{
    render(){
        return(
            <View>
                <Text>This is external profile.</Text>
                <Button onPress={() => this.props.navigation.goBack()}>Go Back</Button>
                {/* <Button onPress={() => this.props.navigation.navigate('Profile')}>Go to Profile</Button> */}
            </View>
        )
    }
}