import React, { Component } from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, SafeAreaView } from 'react-native';
import Text from '../components/Txt'
import Input from '../components/Input'
import Icon from '../components/Icon'
import Button from '../components/Button'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'

import * as firebase from 'firebase'
import 'firebase/firestore';
import firebaseConfig from '../firebaseConfig'


//MobX Imports
import {inject, observer} from 'mobx-react/native'
import { requireNativeViewManager } from '@unimodules/core';

// Stripe Payments
import stripe from 'tipsi-stripe'



const regexFullname = /[^0-9]([a-zA-Z]{1,})+[ ]+([a-zA-Z-']{2,})*$/i;
var d = new Date();
const year = d.getFullYear().toString();
const lastTwoYearString = year.slice(-2);
const lastTwoYear = Number(lastTwoYearString);
const month = d.getMonth() + 1;




@inject("UserStore", "ComponentStore")
@observer
class addPayment extends Component {
  _isMounted = false;

  static navigationOptions = {
    title: "Add A Card",
    headerTitleStyle:{
        fontWeight: "300",
        fontSize: 18,
    }

};


    constructor(props){
        super(props)

        this.state = {
            creditCardNum: null,
            creditCardType: '',
            creditCardFormat: 'visa-or-mastercard',
            name: this.props.UserStore.fullname,
            CCV: null,
            type: "",
            exp: "",
            expMonth: "",
            expYear: "",
            StripecardId: null,
            StripecardTok: null,
            CCVError: "",
            creditCardNumError: "",
            nameError: "",
            expError: "",
            allValid: false,
        }
    }

    async componentDidMount(){
      // Set Status Bar page info here!
      this._isMounted = true;
     this._navListener = this.props.navigation.addListener('didFocus', () => {
         StatusBar.setBarStyle('dark-content', true);
         Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
       });
    }

   


       
   

     componentWillUnmount() {
      this._isMounted = false;
          // Unmount status bar info
         this._navListener.remove();
       }

getCardType = (cardNum) => {
  if(cardNum !== null){
    if(cardNum.length >= 2){
        if(cardNum.charAt(0) == 4){
            // console.log('visa  -  length: 16')
            this.setState({creditCardType: 'visa', creditCardFormat:'visa-or-mastercard'})
        }else if(cardNum.charAt(0) == 5){
            // console.log('mastercard  -  length: 16')
            this.setState({creditCardType: 'mastercard', creditCardFormat:'visa-or-mastercard'})
        }else if(cardNum.charAt(0) == 6){
          // console.log('discover  -  length: 16')
          this.setState({creditCardType: 'discover', creditCardFormat:'visa-or-mastercard'})
        }else if(cardNum.charAt(0) == 3 && cardNum.charAt(1) == 4 || cardNum.charAt(1) == 7){
            // console.log('amex  -  length: 15')
            this.setState({creditCardType: 'amex', creditCardFormat:'amex'})
        }else if(cardNum.charAt(0) == 3 && cardNum.charAt(1) == 0 || cardNum.charAt(1) == 6 || cardNum.charAt(1) == 8){
            // console.log('diners international  -  length: 14')
            this.setState({creditCardType: 'diners-club', creditCardFormat:'diners'})
        }else if(cardNum.charAt(0) == 3 && cardNum.charAt(1) == 5 ){
          // console.log('jcb  -  length: 16')
          this.setState({creditCardType: 'jcb', creditCardFormat:'visa-or-mastercard'})
        }else{
            // console.log('card not supported by Riive yet.')
            this.setState({creditCardType: '', creditCardFormat: 'visa-or-mastercard'})
        }
    }else{}
  }else{
    console.log('Credit card null')
  }


}

cardExpirationDate = async(mmyy) => {
  await this.setState({
    exp: mmyy,
    expMonth: Number(mmyy.split('/')[0]),
    expYear: Number(mmyy.split('/')[1]),
  })

  // console.log(this.state.expMonth + 1)
}

setCardParams = async() => {
  const params = {
    // mandatory
    number: this.state.creditCardNum,
    expMonth: this.state.expMonth,
    expYear: this.state.expYear,
    cvc: this.state.CCV,
    // optional
    name: this.state.name,
    currency: 'usd',
    // addressLine1: '123 Test Street',
    // addressLine2: 'Apt. 5',
    // addressCity: 'Test City',
    // addressState: 'Test State',
    // addressCountry: 'Test Country',
    // addressZip: '55555',
  }
 
  
  var token = await stripe.createTokenWithCard(params)
  this.setState({StripecardId: token.card.cardId, StripecardTok: token.tokenId})

  
  
}


addSource = async () => {

  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      FBID: firebase.auth().currentUser.uid,
      stripeID: this.props.UserStore.stripeID,
      cardSource: this.state.StripecardTok,
    })
  }
  try{
    
    const fetchResponse = await fetch('https://us-central1-riive-parking.cloudfunctions.net/addSource', settings)
    const data = await fetchResponse.json();
    return data;
  }catch(e){
    alert(e);
  }    
}




