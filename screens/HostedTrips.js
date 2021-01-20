import React, {Component} from 'react'
import {View, Text, SafeAreaView, StatusBar, Platform} from 'react-native'
import Button from '../components/Button'

export default class HostedTrips extends Component{
    
    componentDidMount(){
        // Set Status Bar page info here!
       this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
        });
    }

    render(){
        return(
            <SafeAreaView>
                <Text>This is hosted trips.</Text>
                {/* <Button onPress={() => this.props.navigation.navigate('Profile')}>Go to Profile</Button> */}
            </SafeAreaView>
        )
    }
}