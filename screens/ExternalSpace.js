import React, { Component } from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, KeyboardAvoidingView, FlatList, Switch, Modal, Picker, Alert} from 'react-native';
import Text from '../components/Txt'

import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'

//For Shimmer
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, {Circle, Rect} from 'react-native-svg'


import Icon from '../components/Icon'
import Button from '../components/Button'
import Colors from '../constants/Colors'
import Image from '../components/Image'
import DayAvailabilityPicker from '../components/DayAvailabilityPicker'

import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'











@inject("UserStore", "ComponentStore")
@observer
class externalSpace extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            currentActivePhoto: 0,
            host: null
        }


    }

    componentDidMount(){
       this.getHost();

       this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('dark-content', true);
        Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
      });

       let add = "Hello"
       this.props.navigation.setParams({
        title: add.length > 20 ? add.substring(0,20) + "..." : add,
     });
    }

    getHost = () => {
        let {selectedExternalSpot} = this.props.ComponentStore;
        const db = firebase.firestore();

        
        // // if(doc.exists){

            if(selectedExternalSpot[0].listingID){
                db.collection("users").where(firebase.firestore.FieldPath.documentId(), "==", selectedExternalSpot[0].hostID).get().then((qs) => {
                    this.setState({host: qs.docs[0].data()})
                })
            }else{
                console.log("User not found")
            }         
    }

    carouselUpdate = (xVal) => {
        const {width} = Dimensions.get('window')
    
        let newIndex = Math.round(xVal/width)
    
        // console.log(newIndex)
    
        this.setState({currentActivePhoto: newIndex})
    }
    
    
    renderDotsView = (numItems, position) =>{
        var arr = [];
        for(let i = 0; i <= numItems - 1; i++){
            arr.push(
                <Animated.View 
                    key={i}
                    style={{ opacity: position == i ? 1 : 0.3, height: 8, width: 8, backgroundColor: Colors.cosmos900, margin: 2, borderRadius: 8 }}
                  />
            )
        }
    
        return(arr)
        
        }



    render(){
        const {width, height} = Dimensions.get("window")
        if(this.state.host && true){
       
        return(
            <SafeAreaView  style={{flexGrow: 1}}>
            <View>
                <ScrollView
                        horizontal={true}
                        pagingEnabled={true}
                        scrollEnabled={true}
                        decelerationRate={0}
                        snapToAlignment="start"
                        snapToInterval={width}
                        onScroll={data =>  this.carouselUpdate(data.nativeEvent.contentOffset.x)}
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        // persistentScrollbar={true}
                    >
                    <View>
                    <Image 
                            style={{width: width}}
                            aspectRatio={16/9}
                            source={{uri: this.props.ComponentStore.selectedExternalSpot[0].photo}}
                            resizeMode={'cover'}
                        /> 
                        </View>
                        <View>
                        <View  style={{ position:'absolute', width: width, aspectRatio: 16/9, zIndex: 9}}/>
                            <MapView
                            provider={MapView.PROVIDER_GOOGLE}
                            mapStyle={NightMap}
                            style={{width: width, aspectRatio:16/9}}
                            region={{
                            latitude: this.props.ComponentStore.selectedExternalSpot[0].region.latitude,
                            longitude: this.props.ComponentStore.selectedExternalSpot[0].region.longitude,
                            latitudeDelta: this.props.ComponentStore.selectedExternalSpot[0].region.latitudeDelta,
                            longitudeDelta: this.props.ComponentStore.selectedExternalSpot[0].region.longitudeDelta,
                            }}
                            pitchEnabled={false} 
                            rotateEnabled={false} 
                            zoomEnabled={false} 
                            scrollEnabled={false}
                            >
                                <Marker 
                                    coordinate={{
                                    latitude: this.props.ComponentStore.selectedExternalSpot[0].region.latitude,
                                    longitude: this.props.ComponentStore.selectedExternalSpot[0].region.longitude
                                    }}   
                                />
                            </MapView>
                        </View>
                    </ScrollView>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8}}>
                        {this.renderDotsView(2, this.state.currentActivePhoto)}
                    </View>
                  </View>
                
                  <View style={styles.contentBox}>
                    <View style={{width: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.fortune500, paddingVertical: 4, borderRadius: width, marginBottom: 8}}>
                                <Text style={{ fontSize: 16, color: Colors.mist300,}}>{this.props.ComponentStore.selectedExternalSpot[0].spacePrice}/hr</Text>
                    </View>
                  
                        <Text  style={{fontSize: 24, flexWrap: 'wrap'}}>{this.props.ComponentStore.selectedExternalSpot[0].spaceName}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8}}>
                            <Icon
                                iconName="user"
                                
                                iconColor={Colors.cosmos300}
                                iconSize={16}
                                style={{marginRight: 8, marginTop: 4}}
                            />
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("ExternalProfile")}><Text>Hosted by <Text style={{textDecorationLine: 'underline'}}>{this.state.host.firstname} {this.state.host.lastname.charAt(0).toUpperCase()}</Text>.</Text></TouchableWithoutFeedback>
                        </View>
                        {this.props.ComponentStore.selectedExternalSpot[0].spaceBio.split("").length > 0 ? 
                        <View style={{flexDirection: 'row'}}>
                            <Icon
                                iconName="form"
                                iconLib="AntDesign"
                                iconColor={Colors.cosmos300}
                                iconSize={16}
                                style={{marginRight: 8, marginTop: 4}}
                            />
                            <Text style={{flex: 1}}>{this.props.ComponentStore.selectedExternalSpot[0].spaceBio}</Text>
                        </View>
                        : null}
                        
                
                       

                      
                        <View style={{marginTop: 32}}>
                            <DayAvailabilityPicker 
                                availability={this.props.ComponentStore.selectedExternalSpot[0].availability}
                                availabilityCallback={() => {}}
                                editable={false}
                            />
                        </View>
                        
                    
                  
                  </View>
                  </SafeAreaView>
        )
        }else{
            return(
                <SvgAnimatedLinearGradient width={Dimensions.get('window').width} height={height}>
                        <Rect x="0" width={width} height={width / 1.7777777} rx="0" ry="0" />
                        <Rect x="16" y={width / 1.77777777 + 24} width="100" height="35" rx="20" ry="20" />
                        <Rect x="16" y={width / 1.77777777 + 67} width={width  * .75} height="36" />
                        <Rect x="16" y={width / 1.77777777 + 112} width={width  * .45} height="24" />
                        <Rect x="16" y={width / 1.77777777 + 144} width={width - 32} height="24" />
                        <Rect x="16" y={width / 1.77777777 + 176} width={width  * .65} height="24" />
                </SvgAnimatedLinearGradient>
            )
        }
    }


}

const styles = StyleSheet.create({
    contentBox:{
        marginHorizontal: 16,  
      
      },
})

export default externalSpace;