import React, { Component } from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, SafeAreaView, Dimensions, Animated, KeyboardAvoidingView, FlatList, Switch, Modal, Picker} from 'react-native';
import Text from '../components/Txt'
import MapInput, { PROVIDER_GOOGLE } from '../components/MapInput'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';
import DayMap from '../constants/DayMap'
import NightMap from '../constants/NightMap'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Card, ThemeProvider} from 'react-native-paper';

import ImageBrowser from '../features/camera-roll/ImageBrowser'
import * as ImagePicker from 'expo-image-picker'
import RNImagePicker from 'react-native-image-crop-picker';
import * as Permissions from 'expo-permissions'



import Input from '../components/Input'
import Icon from '../components/Icon'
import Button from '../components/Button'
import Colors from '../constants/Colors'
import Image from '../components/Image'
import ClickableChip from '../components/ClickableChip';
import DayAvailabilityPicker from '../components/DayAvailabilityPicker'
import { LinearGradient } from 'expo-linear-gradient'

import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'










@inject("UserStore", "ComponentStore")
@observer
class editSpace extends Component {
  _isMounted = false;

  static navigationOptions = {
    title: "Edit Space",
    headerTitleStyle:{
        fontWeight: "300",
        fontSize: 18,
    }

};


    constructor(props){
        super(props)

        // listingID: spot.postID,
//                 address: spot.address,
//                 region: spot.region,
//                 photo: spot.photo,
//                 spaceName: spot.spaceName,
//                 spaceBio: spot.spaceBio,
//                 spacePrice: spot.spacePrice,
//                 spacePriceCents: spot.spaceCents,
//                 numSpaces: spot.numSpaces,
//                 availability: spot.daily,

        const {selectedSpot} = this.props.ComponentStore
        const space = selectedSpot[0]

        this.state = {

            currentActivePhoto: 0,


            postID: space.postID,
            region: {
              latitude: space.region.latitude,
              longitude: space.region.longitude,
              latitudeDelta: space.region.latitudeDelta,
              longitudeDelta: space.region.longitudeDelta,
            },
            address: {
              full: space.address.full,
              number: space.address.number,
              street: space.address.street,
              box: space.address.box,
              city: space.address.city,
              county: space.address.county,
              state: space.address.state,
              state_abbr: space.address.state_abbr,
              country: space.address.country,
              country_abbr: space.address.country_abbr,
              zip: space.address.zip,
              spaceNumber: space.address.spaceNumber,
            },
            
            searchedAddress: true,
            nameValid: true,
            bioValid: true,
            priceValid: true,

            nameError: '',
            bioError: '',
            priceError: '',

    
            


            imageBrowserOpen: false,
            uploadingImage: false,
            photo: space.photo,

            savingSpace: false,
            

            spaceName: space.spaceName,
            spaceBio: space.spaceBio,
            spacePrice: space.spacePrice,
            spacePriceCents: space.spacePriceCents,
            numSpaces: space.numSpaces,

            daily: space.availability
            
        }
    }

    async componentDidMount(){
      // Set Status Bar page info here!
      const db = firebase.firestore();
      const ref = db.collection("spaces").doc();
      this.setState({postID: ref.id})
      this._isMounted = true;
     this._navListener = this.props.navigation.addListener('didFocus', () => {
         StatusBar.setBarStyle('dark-content', true);
         Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
       });

       
    }

