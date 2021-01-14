import React, { Component } from 'react';
import { Platform, Animated, Dimensions, StatusBar, SafeAreaView, ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors'

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
        const {width, height} = Dimensions.get("window")
        return(
            <SafeAreaView style={styles.container}>
                
                <ScrollView 
                     stickyHeaderIndices={[0]}
                     contentContainerStyle={{flex: 1}}
                >
                    <View style={{flex: 0, flexDirection: 'row', zIndex: -1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 56, paddingRight: 80}}>
                            <Icon 
                                iconName="checkcircleo"
                                iconLib="AntDesign"
                                iconColor={Colors.fortune700}
                                iconSize={48}
                                // onPress={() => this.editAccountModal(!this.state.editAccountModalVisible)}
                                
                            />
                            <Text style={{fontSize: 28, fontWeight: '500', paddingLeft: 16, color: Colors.fortune700, lineHeight: 32}}>See you at 11 AM Leah.</Text>
                        </View>
                        <Text style={{fontSize: 16, textAlign: 'center', marginVertical: 16}}>We have emailed you a reciept at {this.props.UserStore.email}.</Text>
                    </View>
                    <View style={{backgroundColor: 'white', flex: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 24, zIndex: 99,}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Your Order</Text>
                            <Text>#XXXXXXXXXX</Text>
                        </View>
                    </View>          
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.mist500,
        flex: 1,
    }
})

export default ReservationConfirmed;