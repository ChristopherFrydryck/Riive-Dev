import React, {Component} from 'react'
import {Fragment, View, ActivityIndicator, SafeAreaView, StatusBar, Platform, StyleSheet, Dimensions, Animated} from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Icon from '../components/Icon'
import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Font from 'expo-font'
import * as Location from 'expo-location'

import * as firebase from 'firebase'
import 'firebase/firestore';



//MobX Imports
import {inject, observer} from 'mobx-react/native'
import UserStore from '../stores/userStore'
import Colors from '../constants/Colors'

@inject("UserStore")
@observer
export default class Home extends Component{
    _interval = 0;

    constructor(props){
        super(props);

        this.state = {
            rippleFadeAnimation: new Animated.Value(1),
            rippleScaleAnimation: new Animated.Value(0.8),

            inputFocus: false,
            searchedAddress: false,
            mapScrolled: false,
            region: {
                searched: {
                    latitude: null,
                    longitude: null,
                    latitudeDelta: null,
                    longitudeDelta: null,
                },
                current: {
                    latitude: null,
                    longitude: null,
                    latitudeDelta: null,
                    longitudeDelta: null,
                }
              },
              currentLocation: {
                  description: "Current Location",
                  geometry: {
                      location: {
                          lat: null,
                          lng: null,
                      }
                  }
              }

        }

    }