    getPermissionAsync = async (...perms) => {
      if (Platform.OS == 'ios') {
        const { status } = await Permissions.askAsync(...perms);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    };

    pickImage = async () => {
      const permissions = [Permissions.CAMERA_ROLL];
      let isGranted = true;
        
      for(let i = 0; i < permissions.length; i++){
        let perms = await Permissions.askAsync(permissions[i]);
        console.log(permissions[i], perms.status)

        if(perms.status != 'granted'){
          isGranted = false;
          break;
        }else{
          isGranted = true;
          continue;
        }
      }

      if(isGranted === true){
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.5,
          // base64: true,
        });

        this.setState({imageUploading: true, photo: result.uri})
    
    
        if (!result.cancelled) {
            
                  try {
                      // alert("Success!")
                      this.setState({imageUploading: false})
                  }
                  catch {
                      alert("Failed to upload image. Please try again.")
                      this.setState({imageUploading: false})
                  }
          
        }else{
            this.setState({imageUploading: false})
        }
      }else{
        this.getPermissionAsync(Permissions.CAMERA_ROLL)
      }
    };


      launchCamera = async () => {
      const permissions = [Permissions.CAMERA, Permissions.CAMERA_ROLL];
      let isGranted = false;

      
        
      for(let i = 0; i < permissions.length; i++){
        let perms = await Permissions.askAsync(permissions[i]);
        console.log(permissions[i], perms.status)

        if(perms.status != 'granted'){
          isGranted = false;
          break;
        }else{
          isGranted = true;
          continue;
        }
      }

      
      

      if(isGranted === true){
       
        try{
          RNImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            console.log(image);
          });
        }catch(e){
          console.log(e)
        }
        
        // let result = await ImagePicker.launchCameraAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsEditing: true,
        //   aspect: [16, 9],
        //   quality: 0.5,
        //   // base64: true,
        // });

        // this.setState({imageUploading: true, photo: result.uri})
    
    
        // if (!result.cancelled) {
            
        //           try {
        //               alert("Success!")
        //               this.setState({imageUploading: false})
        //           }
        //           catch {
        //               alert("Failed to upload image. Please try again.")
        //               this.setState({imageUploading: false})
        //           }
          
        // }else{
        //     console.log("No result.")
        //     this.setState({imageUploading: false})
        // }
      }else{
        this.getPermissionAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA)
      }
    }



  uploadImage = async (uri) => {
    const db = firebase.firestore();
    const doc = db.collection('users').doc(this.props.UserStore.userID);



      const response = await fetch(uri)
      const blob = await response.blob()

      const storageRef = await firebase.storage().ref().child("listings/" + this.state.postID + '/main')

     await storageRef.put(blob)

     const url = await storageRef.getDownloadURL();

      this.setState({photo: url})
     
      // const url = uploadTask.getDownloadURL();
        
      // this.setState({photo: url})
      // return url
          
    



     
    
  }

  verifyInputs = () => {

    const nameValidation = /^[A-Za-z0-9]+[A-Za-z0-9 %&,()]+[A-Za-z0-9]{1}$/
    const bioValidation =  /^[A-Za-z0-9]{1}[A-Za-z0-9 .?!;,()$@%&]{1,299}$/;

    let nameValid = nameValidation.test(this.state.spaceName)
    let bioValid = this.state.spaceBio.split("").length > 0 ? bioValidation.test(this.state.spaceBio) : true;

    if(this.state.spacePrice){
      let spaceCentsArray = this.state.spacePrice.split(".")
      let spaceCents = parseInt(spaceCentsArray[0].slice(1) + spaceCentsArray[1])
        if(spaceCents > 0){
          this.setState({spacePriceValid: true, priceError: ''})
          // console.log("Price is valid")
        }else{
          this.setState({spacePriceValid: false, priceError: 'Price must be greater than $0.00'})
          // console.log("Price must be greater than $0.00")
        }
    }else{
      this.setState({spacePriceValid: false, priceError: 'Add an hourly price'})
      // console.log("Add a price per hour")
    }

    if(nameValid && this.state.spaceName.length > 0){
      this.setState({nameValid: true, nameError: ''})
    }else{
      this.setState({nameValid: false})
      if(this.state.spaceName.length == 0){
        this.setState({nameError: 'Add a name to your space'})
      }else if(!nameValid){
        this.setState({nameError: 'Avoid using special characters'})
      }
      
    }

    if(bioValid){
      this.setState({bioValid: true, bioError: ''})
    }else{
      this.setState({bioValid: false, bioError: 'Avoid use of special characters outside of .?!;,()$@%&'})
    }
  }

  submitSpace = async() => {
    
    await this.verifyInputs();

    const db = firebase.firestore();

    console.log(this.state.postID)


    

    

      if(this.state.searchedAddress && this.state.spacePrice && this.state.nameValid && this.state.bioValid && this.state.photo){

       

        // console.log(`${this.state.address.number} ${this.state.address.street}${this.state.address.box && this.state.address.box.split('').length > 0 ? " APT #" + this.state.address.box :""}, ${this.state.address.city}, ${this.state.address.state_abbr} ${this.state.address.zip}...${this.state.address.country}`)
        // console.log(`${this.state.address.spaceNumber}`)
                await this.uploadImage(this.state.photo)
                this.setState({savingSpace: true})
                try{  

                let spaceCentsArray = this.state.spacePrice.split(".")
                let spaceCents = parseInt(spaceCentsArray[0].slice(1) + spaceCentsArray[1])

                let createdTime = new Date().getTime();
                 
                 console.log(this.state.photo)
                 await this.setState({savingSpace: true})

                 await db.collection("users").doc(this.props.UserStore.userID).update({
                    listings: firebase.firestore.FieldValue.arrayUnion(
                      this.state.postID
                    )
                 })
                 await db.collection("listings").doc(this.state.postID).set({
                  
                      listingID: this.state.postID,
                      address: this.state.address,
                      region: this.state.region,
                      photo: this.state.photo,
                      spaceName: this.state.spaceName,
                      spaceBio: this.state.spaceBio,
                      spacePrice: this.state.spacePrice,
                      spacePriceCents: spaceCents,
                      numSpaces: this.state.numSpaces,
                      availability: this.state.daily,
                      created: createdTime
                 
               })

               // add space to mobx UserStore
               await this.props.UserStore.listings.push({
                  listingID: this.state.postID,
                  address: this.state.address,
                  region: this.state.region,
                  photo: this.state.photo,
                  spaceName: this.state.spaceName,
                  spaceBio: this.state.spaceBio,
                  spacePrice: this.state.spacePrice,
                  spacePriceCents: spaceCents,
                  numSpaces: this.state.numSpaces,
                  availability: this.state.daily,
                  created: createdTime
               })

                  // navigate back to profile
                  this.props.navigation.navigate("Profile")
                  this.setState({savingSpace: false})
                }catch{
                  this.setState({savingSpace: false})
                }
                
            
               
               
              
           
                

      }else{
        this.setState({savingSpace: false})
      }
  
     
      // console.log(`The price is ${this.state.spacePrice}`)
    }
    
  


  availabilityCallbackFunction = (data) => {
    this.setState({daily: data})
  }
   


       
   

     componentWillUnmount() {
      this._isMounted = false;
          // Unmount status bar info
         this._navListener.remove();
       }

      getCoordsFromName(loc) {
        this.setState({
          latitude: loc.lat,
          longitude: loc.lng,
        })
      }

      imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          console.log(photos)
          this.setState({
            imageBrowserOpen: false,
            photos: photos,
          })
        }).catch((e) => console.log(e))
      }


