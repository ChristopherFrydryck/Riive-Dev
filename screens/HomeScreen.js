import React, {Component} from 'react'
import {Fragment, View, ActivityIndicator, SafeAreaView, StatusBar, Platform, StyleSheet, Dimensions} from 'react-native'
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
    constructor(props){
        super(props);

        this.state = {
            inputFocus: false,
            searchedAddress: false,
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: null,
                longitudeDelta: null,
              },
        }

    }

    async componentDidMount(){
         // Set Status Bar page info here!
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
          });

          try {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              return;
            }
            let location = await Location.getCurrentPositionAsync({});
            this.setState(prevState => ({
                region: {
                    ...prevState.region,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },
                
            }))

          } catch (error) {
            console.log(error);
          }
    
        }

        onSelectAddress = (det) => {
            this.setState(prevState => ({
                region: {
                    ...prevState.region,
                    latitude: det.geometry.location.lat,
                    longitude: det.geometry.location.lng
                },
                searchedAddress: true
            }));
         

        }

        onRegionChange = (region) => {
            this.setState({
                region: {
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                    latitude: region.latitude,
                    longitude: region.longitude
                },
            })
        }

        clearAddress = () => {
            this.GooglePlacesRef.setAddressText("")
            this.setState(prevState => ({
                searchedAddress: false,
                region: {
                    ...prevState.region
                }
            }))
          }
      

        componentWillUnmount() {
             // Unmount status bar info
            this._navListener.remove();
          }

    render(){
        const {width, height} = Dimensions.get('window')
        const {firstname, email} = this.props.UserStore
        return(
                <SafeAreaView contentContainerStyle={{ flexGrow: 1 }}>
                    
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        mapStyle={DayMap}
                        style={styles.mapStyle}
                        onRegionChangeComplete={region => this.onRegionChange(region)}
                        region={{
                            latitude: this.state.region.latitude ? this.state.region.latitude : 37.8020,
                            longitude: this.state.region.longitude ? this.state.region.longitude : -122.4486,
                            latitudeDelta: this.state.region.latitudeDelta ? this.state.region.latitudeDelta : 0.025,
                            longitudeDelta: this.state.region.longitudeDelta ? this.state.region.longitudeDelta : 0.025,
                        }}
                        pitchEnabled={false} 
                        rotateEnabled={false} 
                        zoomEnabled={true} 
                        scrollEnabled={true}
                        >
                        {this.state.searchedAddress ?
                        <Marker 
                            coordinate={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude
                            }}   
                        />
                        : null }
                        </MapView>
                {/* <View style={{ backgroundColor: 'green', flex: 1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}> */}
                  <View style={{height: this.state.inputFocus ? 235 : 'auto'}}>
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
                        },
                        onBlur: () => {
                            this.setState({
                                inputFocus: false
                            })
                        },
                        clearButtonMode: 'never'
                      }}
                      renderRightButton={() => 
                        <Icon 
                            iconName="x"
                            iconColor={Colors.cosmos500}
                            iconSize={24}
                            onPress={() => this.clearAddress()}
                            style={{marginTop: 8, display: this.state.searchedAddress ? "flex" : "none"}}
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
                      

                      styles={{
                          listView:{
                            
                            backgroundColor: 'white'
                          }
                      }}
                      
                      
                  />
                   </View>
                       
                </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    mapStyle:{
        zIndex: -999,
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get("window").height,
    }  
})