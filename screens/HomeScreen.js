import React, {Component} from 'react'
import {Fragment, View, ActivityIndicator, SafeAreaView, StatusBar, Platform, StyleSheet, Dimensions, Animated, TouchableOpacity} from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Icon from '../components/Icon'
import FilterButton from '../components/FilterButton'
import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Font from 'expo-font'
import * as Location from 'expo-location'

import Colors from '../constants/Colors'
import SearchFilter from '../components/SearchFilter'
import Times from '../constants/TimesAvailable'

import * as firebase from 'firebase'
import 'firebase/firestore';



//MobX Imports
import {inject, observer} from 'mobx-react/native'
import UserStore from '../stores/userStore'


@inject("UserStore")
@observer
export default class Home extends Component{
    _interval = 0;

    constructor(props){
        super(props);

        this.getCurrentLocation(true);


        var date = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let hour = date.getHours()
        let minute = date.getMinutes();
        let minutes = minute >= 10 ? minute.toString() : "0" + minute;

        var startTimes = [];
      for (var i = 0 ; i < Times[0].start.length; i++){
         startTimes.push({key: i, label: Times[0].start[i], labelFormatted: this.convertToCommonTime(Times[0].start[i])})
      }

      var endTimes = []
       for (var i = 0 ; i < Times[1].end.length; i++){
          endTimes.push({key: i, label: Times[1].end[i], labelFormatted: this.convertToCommonTime(Times[1].end[i])})
       }

        let filteredStarts = startTimes.filter((x) =>  parseInt(x.label) >= parseInt(hour+""+minutes) - 30)
        let filteredEnds = endTimes.filter((x) =>  parseInt(x.label) >= parseInt(hour+""+minutes) - 30)

        this.state = {
            rippleFadeAnimation: new Animated.Value(1),
            rippleScaleAnimation: new Animated.Value(0.8),

            inputFocus: false,
            searchedAddress: false,
            mapScrolled: false,
            searchFilterOpen: true,
            searchInputValue: '',
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
              },
              daySearched: {
                index: 0,
                dayName: days[(date.getDay())%7],
                dayNameAbbr: days[(date.getDay())%7].slice(0,3),
                monthName: months[date.getMonth()],
                monthNameAbbr: months[date.getMonth()].slice(0,3),
                dateName: (date.getDate()),
                dayValue: (date.getDay())%7,
                isEnabled: true,
            },
            timeSearched: [filteredStarts[0], filteredEnds[filteredEnds.length / 2]]

        }

