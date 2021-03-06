// React library imports
import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, StatusBar, Platform, View, ScrollView, SafeAreaView, Dimensions, KeyboardAvoidingView, Image } from 'react-native';
import Text from '../components/Txt'

import logo from '../assets/img/Logo_001.png'

import Expo from 'expo';
import * as GoogleSignIn from 'expo-google-sign-in'

// import { GoogleSignin } from 'react-native-google-signin'

// Firebase imports
import * as firebase from 'firebase'
import 'firebase/firestore';
import withFirebaseAuth from 'react-with-firebase-auth'
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig'


import {createAppContainer} from 'react-navigation'
import HomeScreen from './HomeScreen'

// Component imports
import Input from '../components/Input'
import Button from '../components/Button'

// Viewport imports
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { YellowBox } from 'react-native'

//MobX Imports
import {inject, observer} from 'mobx-react/native'
import { requireNativeViewManager } from '@unimodules/core';








// import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'


// For export statement after render
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};


if (!firebase.apps.length) {

  // Initlialized FB Vars
  var firebaseApp = firebase.initializeApp(firebaseConfig);
  var firebaseAppAuth = firebaseApp.auth();
}



// Regex to check name and phone are valid at sign in
const regexFullname = /[^0-9]([a-zA-Z]{1,})+[ ]+([a-zA-Z-']{2,})*$/gi;
const regexPhone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

// Vars that prevent continuing since this is not built into firebase natively
let nameValid = false;
let phoneValid = false;




@inject("UserStore")
@observer
class Authentication extends Component {
  constructor(){
    super();
   
    


    this.state = {
      email: '',
      password: '',
      fullname: '',
      phone: '',
      stripeID: 'invalid',
      authenticating: false,
      toggleLogIn: true,

      // Errors that may show if firebase catches them.
      emailError: '',
      passwordError: '',
      fullnameError: '',
      phoneError: '',
    }
    this.onPressSignIn = this.onPressSignIn.bind(this);
    this.onPressSignUp = this.onPressSignUp.bind(this);
    this.renderCurrentState = this.renderCurrentState.bind(this);
    this.toggleSignInOrUp = this.toggleSignInOrUp.bind(this);
    this.resetPassword =  this.resetPassword.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
  }

  async componentDidMount() {
    // Remove after testing!!
    this.setState({email: 'admin@riive.net', password: 'Fallon430'})
    this.props.UserStore.email = 'admin@riive.net'
    this.props.UserStore.password = "Fallon430"

     // Set Status Bar page info here!
   this._navListener = this.props.navigation.addListener('didFocus', () => {
    StatusBar.setBarStyle('dark-content', true);
    Platform.OS === 'android' && StatusBar.setBackgroundColor('white');

  });


  
  // try {
  //   await GoogleSignIn.initAsync({ 
  //     clientId: 'com.googleusercontent.apps.888723186328-bq5cq0kof3dd1mn5pbi6ivj5ebodis9o',
  //     scopes: ['profile', 'email'],
  //     behavior: 'web',
  //   });
  // } catch ({ message }) {
  //   alert('GoogleSignIn.initAsync(): ' + message);
  // }


    
    
  }

 

   componentWillUnmount() {
        // Unmount status bar info
       this._navListener.remove();
     }

createStripeCustomer = async () => {

  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: this.props.UserStore.fullname,
      email: this.props.UserStore.email,
      phone: this.props.UserStore.phone,
      FBID: firebase.auth().currentUser.uid,
    })
  }
  try{
    const fetchResponse = await fetch('https://us-central1-riive-parking.cloudfunctions.net/addCustomer', settings)
    const data = await fetchResponse.json();
    return data;
  }catch(e){
    alert(e);
  }    
}






