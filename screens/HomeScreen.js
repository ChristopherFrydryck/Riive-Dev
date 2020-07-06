import React, {Component} from 'react'
import {Fragment, View, ActivityIndicator, SafeAreaView, StatusBar, Platform} from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import * as Font from 'expo-font'

import * as firebase from 'firebase'
import 'firebase/firestore';



//MobX Imports
import {inject, observer} from 'mobx-react/native'
import UserStore from '../stores/userStore'
import Colors from '../constants/Colors'

@inject("UserStore")
@observer
export default class Home extends Component{
    constructor(props){
        super(props);


    }

    componentDidMount(){
         // Set Status Bar page info here!
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
          });
        }
      

        componentWillUnmount() {
             // Unmount status bar info
            this._navListener.remove();
          }

    render(){
        const {firstname, email} = this.props.UserStore
        return(
                <View>
                    <SafeAreaView style={{flex: 0, backgroundColor: "white", }} />
                    <Text style={{fontSize: 28}}>Hello {firstname}! Your email is {email}.</Text>
                    <Button style={{backgroundColor: "#FF8708"}} textStyle={{color:"#FFFFFF"}} onPress={() => this.props.navigation.navigate('Profile')}>Go to Profile</Button>
                </View>
        )
    }
    
}