submitPayment = async() => {
  const db = firebase.firestore();

  if(this._isMounted){
    

  try{
    
    try{
      this.verifyInput();
      await this.setCardParams();
    }catch(e){
      
    }
    
    
    if(this.state.allValid){
      const ref = db.collection("users").doc(); // creates unique ID

        // add card to database
      if(this.state.creditCardType !== ""){
        db.collection("users").doc(this.props.UserStore.userID).update({
            payments: firebase.firestore.FieldValue.arrayUnion({
                PaymentID: ref.id,
                StripeID: this.state.StripecardId,
                Type: "Card",
                CardType: this.state.creditCardType,
                Name: this.state.name,
                Month: this.state.expMonth,
                Year: this.state.expYear,
                Number: this.state.creditCardNum.slice(-4),
                CCV: this.state.CCV,
            })
         })
        }else{
          db.collection("users").doc(this.props.UserStore.userID).update({
            payments: firebase.firestore.FieldValue.arrayUnion({
                PaymentID: ref.id,
                StripeID: this.state.StripecardId,
                Type: "Card",
                CardType: "Credit",
                Name: this.state.name,
                Month: this.state.expMonth,
                Year: this.state.expYear,
                Number: this.state.creditCardNum.slice(-4),
                CCV: this.state.CCV,
            })
         })
        }
         // add card to mobx UserStore
         if(this.state.creditCardType !== ""){
         this.props.UserStore.payments.push({
            PaymentID: ref.id,
            StripeID: this.state.StripecardId,
            Type: "Card",
            CardType: this.state.creditCardType,
            Name: this.state.name,
            Month: this.state.expMonth,
            Year: this.state.expYear,
            Number: this.state.creditCardNum.slice(-4),
            CCV: this.state.CCV,
         })
        }else{
          this.props.UserStore.payments.push({
            PaymentID: ref.id,
            StripeID: this.state.StripecardId,
            Type: "Card",
            CardType: "Credit",
            Name: this.state.name,
            Month: this.state.expMonth,
            Year: this.state.expYear,
            Number: this.state.creditCardNum.slice(-4),
            CCV: this.state.CCV,
         })
        }
        this.addSource();

        
      
         // navigate back to profile
         this.props.navigation.navigate("Profile")
    
      }else{
        this.setState({creditCardNumError: 'Credit card type is not supported'})
      }

      


  }catch(e){
    this.setState({creditCardNumError: e})
  }  
  
  
}
}