// Resets the password of the state with email
resetPassword = () =>{
  firebase.auth().sendPasswordResetEmail(this.props.UserStore.email).then(function() {
      alert('Check your email for a password reset link.')
    }).catch(function(error) {
      alert('Failed to send password reset. ' + error.message)
  });
}

  // Toggles between sign in and sign up on same page.
  toggleSignInOrUp() {
    // resets the errors and password for security reasons
    this.setState({ 
      toggleLogIn: !this.state.toggleLogIn,
      password: '',
      emailError: '',
      passwordError: '',
      fullnameError: '',
      phoneError: '',
    
    })
  }

  signInWithGoogle = async () => {
     
    this.setState({authenticating: true})
    try{

      await GoogleSignIn.askForPlayServicesAsync();
    const { result, user } = await    GoogleSignIn.signInAsync();

      // const result = await Google.logInAsync({
      //   androidClientId: '929031102626-0vgrqk865kkcar3d2smoabmuocn5d1h1.apps.googleusercontent.com',
      //   iosClientId: '929031102626-c2ssoc6rc65ukb9moi1h45th1sni2ol1.apps.googleusercontent.com',
      //   scopes: ['profile', 'email'],
      // })
      if (result.type === 'success'){
        
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)
        firebase.auth().signInWithCredential(credential).then((result) => {
         
        //  console.log(result.user)
         this.props.UserStore.userID = result.user.uid;
         

        const db = firebase.firestore();
        const doc = db.collection('users').doc(this.props.UserStore.userID);
     


        doc.get().then((doc) => {
          if (doc.exists){
            
            
            this.props.UserStore.email = doc.data().email
            this.props.UserStore.fullname = doc.data().fullname;
            this.props.UserStore.phone = doc.data().phone;
            this.props.UserStore.userID = doc.data().id;
            this.props.UserStore.stripeID = doc.data().stripeID;
            this.props.UserStore.photo = doc.data().photo;
            this.props.UserStore.joinedDate = firebase.auth().currentUser.metadata.creationTime
            this.props.UserStore.vehicles = doc.data().vehicles;
            this.props.UserStore.listings = doc.data().listings;
            this.props.UserStore.payments = doc.data().payments;
            this.props.UserStore.searchHistory = doc.data().searchHistory;

            this.props.UserStore.signInProvider = firebase.auth().currentUser.providerData[0].providerId;

            


            
        }else{
            this.props.UserStore.email = result.user.email;
            this.props.UserStore.fullname = result.user.displayName;
            this.props.UserStore.phone = result.user.phoneNumber;
            // Skip User ID. we do this after creating the member
            this.props.UserStore.photo = result.user.photoURL
            this.props.UserStore.joinedDate = result.user.createdAt
            // Vehicles, listings, search history and payments will be empty.
            

          db.collection("users").doc(this.props.UserStore.userID).set({
            id: firebase.auth().currentUser.uid,
            fullname: this.props.UserStore.fullname,
            firstname: this.props.UserStore.firstname,
            lastname: this.props.UserStore.lastname,
            email: this.props.UserStore.email,
            phone: this.props.UserStore.phone,
            searchHistory: [],
            totalNumTimesParked: 0,
            numTimesOpenedApp: 1,
            listings: [],
            vehicles: [],
            payments: [],
            photo: this.props.UserStore.photo,
         })
         
        }
             
      
        }).then(() => {
          this.props.UserStore.userID = firebase.auth().currentUser.uid
          this.props.UserStore.joinedDate = firebase.auth().currentUser.metadata.creationTime
           // ID if user signed in via email or google
          this.props.UserStore.signInProvider = firebase.auth().currentUser.providerData[0].providerId;
          
          this.setState({authenticating: false})
          this.props.navigation.navigate("Home")
      
        })

        
        
        })        
      }else{
        // return { cancelled: true };
        alert("Cancelled")
      }
    } catch (e){
      return alert("ERROR!! " + e)
    }
  }





  // Sign up authorization with email and password
  // also sends an email verification to the user
  onPressSignUp = () => {

     // Begin ActivityIndicator since auth == true
    this.setState ({ authenticating: true})

      // Checks if full name is in format of Firstname Lastname
      if(this.props.UserStore.fullname.match(regexFullname)){
        // alert('name valid')
        this.setState({fullnameError: ''})
        nameValid = true;
      }else{
        // alert('name invalid')
        this.setState({
          fullnameError: 'Please provide first and last name with a space.',
          authenticating: false
        });
        namevalid = false;
      }  

      // Checks phone for valid format (accepts many formats)
      if(this.props.UserStore.phone.match(regexPhone)){
        // alert('name valid')
        this.setState({phoneError: ''})
        phoneValid = true;
      }else{
        // alert('name invalid')
        this.setState({
          phoneError: 'Please provide a proper 10 digit phone number.',
          authenticating: false
        });
        phoneValid = false;
      }  
      

    // If vars are true and valid beguin creating user
    if(nameValid && phoneValid){
    
    firebase.auth().createUserWithEmailAndPassword(this.props.UserStore.email, this.props.UserStore.password).then((userCredentials) => {
        // RETURN ALL THIS IF EMAIL AND PASSWORD ARE TRUE

        this.setState({
          emailError: '',
          passwordError: '',
          fullnameError: '',
          phoneError: '',
        })  

        
        // Updates user's displayName in firebase auth
        if(userCredentials.user){
          this.props.UserStore.userID = firebase.auth().currentUser.uid;
           userCredentials.user.updateProfile({
            displayName: this.props.UserStore.fullname
           })
           userCredentials.user.updateEmail(this.props.UserStore.email).then(() => {
                this.props.UserStore.joinedDate = firebase.auth().currentUser.metadata.creationTime
                // IMPORTANT!!! Defines user location in database
                this.props.UserStore.userID = firebase.auth().currentUser.uid;
              }).then(() => {
                //start firestore
                const db = firebase.firestore();
                const doc = db.collection('users').doc(this.props.UserStore.userID);

                doc.get().then((docData) => {
                    db.collection("users").doc(this.props.UserStore.userID).set({
                      id: firebase.auth().currentUser.uid,
                      fullname: this.props.UserStore.fullname,
                      firstname: this.props.UserStore.firstname,
                      lastname: this.props.UserStore.lastname,
                      email: this.props.UserStore.email,
                      phone: this.props.UserStore.phone,
                      searchHistory: [],
                      totalNumTimesParked: 0,
                      numTimesOpenedApp: 1,
                      listings: [],
                      vehicles: [],
                      payments: [],
                      photo: '',
                      joined_date: firebase.auth().currentUser.metadata.creationTime,
                      last_update: firebase.auth().currentUser.metadata.creationTime,
                      disabled: {
                        isDisabled: false,
                        disabledEnds: new Date().getTime() / 1000,
                        numTimesDisabled: 0,
                      },
                      deleted: {
                        isDeleted: false,
                        toBeDeleted: false,
                        deletedStarts: new Date().getTime() / 1000,
                      },
                    })
                return docData
              }).then((doc) => {
                    // console.log(doc.data())
                    this.props.UserStore.fullname = this.props.UserStore.fullname;
                    this.props.UserStore.phone = this.props.UserStore.phone;
                    this.props.UserStore.stripeID = "";
                    this.props.UserStore.photo = "";
                    this.props.UserStore.joinedDate = firebase.auth().currentUser.metadata.creationTime;
                    this.props.UserStore.last_update = firebase.auth().currentUser.metadata.creationTime;
                    this.props.UserStore.vehicles = [];
                    this.props.UserStore.listings = [];
                    this.props.UserStore.payments = [];
                    this.props.UserStore.searchHistory = [];
                    this.props.UserStore.disabled = false;
                    this.props.UserStore.deleted = false;
                  }).then(() => {
                    // alert('Welcome to Riive ' + this.props.UserStore.firstname + '!')
     
                  this.setState({ authenticating: false});
                  this.props.navigation.navigate('Home')
     
                  // ID if user signed in via email or google
                  this.props.UserStore.signInProvider = firebase.auth().currentUser.providerData[0].providerId;
     
                
     
                  
                  
               
     
              }).then(() => this.createStripeCustomer())
              .then(() =>  {
                // Sends email to valid user
                firebase.auth().currentUser.sendEmailVerification()
              })
                .catch((e) => {
                alert('Whoops! We accidently lost connection. Try signing up again.' + e)
                firebase.auth().currentUser.delete();
                })
        
                  
          
        })
      }
    }).catch(e => {
      // Handle Errors here.
      var errorCode = e.code;
      var errorMessage = e.message;
      this.setState ({ authenticating: false})
      // alert(errorCode + ': ' + errorMessage)
      if(errorCode == 'auth/invalid-email'){
        this.setState({
          emailError: 'Email format must be name@domain.com',
          passwordError: '',

        })
      }else if (errorCode == 'auth/email-already-in-use'){
        this.setState({
          emailError: 'Email is already in use with another account.',
          passwordError: '',

        })
      }else if (errorCode == 'auth/weak-password'){
        this.setState({
          emailError: '',
          passwordError: 'Password must be longer than 5 characters.',

        })
      }else{
        alert(errorCode + ': ' + errorMessage);
      }
    })
  }
}


  



  onPressSignIn = async() => {

    this.setState ({ authenticating: true})

  
    firebase.auth().signInWithEmailAndPassword(this.props.UserStore.email, this.props.UserStore.password).then(() => {
      // define user id before calling the db from it
      this.props.UserStore.userID = firebase.auth().currentUser.uid;
      this.setState({
        emailError: '',
        passwordError: '',
      })


      const db = firebase.firestore();
      const doc = db.collection('users').doc(this.props.UserStore.userID);
        

         

      // console.log(firebase.auth().currentUser.providerId)

      

      

      // MOBX is not cached upon force close. Reinitalize data to mobx here!
        doc.get().then((doc) => {
          if (doc.exists){

          
             
                  // alert(`${doc.id} => ${doc.data().fullname}`);
                  this.props.UserStore.fullname = doc.data().fullname;
                  this.props.UserStore.phone = doc.data().phone;
                  this.props.UserStore.userID = doc.data().id;
                  this.props.UserStore.stripeID = doc.data().stripeID;
                  this.props.UserStore.photo = doc.data().photo;
                  this.props.UserStore.joinedDate = firebase.auth().currentUser.metadata.creationTime;
                  this.props.UserStore.last_update = doc.data().last_update;
                  this.props.UserStore.vehicles = doc.data().vehicles;
                  this.props.UserStore.listings = [];
                  this.props.UserStore.payments = doc.data().payments;
                  this.props.UserStore.searchHistory = doc.data().searchHistory;
                  this.props.UserStore.disabled = doc.data().disabled.isDisabled;
                  this.props.UserStore.deleted = doc.data().deleted.toBeDeleted

                  // ID if user signed in via email or google
                  this.props.UserStore.signInProvider = firebase.auth().currentUser.providerData[0].providerId;
                  

                  var currentTime = firebase.firestore.Timestamp.now();

                  // in case a user reverts their email change via profile update
                  db.collection("users").doc(this.props.UserStore.userID).update({
                    last_update: currentTime,
                    email: this.props.UserStore.email,
                  })
                  // Upon setting the MobX State Observer, navigate to home
                  this.props.navigation.navigate('Home')
              
                  return doc;


        }else{
          throw("No user found")
        }
    }).then((doc) => {
      const length = doc.data().listings.length;
      if( length > 0 && length <= 10){
        db.collection('listings').where(firebase.firestore.FieldPath.documentId(), "in", doc.data().listings).get().then((qs) => {
          let listingsData = [];
          for(let i = 0; i < qs.docs.length; i++){
            listingsData.push(qs.docs[i].data())
          }
          this.props.UserStore.listings = listingsData;
      }).then(() => this.props.navigation.navigate("Home"))


    }else if(length > 0 && length > 10){
      let listings = doc.data().listings;
      let allArrs = [];
      var listingsData = [];
      while(listings.length > 0){
        allArrs.push(listings.splice(0, 10))
      }
      for(let i = 0; i < allArrs.length; i++){
        db.collection('listings').where(firebase.firestore.FieldPath.documentId(), "in", allArrs[i]).get().then((qs) => {
          for(let i = 0; i < qs.docs.length; i++){
            listingsData.push(qs.docs[i].data())
          }
        }).then(() => {
          this.props.UserStore.listings = listingsData;
          this.props.navigation.navigate('Home')
        })
      }
    
    }else{
       this.props.navigation.navigate('Home')
    }
       
    }).catch((e) => {
      alert("Failed to grab user data. Please try again. " + e)
    })

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      // alert('Persisted!')
    })


    }).catch( async (error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      this.setState ({ authenticating: false})
      // alert(errorCode + ': ' + errorMessage)
      if(errorCode == 'auth/invalid-email'){
        this.setState({
          emailError: 'Email format must be name@domain.com',
          passwordError: '',

        })
      }else if(errorCode == 'auth/user-not-found'){
        this.setState({
          emailError: 'There is no account under this email',
          passwordError: '',

        })
      }else if(errorCode == 'auth/too-many-requests'){
        this.setState({
          emailError: 'Too many recent requests. Try again soon',
          passwordError: '',

        })
      }else if(errorCode == 'auth/wrong-password'){
        this.setState({
          passwordError: 'Password is incorrect or empty',
          emailError: '',
        })
      }else if(errorCode == 'auth/user-disabled'){
        const settings = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Request-Method": "POST"
          },
          body: JSON.stringify({
            email: this.props.UserStore.email,
          })
        }
    
          
          await fetch('https://us-central1-riive-parking.cloudfunctions.net/getUserDataFromEmail', settings).then((res) => {
            return res.json()
          }).then((body) => {
            const db = firebase.firestore();
            const doc = db.collection('users').doc(body.uid)
            return doc.get()
          }).then((user) => {
            console.log(user.exists)
            if(user.exists){
              if(user.data().disabled.numTimesDisabled < 3){
                var date = new Date(user.data().disabled.disabledEnds * 1000 + (24*60*60*1000));
                var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                this.setState({
                  passwordError: '',
                  emailError: `This account has been suspended until ${daysOfWeek[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`,
                })
              }else{
                this.setState({
                  passwordError: 'Reach out to support@riive.net for assistance',
                  emailError: `This account has been banned`,
                })
              }
          }else{
            this.setState({
              passwordError: '',
              emailError: `This account has been suspended`,
            })
          }
          }).catch(e => {
            alert(e)
          })
         
        // console.log(this.props.UserStore.email)
        // const db = firebase.firestore();
        // const doc = db
        // doc.get().then((doc) => {
        //   console.log(doc)
          // if(doc.exists){
          //   if(doc.data().disabled.numTimesDisabled < 3){
          //     var date = new Date(doc.data().disabled.disabledEnds * 1000);
          //     var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          //     var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          //     this.setState({
          //       passwordError: '',
          //       emailError: `This account has been suspended until ${daysOfWeek[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`,
          //     })
          //   }else{
          //     this.setState({
          //       passwordError: 'Reach out to support@riive.net for assistance',
          //       emailError: `This account has been banned`,
          //     })
          //   }
          // }else{
          //   this.setState({
          //     passwordError: '',
          //     emailError: `This account has been suspended`,
          //   })
          // }
        // })
      }else{
        alert(errorCode + ': ' + errorMessage);
      }
    });

  }






  renderCurrentState() {
    if(this.state.authenticating){
      return(
        <View style={styles.form}>
          <ActivityIndicator size="large" />
          <Button style={{backgroundColor: "#FF8708"}} textStyle={{color:"#FFFFFF"}} onPress={() => this.setState({ authenticating: false})}>Cancel</Button>
        </View>
      )
    }else if(this.state.toggleLogIn){
      return(
          <View style={styles.form}>
            <Input 
            placeholder='Enter email...'
            label="Email"
            name="email"
            onChangeText = {(email) => this.props.UserStore.email = email}
            value={this.props.UserStore.email}
            keyboardType='email-address'
            maxLength = {55} 
            error={this.state.emailError}
            />
            <Input 
            placeholder='Enter password...'
            label="Password"
            name="password"
            secureTextEntry
            onChangeText = {(password) => this.props.UserStore.password = password}
            value={this.props.UserStore.password}
            maxLength = {55}
            keyboardType='default'
            error={this.state.passwordError}
            />
            <Button style={{backgroundColor: "#FF8708"}} textStyle={{color:"#FFFFFF"}} onPress = {() => this.onPressSignIn()}>Log In</Button>
            <Button iconLib="FontAwesome" iconName="google" iconSize={24} iconColor="#ffffff" iconStyle={{marginRight: 16}} style={{backgroundColor: "#DB4437",}} textStyle={{color:"#FFFFFF"}} onPress = {() => this.signInWithGoogle()}>Sign In With Google</Button>
            <Text onPress={() => this.toggleSignInOrUp()} style={styles.hyperlink}>Or Sign Up</Text>
            <Text onPress={() => this.resetPassword()} style={styles.hyperlink}>Forgot Password?</Text>
          </View>
      )
    }else{
      return(
       <View style={styles.form}>
          <Input 
          placeholder='Your name...'
          label="Full Name"
          name="full name"
          onChangeText= {(fullname) => this.props.UserStore.fullname = fullname}
          value={this.props.UserStore.fullname}
          maxLength = {40}
          keyboardType='default'
          error={this.state.fullnameError}
          />
          <Input 
          placeholder='000-000-0000'
          mask='phone'
          label="Phone"
          name="phone"
          type="phone"
          onChangeText= {(phone) => this.props.UserStore.phone = phone}
          value={this.props.UserStore.phone}
          keyboardType='phone-pad'
          maxLength = {17}
          error={this.state.phoneError}
          />
          <Input 
          placeholder='Enter email...'
          label="Email"
          name="email"
          onChangeText= {(email) => this.props.UserStore.email = email}
          value={this.props.UserStore.email}
          keyboardType='email-address'
          maxLength = {55}
          error={this.state.emailError}
          />
          <Input 
          placeholder='Enter password...'
          label="Password"
          name="password"
          secureTextEntry
          onChangeText = {(password) => this.props.UserStore.password = password}
          value={this.props.UserStore.password}
          maxLength = {55}
          keyboardType='default'
          error={this.state.passwordError}
          />
          <Button style={{backgroundColor: "#FF8708"}} textStyle={{color:"#FFFFFF"}} onPress = {() => this.onPressSignUp("HomeScreen")}>Sign Up</Button>
          <Text onPress={() => this.toggleSignInOrUp()} style={styles.hyperlink}>Or Log In</Text>
        </View>
      )
    }
    
  }




 

  render() {
    return (

        <ScrollView contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <KeyboardAvoidingView 
            // style={{backgroundColor: 'purple'}}
            behavior={"padding"} 
            keyboardVerticalOffset={120}
            enabled 
          >
            <View style={styles.primaryView}>
             {!this.state.authenticating ?<Image source={logo} style={styles.img}/> : null}
             {this.renderCurrentState()}
             {/* <View style={{height: 60}}/> */}
             </View>
          </KeyboardAvoidingView>
        </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  primaryView:{
    paddingHorizontal: 24,
  },
  img:{
    width: 150,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  form: {
    flex: 1,
  },
  hyperlink: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 24
  }
});


export default withFirebaseAuth ({providers, firebaseAppAuth})(Authentication);