onSelectAddress = (det) => {
  // console.log(det.formatted_address)
  // console.log(det.geometry.location.lat);
  // console.log(det.address_components)
  
  var number = det.address_components.filter(x => x.types.includes('street_number'))[0]
  var street = det.address_components.filter(x => x.types.includes('route'))[0]
  var city = det.address_components.filter(x => x.types.includes('locality'))[0]
  var county = det.address_components.filter(x => x.types.includes('administrative_area_level_2'))[0]
  var state = det.address_components.filter(x => x.types.includes('administrative_area_level_1'))[0]
  var country = det.address_components.filter(x => x.types.includes('country'))[0]
  var zip = det.address_components.filter(x => x.types.includes('postal_code'))[0]

  


  


  this.setState(prevState => ({
    searchedAddress: true,
    region:{
      latitude: det.geometry.location.lat,
      longitude: det.geometry.location.lng,
      latitudeDelta: .006,
      longitudeDelta: .006
    },
    address:{
      ...prevState.address,
      full: det.formatted_address,
      number: number.long_name,
      street: street.long_name,
      city: city.long_name,
      county: county.long_name,
      state: state.long_name,
      state_abbr: state.short_name,
      country: country.long_name,
      zip: zip.long_name,
    }
  }))



  
}

clearAddress = () => {
  this.GooglePlacesRef.setAddressText("")
  this.setState(prevState => ({
    searchedAddress: false,
    address:{
      ...prevState.address,
      full: null,
      number: null,
      street: null,
      city: null,
      county: null,
      state: null,
      state_abbr: null,
      country: null,
      zip: null,
    }
  }))
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



  render() {
    //   console.log(this.props.ComponentStore.selectedSpace)
      const {width, height} = Dimensions.get('window')
      
      return(
        <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }} scrollEnabled
              enableOnAndroid={true}
              extraScrollHeight={150} //iOS
              extraHeight={135} //Android
              >
          <View>
            <ScrollView
                horizontal={true}
                pagingEnabled={true}
                scrollEnabled={true}
                decelerationRate={0}
                snapToAlignment="start"
                snapToInterval={Dimensions.get("window").width}
                onScroll={data =>  this.carouselUpdate(data.nativeEvent.contentOffset.x)}
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                // persistentScrollbar={true}
            >
            <View>
            <Image 
                    style={{width: width}}
                    aspectRatio={16/9}
                    source={{uri: this.state.photo}}
                    backupSource={require('../assets/img/Logo_001.png')}
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
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                    }}
                    pitchEnabled={false} 
                    rotateEnabled={false} 
                    zoomEnabled={false} 
                    scrollEnabled={false}
                    >
                        <Marker 
                            coordinate={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude
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
                        <Text style={{ fontSize: 16, color: Colors.mist300,}}>{this.state.spacePrice}/hr</Text>
            </View>
            {/* <ClickableChip
                    onPress={() => console.log("test")}
                    bgColor='rgba(255, 193, 76, 0.3)' // Colors.Tango300 with opacity of 30%
                    textColor={Colors.tango700}
                >
                    Edit Space
                </ClickableChip> */}
                <Text  style={{fontSize: 24, flexWrap: 'wrap'}}>{this.state.spaceName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8}}>
                    <Icon
                        iconName="location-pin"
                        iconLib="Entypo"
                        iconColor={Colors.cosmos300}
                        iconSize={16}
                        style={{marginRight: 8, marginTop: 4}}
                    />
                    <Text style={{fontSize: 16, color: Colors.cosmos300,  flexWrap: 'wrap', marginRight: 24}}>{this.state.address.full} {this.state.address.box ? "#"+this.state.address.box : null}</Text>
                </View>
                {this.state.spaceBio ? 
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-start', flexShrink: 1}}>
                    <Icon
                        iconName="form"
                        iconLib="AntDesign"
                        iconColor={Colors.cosmos300}
                        iconSize={16}
                        style={{marginRight: 8, marginTop: 4}}
                    />
                    <Text style={{fontSize: 16, color: Colors.cosmos300, marginRight: 24}}>{this.state.spaceBio}</Text> 
                </View>
                : null}

               
                <View style={{marginTop: 32}}>
                    <DayAvailabilityPicker 
                        availability={this.state.daily}
                        availabilityCallback={this.availabilityCallbackFunction}
                    />
                </View>
                
            
           
          </View>
          
        </KeyboardAwareScrollView>
      )

