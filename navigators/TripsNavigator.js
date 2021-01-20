import React from 'react'
import { SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import Colors from '../constants/Colors'

import HostedTrips from '../screens/HostedTrips'
import VisitingTrips from '../screens/VistingTrips'

class MaterialTopTabBarWrapper extends React.Component {
    render() {
      return (
        <SafeAreaView
          forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}>
          <MaterialTopTabBar {...this.props} />
        </SafeAreaView>
      );
    }
  }
  

const TripsNavigator = createMaterialTopTabNavigator({
    VisitingTrips: {
        screen: VisitingTrips,
        navigationOptions: {
            tabBarLabel: 'Visiting Trips',
        }
    },
    HostedTrips: {
        screen: HostedTrips,
        navigationOptions: {
            tabBarLabel: 'Hosted Trips',
        }
    },
    
},
{   
    tabBarComponent: MaterialTopTabBarWrapper,
    initialRouteName: "VisitingTrips",
    navigationOptions:{
        title: "Trips",
        headerStyle: { borderBottomColor: 'transparent' },
        
    },
    tabBarOptions: {
        labelStyle: {
          fontSize: 14,
          color: Colors.apollo900,
        },
        indicatorStyle: {
            backgroundColor: Colors.tango900,

        },
        tabStyle: {
          
        },
        style: {
          backgroundColor: "white",
          borderTop: 'transparent',
        },
      },
    
    headerMode: "none", 
});

export default TripsNavigator;