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
            searchedAddress: null,
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
                }
            }))

          } catch (error) {
            console.log(error);
          }
    
        }
      

        componentWillUnmount() {
             // Unmount status bar info
            this._navListener.remove();
          }

    render(){
        const {firstname, email} = this.props.UserStore
        return(
                <SafeAreaView>
                    <GooglePlacesAutocomplete
                        placeholder='Your Address...'
                        returnKeyType={'search'}
                        ref={(instance) => { this.GooglePlacesRef = instance }}
                        currentLocation={false}
                        minLength={2}
                        autoFocus={false}
                        listViewDisplayed={false}
                        fetchDetails={true}
                        onPress={(data, details = null) => this.onSelectAddress(details)}
                        textInputProps={{
                        clearButtonMode: 'never'
                        }}
                        renderRightButton={() => 
                        <Icon 
                        iconName="x"
                        iconColor={Colors.cosmos500}
                        iconSize={24}
                        onPress={() => this.clearAddress()}
                        style={{marginTop: 8, display: this.state.searchedAddress ? "flex" : "none"}}
                        />}
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
                        container: {
                            zIndex: 999,
                            border: 'none',
                            marginBottom: 8,
                        },
                        textInputContainer: {
                            zIndex: 999,
                            width: '100%',
                            display: 'flex',
                            alignSelf: 'center',
                            backgroundColor: "white",
                            marginTop: -6,
                            borderColor: '#eee',
                            borderBottomWidth: 2,
                            borderTopWidth: 0,
                            backgroundColor: "none"
                        },
                        textInput: {
                            zIndex: 999,
                            paddingRight: 0,
                            paddingLeft: 0,
                            paddingBottom: 0,
                            color: '#333',
                            fontSize: 18,
                            width: '100%'
                        },
                        description: {
                            zIndex: 999,
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            zIndex: 999,
                            color: '#1faadb'
                        }
                        
                        }}
                    />
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        mapStyle={DayMap}
                        style={styles.mapStyle}
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
                </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    mapStyle:{
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get("window").height,
    }  
})