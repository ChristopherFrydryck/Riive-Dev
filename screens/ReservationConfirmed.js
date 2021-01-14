import React, { Component } from 'react';
import { Platform, Animated, Dimensions, StatusBar, SafeAreaView, crollView, View, StyleSheet, ActivityIndicator } from 'react-native';

import Button from '../components/Button'
import Text from '../components/Txt'
import Icon from '../components/Icon'

import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'

@inject("UserStore", "ComponentStore")
@observer
class ReservationConfirmed extends Component {

    static navigationOptions = {
        headerShown: false,
    }
    constructor(props){
        super(props);
    }

    render(){
        return(
            <SafeAreaView>
                <Text>SAVED</Text>
            </SafeAreaView>
        )
    }
}

export default ReservationConfirmed;