        this.mapScrolling = false;

    }

   async componentDidMount(){
         // Set Status Bar page info here!
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            if(this.state.searchFilterOpen){
                StatusBar.setBarStyle('light-content', true);
                Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.tango900);
            }else{
                StatusBar.setBarStyle('dark-content', true);
                Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
            }
           
          });

          this.rippleAnimation();
          
    
        }

        mapLocationFunction = () => {
            this._interval = setInterval(() => {
                if(this.mapScrolling === false){
                  this.getCurrentLocation(false)
                //   console.log("Got new location")
                }
              }, 5000)
              
        }

        searchFilterTimeCallback = (timeData) => {
            this.setState({timeSearched: timeData})
        }

        searchFilterDayCallback = (dayData) => {
            this.setState({daySearched: dayData})
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

        convertToCommonTime = (t) => {
            let hoursString = t.substring(0,2)
            let minutesString = t.substring(2)
    
    
            
            let hours = parseInt(hoursString) == 0 ? "12" : parseInt(hoursString) > 12 ? (parseInt(hoursString) - 12).toString() : parseInt(hoursString);
            // let minutes = parseInt(minutesString)
            return(`${hours}:${minutesString} ${parseInt(hoursString) >= 12 ? 'PM' : 'AM'}`)
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
                searchedAddress: true,
                searchInputValue: det.description == "Current Location" ? "Current Location" : det.name,

            }));
         

        }

        onRegionChange = (region) => {
            clearInterval(this._interval)
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

            this.mapScrolling = false;
            this.mapLocationFunction();
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
                },
                searchInputValue: '',
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
                <SafeAreaView style={{flex: 1, position: 'relative', backgroundColor: this.state.searchFilterOpen ? Colors.tango500 : 'white'}}>
                    
                        <SearchFilter visible={this.state.searchFilterOpen} currentSearch={this.state.searchInputValue} timeCallback={(data) => this.searchFilterTimeCallback(data)} dayCallback={(data) => this.searchFilterDayCallback(data)}/>


                    <View style={{paddingHorizontal: 16, paddingBottom: this.state.searchFilterOpen ? 0 : 36, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}}>
                        <Text type="semiBold" numberOfLines={1} style={{flex: this.state.searchFilterOpen ? 0 : 4,fontSize: 24, paddingTop: 8}}>{this.state.searchFilterOpen ? "" : `Hello, ${firstname || 'traveler'}`}</Text>
                        <FilterButton 
                            onPress={() => this.setState({searchFilterOpen: !this.state.searchFilterOpen})}
                            searchFilterOpen={this.state.searchFilterOpen}
                            daySearched={this.state.daySearched}
                            timeSearched={this.state.timeSearched}
                        />
                    </View>
                    <View style={{flex: 1}}>
                    <MapView
                        provider={MapView.PROVIDER_GOOGLE}
                        mapStyle={DayMap}
                        style={styles.mapStyle}
                        onRegionChangeComplete={region =>  this.onRegionChange(region)}
                        onRegionChange={() => this.mapScrolling = true}
                        initialRegion={{
                            latitude: this.state.region.current.latitude || 37.8020,
                            longitude: this.state.region.current.longitude || -122.4486,
                            latitudeDelta:this.state.region.current.latitudeDelta || 0.025,
                            longitudeDelta: this.state.region.current.longitudeDelta || 0.025
                        }}
                        region={{
                            latitude: this.state.region.searched.latitude && !this.state.mapScrolled ? this.state.region.searched.latitude : this.state.region.current.latitude ? this.state.region.current.latitude : 37.8020,

                            longitude: this.state.region.searched.longitude  && !this.state.mapScrolled ? this.state.region.searched.longitude : this.state.region.current.longitude ? this.state.region.current.longitude : -122.4486,

                            latitudeDelta: this.state.region.searched.latitudeDelta  && !this.state.mapScrolled ? this.state.region.searched.latitudeDelta : this.state.region.current.latitudeDelta ? this.state.region.current.latitudeDelta : 0.025,

                            longitudeDelta: this.state.region.searched.longitudeDelta  && !this.state.mapScrolled ? this.state.region.searched.longitudeDelta : this.state.region.current.longitudeDelta ? this.state.region.current.longitudeDelta : 0.025,
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
                        <View style={{zIndex: 9, position: 'absolute', top: -16}}>
                            <GooglePlacesAutocomplete
                            placeholder='Search by destination...'
                            returnKeyType={'done'}  
                            
                            autofocus={false}
                            ref={(instance) => { this.GooglePlacesRef = instance }}
                            currentLocation={false}
                            minLength={2}
                            listViewDisplayed={false}
                            fetchDetails={true}
                            onPress={(data, details = null) => {console.log(details); this.onSelectAddress(details)}}
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
                                    this.mapLocationFunction();
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
                                    display: this.state.searchFilterOpen ? 'none' : 'flex',
                                    justifySelf: 'content',
                                    width: width,
                                    alignItems: "center",
                                },
                                textInputContainer:{
                                    width: width - 24,
                                    backgroundColor: "white",
                                    height: 48,
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    borderRadius: width/2, 
                                    // Shadow
                                    shadowColor: '#000', 
                                    shadowOpacity: 0.2, 
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
                                    // position: 'absolute',
                                    top: 8,
                                    width: width - 24,
                                    zIndex: 9,
                                    backgroundColor: 'white',
                                    // Shadow
                                    shadowColor: '#000', 
                                    shadowOpacity: 0.2, 
                                    shadowOffset:{width: 1, height: 1}, 
                                    shadowRadius: 4, 
                                    elevation: 12,
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
                        </View>
                        </View>
                {/* <View style={{ backgroundColor: 'green', flex: 1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}> */}
                  {/* <View style={{}}> */}
  
                   {/* </View> */}
                       
                </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    mapStyle:{
        zIndex: -999,
        position: "relative",
        flex: 1,
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
    },
    
})