//     var numSpacesArray = Array.from(Array(10), (_, i) => i + 1)

//     return (
//       <KeyboardAwareScrollView
//       keyboardShouldPersistTaps="handled"
//       contentContainerStyle={{ flexGrow: 1 }} scrollEnabled
//       enableOnAndroid={true}
//       extraScrollHeight={150} //iOS
//       extraHeight={135} //Android
//       >
//       {/* <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow : 1}}>
//          <SafeAreaView style={{backgroundColor: "white", }} /
//       > */}

//       <Modal 
//         visible={this.state.imageBrowserOpen} animationType="fade"
//         transparent={true}
//       >
//         <View>
//         <View style={{height: 200, backgroundColor: 'rgba(0,0,0,0.5)'}}/>
//         <View style={{
//           flex: 1,
//           flexDirection: 'column',
//           justifyContent: 'flex-start',
//           alignItems: 'center'}}>
            
//             <View style={{height: Dimensions.get('window').height - 200, backgroundColor: 'white'}}>
//             <ImageBrowser max={5} callback={this.imageBrowserCallback}/>
//          </View>
//         </View>
//         </View>
//       </Modal>


//          <KeyboardAvoidingView 
         
//          behavior={Platform.OS === 'ios' ? "padding" : null} 
//             keyboardVerticalOffset={250}
//             enabled 
//           >
        
       
//           <View style={styles.numHoriz}>
//             <View style={styles.numContainer}>
//               <Text style={styles.number} type="bold">1</Text>
//             </View>
//             <Text style={styles.numTitle}>Add Your Address</Text>
//           </View>
          
