import React from 'react';
import { Text, View, ActivityIndicator, YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Navigator from './navigators/MainNavigator'
import AuthNavigator from './navigators/AuthNavigator'

import * as Font from 'expo-font'



import { observer, Provider } from 'mobx-react/native'
import UserStore from './stores/userStore'
import ComponentStore from './stores/componentStore'

// Firebase imports
import * as firebase from 'firebase'
import firebaseConfig from './firebaseConfig'
import 'firebase/firestore';
import 'firebase/auth';

import stripe from 'tipsi-stripe'

stripe.setOptions({
  publishableKey: 'pk_test_lojsrOCvzrsIiGQFXSUquLHX00pzpkST7r',
  // merchantId: 'MERCHANT_ID', // Optional
  androidPayMode: 'test', // Android only
})


if (!firebase.apps.length) {

  // Initlialized FB Vars
  firebase.initializeApp(firebaseConfig);


}


const stores = {
    UserStore, ComponentStore
}



// const AppContainer = createAppContainer(Navigator);
var route = "Auth"
export default class App extends React.Component {
  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(['Setting a timer'])
    this.state ={
      fontLoaded: false
    }
  }


  async componentDidMount(){
    
    await Font.loadAsync({
      'WorkSans-Thin': require('./assets/fonts/WorkSans-Thin.otf'),
      'WorkSans-SemiBold': require('./assets/fonts/WorkSans-SemiBold.otf'),
      'WorkSans-Regular': require('./assets/fonts/WorkSans-Regular.otf'),
      'WorkSans-Medium': require('./assets/fonts/WorkSans-Medium.otf'),
      'WorkSans-Light': require('./assets/fonts/WorkSans-Light.otf'),
      'WorkSans-Italic': require('./assets/fonts/WorkSans-Italic.otf'),
      'WorkSans-ExtraLight': require('./assets/fonts/WorkSans-ExtraLight.otf'),
      'WorkSans-ExtraBold': require('./assets/fonts/WorkSans-ExtraBold.otf'),
      'WorkSans-Bold': require('./assets/fonts/WorkSans-Bold.otf'),
      'WorkSans-Black': require('./assets/fonts/WorkSans-Black.otf'),
      'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
      'Feather': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
      'Entypo': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Entypo.ttf'),
      'EvilIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/EvilIcons.ttf'),
      'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
      'AntDesign': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf'),
      'Foundation': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Foundation.ttf'),
      'MaterialCommunityIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
      'MaterialIcons.font': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),

      
      
      
    });



    this.setState({fontLoaded: true})




    
      
      
  
  }

  render() {
    if (this.state.fontLoaded){
      return (
        
        <Provider {...stores}>
          <AuthNavigator initRoute="Home"/>
        </Provider>
      )
    }else{
      return(
      <View style={{flex: 1, flexDirection:'column', justifyContent:'center'}}> 
        <ActivityIndicator style={{alignSelf:'center'}}/>
      </View>
      )
    }
  }
}