   async componentDidMount(){
         // Set Status Bar page info here!
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
          });

          this.rippleAnimation();

          await this.getCurrentLocation(true);
          this._interval = setInterval(() => {this.getCurrentLocation(false)}, 5000)
    
        }

        rippleAnimation = () => {
            Animated.loop(
                    Animated.parallel([
                        Animated.timing(
                            this.state.rippleFadeAnimation,
                            {
                                toValue: 0,
                                duration: 1300,
                            }),
                        Animated.timing(
                            this.state.rippleScaleAnimation,
                                {
                                    toValue: 10,
                                    duration: 2000,
                                }),
                    ]),
            ).start()
        }

        getCurrentLocation = async(isFirstTime) => {
            try {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                  return;
                }
                let location = await Location.getCurrentPositionAsync({});
                if(isFirstTime){
                    this.setState(prevState => ({
                        region: {
                            ...prevState.region,
                            current: {
                                ...prevState.region.current,
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            }
                        },
                        currentLocation:{
                            ...prevState.currentLocation,
                            geometry: {
                                location: {
                                    lat: location.coords.latitude,
                                    lng: location.coords.longitude,
                                }
                            }
                        }
                        
                    }))
                }else{
                    this.setState(prevState => ({
                        currentLocation:{
                            ...prevState.currentLocation,
                            geometry: {
                                location: {
                                    lat: location.coords.latitude,
                                    lng: location.coords.longitude,
                                }
                            }
                        }
                    }))
                }
                
    
              } catch (error) {
                console.log(error);
              }
        }

        onSelectAddress = (det) => {
            this.setState(prevState => ({
                region: {
                    current: {
                        ...prevState.region.current,
                        latitude: det.geometry.location.lat,
                        longitude: det.geometry.location.lng
                    },
                    searched:{
                        ...prevState.region.current,
                        latitude: det.geometry.location.lat,
                        longitude: det.geometry.location.lng
                    }
                    
                },
                mapScrolled: false,
                searchedAddress: true
            }));
         

        }

        onRegionChange = (region) => {
            this.setState(prevState => ({
                region: {
                    ...prevState.region,
                    current: {
                        latitudeDelta: region.latitudeDelta,
                        longitudeDelta: region.longitudeDelta,
                        latitude: region.latitude,
                        longitude: region.longitude
                    }
                },
                mapScrolled: true,
            }))
        }

        clearAddress = () => {
            this.GooglePlacesRef.setAddressText("")
            this.setState(prevState => ({
                searchedAddress: false,
                region: {
                    ...prevState.region,
                    searched: {
                        ...prevState.region.current
                    },
                }
            }))
          }
      

        componentWillUnmount() {
             // Unmount status bar info
            this._navListener.remove();
            clearInterval(this._interval)
          }

    render(){
        const {width, height} = Dimensions.get('window')
        const {firstname, email} = this.props.UserStore
        
        return(
                <SafeAreaView style={{flex: 1}}>
                    
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        mapStyle={DayMap}
                        style={styles.mapStyle}
                        onRegionChangeComplete={region => this.onRegionChange(region)}
                        region={{
                            latitude: this.state.region.searched.latitude && !this.state.mapScrolled ? this.state.region.searched.latitude : this.state.region.current.latitude ? this.state.region.current.latitude : 37.8020,

                            longitude: this.state.region.searched.longitude && !this.state.mapScrolled ? this.state.region.searched.longitude : this.state.region.current.longitude ? this.state.region.current.longitude : -122.4486,

                            latitudeDelta: this.state.region.searched.latitudeDelta && !this.state.mapScrolled ? this.state.region.searched.latitudeDelta : this.state.region.current.latitudeDelta ? this.state.region.current.latitudeDelta : 0.025,

                            longitudeDelta: this.state.region.searched.longitudeDelta && !this.state.mapScrolled ? this.state.region.searched.longitudeDelta : this.state.region.current.longitudeDelta ? this.state.region.current.longitudeDelta : 0.025,
                        }}
                        pitchEnabled={false} 
                        rotateEnabled={false} 
                        zoomEnabled={true} 
                        scrollEnabled={true}
                        >
                        {this.state.currentLocation.geometry.location.lat && this.state.currentLocation.geometry.location.lng ? 
                       
                        <Marker 
                            anchor={{x: 0.5, y: 0.5}} // For Android          
                            coordinate={{
                                latitude: this.state.currentLocation.geometry.location.lat,
                                longitude: this.state.currentLocation.geometry.location.lng
                            }} 
                            style={{position: 'relative', width: 150, height: 150, alignItems: 'center', justifyContent: 'center'}}
                        >
                            {Platform.OS == "android" ?
                            <View style={[styles.circleMarker, {}]}>
                                <Animated.View style={[styles.circleMarker, { top: 0, left: 0, opacity: this.state.rippleFadeAnimation, transform:[{scale: this.state.rippleScaleAnimation},]}]}></Animated.View>
                            </View>
                            :
                            <View style={{width: 150, height: 150}}>
                                <View style={[styles.circleMarker,{ left: 63, top: 63}]}>
                                    <Animated.View style={[styles.circleMarker, { top: 0, left: 0, opacity: this.state.rippleFadeAnimation, transform:[{scale: this.state.rippleScaleAnimation}]}]}></Animated.View>
                                </View>
                            </View>
                            }
                            
                          
                        </Marker>
                     
                        : null}
                        {this.state.searchedAddress ?
                        <Marker 
                            coordinate={{
                            latitude: this.state.region.searched.latitude,
                            longitude: this.state.region.searched.longitude
                            }}   
                        />
                        : null }
                        </MapView>
                {/* <View style={{ backgroundColor: 'green', flex: 1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}> */}
                  {/* <View style={{}}> */}
                  <GooglePlacesAutocomplete
                      placeholder='Search by destination...'
                      returnKeyType={'done'}  
                      autofocus={false}
                      ref={(instance) => { this.GooglePlacesRef = instance }}
                      currentLocation={false}
                      minLength={2}
                      listViewDisplayed={false}
                      fetchDetails={true}
                      onPress={(data, details = null) => this.onSelectAddress(details)}
                      textInputProps={{
                        onFocus: () => {
                            this.setState({
                                inputFocus: true,
                            })
                            clearInterval(this._interval)
                        },
                        onBlur: () => {
                            this.setState({
                                inputFocus: false
                            })
                            this._interval = setInterval(() => {this.getCurrentLocation(false)}, 5000)
                        },
                        clearButtonMode: 'never'
                      }}
                      renderRightButton={() => 
                        <Icon 
                            iconName="x"
                            iconColor={Colors.cosmos500}
                            iconSize={24}
                            onPress={() => this.clearAddress()}
                            style={{ position: "relative", 
                            borderRadius: width/2, padding: 10, display: this.state.searchedAddress ? "flex" : "none"}}
                        />
                      }
                      query={{
                        key: 'AIzaSyBa1s5i_DzraNU6Gw_iO-wwvG2jJGdnq8c',
                        language: 'en'
                      }}
                      GooglePlacesSearchQuery={{
                          rankby: 'distance',
                          types: 'address',
                          components: "country:us"
                      }}
                      // GooglePlacesDetailsQuery={{ fields: 'geometry', }}
                      nearbyPlacesAPI={'GoogleReverseGeocoding'}
                      debounce={200}
                      predefinedPlacesAlwaysVisible={true}
                      enablePoweredByContainer={false}
                      predefinedPlaces={[this.state.currentLocation]}

                      styles={{
                          container:{
                            zIndex: 999,
                            marginTop: 20,
                            alignItems: "center",
                          },
                          textInputContainer:{
                            width: width - 24,
                            backgroundColor: "white",
                            height: 48,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            borderRadius: width/2, 
                            // overflow: 'hidden',
                            // Shadow
                            shadowColor: '#000', 
                            shadowOpacity: 0.4, 
                            shadowOffset:{width: 1, height: 1}, 
                            shadowRadius: 4, 
                            elevation: 12,
                          },
                          textInput:{
                              marginTop: 0, 
                              height: 40,
                              alignSelf: 'center',
                              paddingRight: 0,
                          },
                          listView:{
                            paddingVertical: 6,
                            borderRadius: 9,
                            position: 'absolute',
                            width: width - 24,
                            top: 56,
                            zIndex: 99,
                            backgroundColor: 'white'
                          },
                          predefinedPlacesDescription:{
                            color: Colors.fortune700,
                          },
                          separator:{
                            marginVertical: 2,
                          },
                        //   row:{
                        //       marginTop: 32, 
                        //   }
                      }}
                      
                      
                  />
                   {/* </View> */}
                       
                </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    mapStyle:{
        zIndex: -999,
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    circleMarker:{
        position: 'absolute',
        // top: (50+25)/2 + 4,
        // left: (50+25)/2 + 4,
        overflow: 'visible',
        height: 20,
        width: 20,
        backgroundColor: Colors.apollo300, 
        borderRadius: Dimensions.get('window').width/2, 
    } 
})