//           <View style={{flex: 1, paddingHorizontal: 16}}>
//             <Text style={styles.label}>Address</Text>
//             <GooglePlacesAutocomplete
//             placeholder='Your Address...'
//             returnKeyType={'search'}
//             ref={(instance) => { this.GooglePlacesRef = instance }}
//             currentLocation={false}
//             minLength={2}
//             autoFocus={false}
//             listViewDisplayed={false}
//             fetchDetails={true}
//             onPress={(data, details = null) => this.onSelectAddress(details)}
//             textInputProps={{
//               clearButtonMode: 'never'
//             }}
//             renderRightButton={() => 
//             <Icon 
//               iconName="x"
//               iconColor={Colors.cosmos500}
//               iconSize={24}
//               onPress={() => this.clearAddress()}
//               style={{marginTop: 8, display: this.state.searchedAddress ? "flex" : "none"}}
//             />}
//             query={{
//               key: 'AIzaSyBa1s5i_DzraNU6Gw_iO-wwvG2jJGdnq8c',
//               language: 'en'
//             }}
//             GooglePlacesSearchQuery={{
//               rankby: 'distance',
//               type: 'geocode'
//             }}
//             // GooglePlacesDetailsQuery={{ fields: 'geometry', }}
//             nearbyPlacesAPI={'GoogleReverseGeocoding'}
//             debounce={200}
//             predefinedPlacesAlwaysVisible={true}
//             enablePoweredByContainer={false}
            
            
//             styles={{
//               container: {
//                 border: 'none',
//                 marginBottom: 8,
//               },
//               textInputContainer: {
//                 width: '100%',
//                 display: 'flex',
//                 alignSelf: 'center',
//                 backgroundColor: "white",
//                 marginTop: -6,
//                 borderColor: '#eee',
//                 borderBottomWidth: 2,
//                 borderTopWidth: 0,
//                 backgroundColor: "none"
//               },
//               textInput: {
//                 paddingRight: 0,
//                 paddingLeft: 0,
//                 paddingBottom: 0,
//                 color: '#333',
//                 fontSize: 18,
//                 width: '100%'
//               },
//               description: {
//                 fontWeight: 'bold'
//               },
//               predefinedPlacesDescription: {
//                 color: '#1faadb'
//               }
              
//             }}
//             />
//             <View style={{flex: 1, flexDirection: "row"}}>
//             <Input
//             flex={0.35}
//             placeholder='107'        
//             label= "Apt # (optional)"
//             name="Apartment number" 
//             style={{marginRight: 16}}                
//             onChangeText= {(number) => this.setState(prevState => ({
//               address:{
//                 ...prevState.address,
//                 box: number,
//               }
//             }))}
//             value={this.state.address.box}
//             maxLength = {6}
//             keyboardType='number-pad'/>
//             <Input
//             flex={0.45}
//             placeholder='32'        
//             label= "Space # (optional)"
//             name="Space number"                 
//             onChangeText= {(number) => this.setState(prevState => ({
//               address:{
//                 ...prevState.address,
//                 spaceNumber: number,
//               }
//             }))}
//             value={this.state.address.spaceNumber}
//             maxLength = {6}
//             keyboardType='number-pad'/>
//             </View>
//           </View>
//           <MapView
//             provider={MapView.PROVIDER_GOOGLE}
//             mapStyle={NightMap}
//             style={styles.mapStyle}
//             region={{
//               latitude: this.state.region.latitude ? this.state.region.latitude : 37.8020,
//               longitude: this.state.region.longitude ? this.state.region.longitude : -122.4486,
//               latitudeDelta: this.state.region.latitudeDelta ? this.state.region.latitudeDelta : 0.025,
//               longitudeDelta: this.state.region.longitudeDelta ? this.state.region.longitudeDelta : 0.025,
//             }}
//             pitchEnabled={false} 
//             rotateEnabled={false} 
//             zoomEnabled={false} 
//             scrollEnabled={false}
//             >
//               {this.state.searchedAddress ?
//               <Marker 
//                 coordinate={{
//                   latitude: this.state.region.latitude,
//                   longitude: this.state.region.longitude
//                 }}   
//               />
//               : null }
//             </MapView>

