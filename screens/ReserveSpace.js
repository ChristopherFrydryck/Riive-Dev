import React, { Component } from 'react';
import { Animated, Dimensions, StatusBar, ScrollView, View, StyleSheet } from 'react-native';

import Text from '../components/Txt'
import Image from '../components/Image'
import Icon from '../components/Icon'
import Colors from '../constants/Colors'

import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'

// import { RadioButton } from 'react-native-paper';
import RadioList from '../components/RadioList'
import RadioButton from '../components/RadioButton'


import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import { TouchableWithoutFeedback } from 'react-native';
    



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
            currentActivePhoto: 0,
            hoursSpent: null,
            minutesSpent: null,
            
            serviceFeePercentage: .15, 

            price: null,
            priceCents: null,
            serviceFee: null,
            serviceFeeCents: null,
            total: null,
            totalCents: null,

            selectedVehicle: null,
            selectedPayment: null,
        }
        
    }

    async componentDidMount(){
        const { timeSearched } = this.props.navigation.state.params.homeState;

        await this.getDiffHours(timeSearched[0].label, timeSearched[1].label)

        await this.getPrice();


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

        setActivePayment = (payment, idOnly) => {
            if(idOnly){
                let activePayment = this.props.UserStore.payments.filter(x => x.PaymentID === payment)[0]

                this.setState({selectedPayment: {
                    CCV: activePayment.CCV,
                    CardType: activePayment.CardType,
                    Month: activePayment.Month,
                    Name: activePayment.Name,
                    PaymentID: activePayment.PaymentID,
                    StripeID: activePayment.StripeID,
                    Type: activePayment.Type,
                    Year: activePayment.Year
                }})
            }else{
                this.setState({selectedPayment: {
                    CCV: payment.CCV,
                    CardType: payment.CardType,
                    Month: payment.Month,
                    Name: payment.Name,
                    PaymentID: payment.PaymentID,
                    StripeID: payment.StripeID,
                    Type: payment.Type,
                    Year: payment.Year
                }})
            }
        }

        setActiveVehicle = (vehicle, idOnly) => {


            if(idOnly){
                let activeVehicle = this.props.UserStore.vehicles.filter(x => x.VehicleID === vehicle)[0]

                this.setState({selectedVehicle: {
                    Color: activeVehicle.Color,
                    LicensePlate: activeVehicle.LicensePlate,
                    Make: activeVehicle.Make,
                    Model: activeVehicle.Model,
                    VehicleID: activeVehicle.VehicleID,
                    Year: activeVehicle.Year,
                }})

                // this.setState({selectedVehicle: activeVehicle.VehicleID})
            }else{
                this.setState({selectedVehicle: {
                    Color: vehicle.Color,
                    LicensePlate: vehicle.LicensePlate,
                    Make: vehicle.Make,
                    Model: vehicle.Model,
                    VehicleID: vehicle.VehicleID,
                    Year: vehicle.Year,
                }})
                // // console.log(vehicle.VehicleID)
                // this.setState({selectedVehicle: vehicle.VehicleID})
            }
            
        }

    
        convertToCommonTime = (t) => {
            let hoursString = t.substring(0,2)
            let minutesString = t.substring(2)
    
    
            
            let hours = parseInt(hoursString) == 0 ? "12" : parseInt(hoursString) > 12 ? (parseInt(hoursString) - 12).toString() : parseInt(hoursString);
            // let minutes = parseInt(minutesString)
            return(`${hours}:${minutesString} ${parseInt(hoursString) >= 12 ? 'PM' : 'AM'}`)
        }

        getDiffHours = (arrive, depart) => {
            let arriveArray = arrive.split("").map(x => parseInt(x))
            let departArray = depart.split("").map(x => parseInt(x))
            let hoursArrive = parseInt(arriveArray[0] + "" + arriveArray[1]) 
            let hoursDepart = parseInt(departArray[0] + "" + departArray[1]) 
            let minutesArrive = parseInt(arriveArray[2] + "" + arriveArray[3]) 
            let minutesDepart = parseInt(departArray[2] + "" + departArray[3]) 

            

            this.setState({ hoursSpent: minutesDepart + 1 - minutesArrive == 60 ? (hoursDepart - hoursArrive) + 1 : hoursDepart - hoursArrive, minutesSpent: minutesDepart + 1 - minutesArrive == 60 ? 0 : 30})

        }

        getPrice = async() => {
            let price = (this.state.hoursSpent * this.props.ComponentStore.selectedExternalSpot[0].spacePriceCents) + (this.state.minutesSpent === 0 ? 0 : Math.ceil(this.props.ComponentStore.selectedExternalSpot[0].spacePriceCents / 2));

            
            var dollars = price / 100;
            dollars = dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});

            var dollarsServiceFee = price * this.state.serviceFeePercentage / 100;
            dollarsServiceFee = dollarsServiceFee.toLocaleString("en-US", {style:"currency", currency:"USD"});

            await this.setState({
                price: dollars, 
                priceCents: Math.ceil(price),
                serviceFee: dollarsServiceFee,
                serviceFeeCents: Math.ceil(price * this.state.serviceFeePercentage),
            })

            await this.setState({
                total: ((this.state.priceCents + this.state.serviceFeeCents) / 100).toLocaleString("en-US", {style:"currency", currency:"USD"}),
                totalCents: this.state.priceCents + this.state.serviceFeeCents
            })
        }

      render(){
          const {width, height} = Dimensions.get("window");
          const { region, searchedAddress, searchInputValue, daySearched, timeSearched, locationDifferenceWalking } = this.props.navigation.state.params.homeState;

          let vehicleArray = this.props.UserStore.vehicles.map(vehicle => {
            return(
                <RadioButton id={vehicle.VehicleID} title={`${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`} subTitle={`${vehicle.LicensePlate}`} selectItem={() => this.setActiveVehicle(vehicle, false)} />
            )
          })

       
          let paymentsArray = this.props.UserStore.payments.map(payment => {
              return(
                <RadioButton id={payment.PaymentID} title={`••••••••••••${payment.Number}`} subTitle={`${payment.CardType.charAt(0).toUpperCase() + payment.CardType.slice(1)}`} selectItem={() => this.setActivePayment(payment, false)} />
              )
          })

            // console.log(this.state.selectedVehicle)

        //   console.log(this.state.selectedVehicle ? this.state.selectedVehicle.VehicleID : null)
        //   console.log(`hours spent: ${this.state.hoursSpent} and minutes spent: ${this.state.minutesSpent}`)

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
                    {searchedAddress ? 
                    <View style={[styles.container, {paddingVertical: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.apollo700}]}>
                        <Icon 
                            iconName="walk"
                            iconColor={Colors.mist300}
                            iconSize={20}
                            iconLib="MaterialCommunityIcons"
                        />
                        <Text numberOfLines={1} style={{color: Colors.mist300, marginLeft: 8, flex: 1}}>{locationDifferenceWalking.duration} to {searchInputValue}</Text>
                    </View>
                    : null}


                    {/* Date and Time */}
                    <View style={styles.container}>
                        <Text type="light" numberOfLines={1} style={{marginTop: 16, fontSize: 24, textAlign: 'center'}}>{new Date().getDay() === daySearched.dayValue ? "Today" : daySearched.dayName}, {daySearched.monthName} {daySearched.dateName}{daySearched.dateName.toString().split("")[daySearched.dateName.toString().split("").length - 1] == 1 && (daySearched.dateName > 20 || daySearched < 3)  ? "st" : daySearched.dateName == 2  && (daySearched.dateName > 20 || daySearched < 3) ? "nd" : "th"}</Text>

                        <View style={{flexDirection: 'row', alignItems: "flex-end", justifyContent: 'space-between', marginTop: 16}}>
                            <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
                                <Text type="light" numberOfLines={1} style={{fontSize: 18}}>Arrival</Text>
                                <Text numberOfLines={1} style={{fontSize: 20, color: Colors.tango700}}>{this.convertToCommonTime(timeSearched[0].label)}</Text>
                            </View>
                            <Icon 
                                iconName="arrow-right"
                                iconColor={Colors.tango700}
                                iconSize={20}
                                iconLib="MaterialCommunityIcons"
                            />
                            <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
                                <Text type="light" numberOfLines={1} style={{fontSize: 18}}>Departure</Text>
                                <Text numberOfLines={1} style={{fontSize: 20, color: Colors.tango700}}>{this.convertToCommonTime(timeSearched[1].label)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Vehicles */}
                    {this.props.UserStore.vehicles.length > 0 ? 
                    <View style={[styles.container, {marginTop: 16}]}>
                        <Text type="medium" numberOfLines={1} style={{fontSize: 16}}>Vehicle</Text>
                        <RadioList activeItem={this.state.selectedVehicle ? this.state.selectedVehicle.VehicleID : null} selectItem={(option) => this.setActiveVehicle(option, true)}>
                            {vehicleArray}
                        </RadioList>
                    </View>
                    : null}

                    {/* Payments */}
                    {this.props.UserStore.payments.length > 0 ? 
                        <View style={[styles.container, {marginTop: 16}]}>
                            <Text type="medium" numberOfLines={1} style={{fontSize: 16}}>Payments</Text>
                            <RadioList activeItem={this.state.selectedPayment ? this.state.selectedPayment.PaymentID : null} selectItem={(option) => this.setActivePayment(option, true)}>
                            {paymentsArray}
                        </RadioList>
                        </View>
                    : null}

                    {/* Price Breakdown */}
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
                            <Text>Parking Fare</Text>
                            <Text>{this.state.price}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
                            <Text>Service Fee</Text>
                            <Text>{this.state.serviceFee}</Text>
                        </View>
                        <View
                            style={{
                                marginTop: 8,
                                borderBottomColor: Colors.cosmos300,
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
                            <Text type="medium" numberOfLines={1} style={{fontSize: 24}}>Total (USD)</Text>
                            <Text type="medium" numberOfLines={1} style={{fontSize: 24}}>{this.state.total}</Text>
                        </View>
                    </View>
                </View>
                
          )
      }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    }
})

export default reserveSpace