verifyInput = () => {
  //set a variable to check if name is valid (returns true or false...)
  var nameValid = regexFullname.test(this.state.name)

  // itialize length values for card type
  var ccLength = -1;
  var CCVLength = -1;
  var expLength = 5;

  // Set variable values for length requirements for credit card.
  if(this.state.creditCardFormat == 'visa-or-mastercard'){
    ccLength = 19;
    CCVLength = 3;
  }else if(this.state.creditCardFormat == 'amex'){
    ccLength = 17;
    CCVLength = 4;
  }else if(this.state.creditCardFormat == 'diners'){
    ccLength = 16;
    CCVLength = 3;
  }else{
    ccLength = 19;
    CCVLength = 3;
  }

  // credit card number and ccv are entered...
  if(this.state.creditCardNum && this.state.CCV){
     
    //Checking if everything is valid for a year that is not the current year
    if(this.state.creditCardNum.length == ccLength
      && this.state.CCV.length == CCVLength
      && !isNaN(this.state.CCV)
      && this.state.exp.length == expLength
      && this.state.expYear > lastTwoYear
      && this.state.expMonth < 13 
      && nameValid){
      this.setState({
        creditCardNumError: "",
        expError: "",
        CCVError: "",
        nameError: "",
      })
      this.state.allValid = true;
      // alert("Success future year!!!")
      

      // Checking if valid for a year that is the current year
    }else if(this.state.creditCardNum.length == ccLength
      && this.state.CCV.length == CCVLength
      && this.state.exp.length == expLength 
      && this.state.expYear == lastTwoYear
      && this.state.expMonth >= month 
      && nameValid){
        this.setState({
          creditCardNumError: "",
          expError: "",
          CCVError: "",
          nameError: "",
        })
        this.state.allValid = true;
        // alert("Success current year!!!")
        

    // Begin error checking....
    }else{
      this.state.allValid = false;

      // Credit card value check
      if(this.state.creditCardNum.length !== ccLength ){
        // console.log('credit card number fail...')
        this.setState({creditCardNumError: "Number too short"})
      }else{this.setState({creditCardNumError: ""})}

      // CCV value check
      if(this.state.CCV.length !== CCVLength){
        // console.log('CCV fail...')
        this.setState({CCVError: "CCV too short"})
      }else if(isNaN(this.state.CCV)){
        this.setState({CCVError: "CCV should be numbers"})
      }else{this.setState({CCVError: ""})}

      // expiration date value check
      if(this.state.exp.length !== expLength || this.state.expMonth >= 13 || this.state.expYear <= lastTwoYear || this.state.expMonth < month){
        if(this.state.exp.length !== expLength){this.setState({expError: "MM/YY"})}
        else if(this.state.expMonth >= 13){this.setState({expError: "Choose a month 1-12"})}
        else if(this.state.expYear <= lastTwoYear && this.state.expMonth < month || this.state.expYear < lastTwoYear){this.setState({expError: "Date in past"})}
        else{this.setState({expError: ""})}
      }else{this.setState({expError: ""})}

      // Name value check
      if (!nameValid){
        // console.log("provide the full name on your credit card")
        this.setState({nameError: "First and last name required"})
      }else{this.setState({nameError: ""})}
    }

  }else{
    if(this.state.creditCardNum == null){
      this.setState({creditCardNumError: 'Credit card required'})
    }else{this.setState({creditCardNumError: ''})}
    
    if(this.state.CCV == null){
      this.setState({CCVError: "CCV required"})
    }else{this.setState({CCVError:""})}
    
  }
}





  render() {
    return (
      
      <ScrollView>
      <SafeAreaView style={{flex: 0, backgroundColor: "white", }} />
      <View style={styles.container}>
        <LinearGradient colors={[Colors.apollo500, Colors.apollo700]} style={styles.creditCard}>
            <Icon 
              iconName={this.state.creditCardType !== '' ? 'cc-' + this.state.creditCardType : 'credit-card'}
              iconLib="FontAwesome"
              iconColor={Colors.mist300}
              iconSize={28}
              style={{ marginLeft: "auto"}}
            />
            <View style={{justifyContent: 'flex-end'}}>
            <Text style={{color: Colors.mist300, fontSize: 18}}>{this.state.creditCardNum ? this.state.creditCardNum : 'XXXX XXXX XXXX XXXX'}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: Colors.mist300, fontSize: 10, marginBottom: 20, marginLeft: 5}}>{this.state.CCV ? this.state.CCV : 'CCV'}</Text>
              <Text style={{color: Colors.mist300, fontSize: 10}}>GOOD {"\n"} THRU {"\n"}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.creditCardText}>{this.state.name == "" ? 'Firstname Lastname' : this.state.name}</Text>               
              <Text style={styles.creditCardText}>{this.state.exp == "" ? "MM/YY" : this.state.exp}</Text>
            </View>
            </View>
        </LinearGradient>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: 16, flex: 5}}>
            <Input 
              placeholder='XXXXXXXXXXXXXXXX'
              mask='credit-card'
              ccType = {this.state.creditCardFormat}
              label="Credit Card Number"
              name="CCNum"
              onChangeText = {cc => {this.setState({creditCardNum: cc}); this.getCardType(cc)}}
              value={this.state.creditCardNum}
              error={this.state.creditCardNumError}
            />
          </View>
          <View style={{flex: 2}}>
                <Input 
                    placeholder='MM/YY'
                    mask='mm/yy'
                    label="Expiration"
                    name="expiration"
                    onChangeText = {i => this.cardExpirationDate(i)}
                    value={this.state.exp}
                    keyboardType='numeric' 
                    error={this.state.expError}
                  />
            </View>
          
         </View>
          <View style={{flexDirection: 'row'}}>
            
           <View style={{marginRight: 16, flex: 3}}>
            <Input 
              placeholder="Your name..."
              label="Name"
              name="name"
              onChangeText={(n) => this.setState({name: n})}
              value={this.state.name}
              maxLength={40}
              error={this.state.nameError}
            />
           </View> 
           <View  style={{flex: 1}}>
            <Input 
              placeholder={this.state.creditCardType == 'amex' ? '0000' : '000'}
              label="CCV"
              name="ccv"
              onChangeText={(ccv) => this.setState({CCV: ccv})}
              value={this.state.CCV}
              maxLength={this.state.creditCardType == 'amex' ? 4 : 3}
              keyboardType='numeric' 
              error={this.state.CCVError}
              />
          </View>  
          </View>
        <Button onPress={() => this.submitPayment()}>Test</Button>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'

  },
  creditCard: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    // backgroundColor: Colors.apollo500,
    borderRadius: 10,
    padding: 15,
    justifyContent: "space-between",
  },
  creditCardText: {
    color: Colors.mist300,
    fontSize: 16,
    alignSelf: "flex-end"
  }
})

export default addPayment