//             <View style={styles.numHoriz}>
//             <View style={styles.numContainer}>
//               <Text style={styles.number} type="bold">2</Text>
//             </View>
//             <Text style={styles.numTitle}>Stand Out!</Text>
//           </View>
//           <View style={{paddingHorizontal: 16}}>
//             <Input 
//               placeholder='Name your space...'         label="Space Name"
//               name="space name"                 
//               onChangeText= {(spaceName) => this.setState({spaceName})}
//               value={this.state.spaceName}
//               maxLength = {40}
//               keyboardType='default'
//               error={this.state.nameError}
//             />
//              <Input 
//               placeholder='Add a bio...'         
//               label="Space Bio (optional)"
//               name="space bio"                 
//               onChangeText= {(spaceBio) => this.setState({spaceBio})}
//               value={this.state.spaceBio}
//               mask="multiline"
//               numLines={4}
//               maxLength = {300}
//               keyboardType='default'
//               error={this.state.bioError}
//             />
            
//           </View>
//           <View style={styles.numHoriz}>
//             <View style={styles.numContainer}>
//               <Text style={styles.number} type="bold">3</Text>
//             </View>
//             <Text style={styles.numTitle}>Upload Photo</Text>
//           </View>
//           <View style={{paddingHorizontal: 16}}>
//             <View style={{display: "flex", flexDirection: 'row', marginBottom: 16}}>
//               <Button style={this.state.photo ? {flex: 1, marginLeft: 8, backgroundColor: Colors.mist900} :{flex: 1, marginLeft: 8, backgroundColor: "#FF8708"}} textStyle={ this.state.photo ? {color: Colors.cosmos300} : {color:"#FFFFFF"}} disabled={this.state.photo ? true : false} onPress={() => this.pickImage()}>Add Photo</Button>
//               <Button style={this.state.photo ? {flex: 1, marginLeft: 8, backgroundColor: Colors.mist900} :{flex: 1, marginLeft: 8, backgroundColor: "#FF8708"}} textStyle={ this.state.photo ? {color: Colors.cosmos300} : {color:"#FFFFFF"}} disabled={this.state.photo  ? true : false} onPress={() => this.launchCamera()}>Take Photo</Button>
//             </View>
//           {/* <Text>Upload Pictures</Text> */}
//           {/* <View style={{display: 'flex', flexDirection: 'row', marginBottom: 16}}> */}
//               {/* <Button style={{flex: 1, marginRight:4, backgroundColor: "#FF8708"}} textStyle={{color:"#FFFFFF"}} onPress={() => alert("Something...")}>Upload Image</Button>
//               <Button style={{flex: 1, marginLeft:4, borderColor: "#FF8708", borderWidth: 3}} textStyle={{color:"#FF8708"}} onPress={() => alert("Something...")}>Take Photo</Button> */}
//             {/* </View> */}
//             {this.state.photo ? 
//             <View>
//               <View style={{position: "absolute", top: 8, right: 8, zIndex: 999, padding: 4, backgroundColor: 'rgba(54, 55, 59, 0.7)', borderRadius: Dimensions.get('window').width/2}}>
//                 <Icon 
//                   iconName="x"
//                   iconColor={Colors.mist300}
//                   iconSize={24}
//                   onPress={() => this.setState({photo: null})}
//                 />
//               </View>
//               <Image 
//                 style={{width: Dimensions.get("window").width - 32}}
//                 aspectRatio={16/9}
//                 source={{uri: this.state.photo}}
//                 backupSource={require('../assets/img/Logo_001.png')}
//                 resizeMode={'cover'}
//               /> 
//               </View>
//               : null}
          
            
//             </View>


//             {/* <Input 
//               placeholder='Please park to the far right of the driveway...'         
//               label="Message for Guests (optional)"
//               name="guest message"                 onChangeText= {(spaceName) => this.setState({spaceName})}
//               value={this.state.spaceName}
//               mask="multiline"
//               numLines={4}
//               maxLength = {300}
//               keyboardType='default'
//               // error={}
//             /> */}
//             <View style={styles.numHoriz}>
//               <View style={styles.numContainer}>
//                 <Text style={styles.number} type="bold">4</Text>
//               </View>
//               <Text style={styles.numTitle}>Choose your price</Text>
//             </View>
//           <View style={{paddingHorizontal: 16}}>
//             <Input 
//                 placeholder='$1.25'         
//                 label="Cost Per Hour"
//                 name="cost"             
//                 onChangeText= {(spacePrice) => this.setState({spacePrice})}
//                 value={this.state.spacePrice}
//                 mask="USD"
//                 maxLength = {6}
//                 keyboardType='default'
//                 suffix="/hr"
//                 rightText="Estimated $1.50/hr"
//                 error={this.state.priceError}
//               />
//             </View>

