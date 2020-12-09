import React, { Component } from 'react';
import { Animated, Dimensions, Text, StatusBar, ScrollView, View } from 'react-native';

import Image from '../components/Image'
import Colors from '../constants/Colors'

import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'


import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
    



@inject("UserStore", "ComponentStore")
@observer
class reserveSpace extends Component {
    _isMounted = false;

    static navigationOptions = {
        title: "Reserve Space",
        headerTitleStyle:{
            fontWeight: "300",
            fontSize: 18,
        }
    };

    constructor(props){
        super(props)
        this.state = {
            currentActivePhoto: 0
        }
    }

    componentDidMount(){

        this._isMounted = true;
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content', true);
           Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
         });
  
         
      }

    carouselUpdate = (xVal) => {
        const {width} = Dimensions.get('window')
    
        let newIndex = Math.round(xVal/width)
    
        // console.log(newIndex)
    
        this.setState({currentActivePhoto: newIndex})
    }

    renderDotsView = (numItems, position) => {
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
          const {width, height} = Dimensions.get("window");
          const { daySearched } = this.props.navigation.state.params.homeState;
          return(
              <View>
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        mapStyle={NightMap}
                        style={{width: width, aspectRatio:21/9}}
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
                    <Text>{daySearched.dayName}</Text>
                </View>
          )
      }
}

export default reserveSpace