//             <View style={styles.numHoriz}>
//               <View style={styles.numContainer}>
//                 <Text style={styles.number} type="bold">5</Text>
//               </View>
//               <Text style={styles.numTitle}>Space Availability</Text>
//             </View>
//             <View style={{paddingHorizontal: 16}}>
//               <DayAvailabilityPicker 
//                 availability={this.state.daily}
//                 availabilityCallback={this.availabilityCallbackFunction}
//                 >
//               </DayAvailabilityPicker>
//               {/* <SectionList 
//               sections={this.state.daily}
//               keyExtractor={(item, index) => index}  
//               horizontal={false}
//               renderSectionHeader={({section}) => (
//                   <View style={{padding: 12, backgroundColor: '#efefef'}}>
//                    <Text style={styles.dayHead}>{section.dayName}</Text>
//                   </View>
//               )}  
//               renderItem={({item}) => (
//                 <View style={{display: 'flex', flexDirection: 'row', marginTop: 24}}> 
//                   <Text>{item.start}</Text>
//                   <Text>{item.end}</Text>
//                   <Text>{item.start}</Text>
//                   <Text>{item.end}</Text>
//                 </View>
//               )}  
                
//               /> */}
//               {/* <FlatList
//                 style={{paddingVertical: 8}}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 keyExtractor={(item) => item.dayName} 
//                 data={this.state.daily}
//                 snapToAlignment={"start"}
//                 snapToInterval={Dimensions.get("window").width * 0.7 + 32}
//                 decelerationRate={"fast"}
//                 pagingEnabled
//                 renderItem={({ item }) => { return (
//                   <Card elevation={5} style={{width: Dimensions.get("window").width * 0.7, marginHorizontal: 16}}>
//                       <Card.Title style={styles.dayHead} title={item.dayName} />
//                       <Card.Content>
//                       <View style={{display: 'flex', flexDirection: 'row'}}>
//                         <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
//                           <Text>Start</Text>
//                           {item.data.map((x, i) => (
//                           <Text key={item.data[i].id}>{parseInt(item.data[i].start)}</Text>
//                           ))}
//                         </View>
//                         <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
//                           <Text>End</Text>
//                           {item.data.map((x, i) => (
//                           <Text key={item.data[i].id}>{parseInt(item.data[i].end)}</Text>
//                           ))}
//                         </View>
//                         <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
//                           <Text>Availability</Text>
//                           {item.data.map((x, i) => (
//                             <Switch key={item.data[i].id} value={item.data[i].available}/>
//                           ))}
//                         </View>
//                       </View>
//                       </Card.Content>
//                   </Card>
//                 )}}
//               /> */}
//               <Button disabled={this.state.savingSpace} onPress={() => this.submitSpace()}>Add Photo</Button>

//             </View>
            
//         </KeyboardAvoidingView>
//       {/* </ScrollView> */}
//       </KeyboardAwareScrollView>
//     );
//   }
}
}

const styles = StyleSheet.create({

  numHoriz:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  numContainer:{
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 3, 
    borderColor: Colors.apollo500, 
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2, 
    width: 44, 
    height: 44,
  },
  contentBox:{
    marginHorizontal: 16,  
  
  },
  number:{
    color: Colors.apollo500,
    fontSize: 18,
  },
  numTitle: {
    color: Colors.apollo500,
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 8,
  },
  imageListGrid:{
    flexGrow: 1,
    marginVertical: 20,
    
  },
  dayHead:{
    fontSize: 24,
    fontFamily: 'WorkSans-Regular'
  },
  label: {
    paddingTop: 5,
    marginBottom: -2,
    paddingTop: 0,
    color: '#333',
    fontSize: 14,
    fontWeight: '400',
    width: 'auto'
},
})
  

export default editSpace
