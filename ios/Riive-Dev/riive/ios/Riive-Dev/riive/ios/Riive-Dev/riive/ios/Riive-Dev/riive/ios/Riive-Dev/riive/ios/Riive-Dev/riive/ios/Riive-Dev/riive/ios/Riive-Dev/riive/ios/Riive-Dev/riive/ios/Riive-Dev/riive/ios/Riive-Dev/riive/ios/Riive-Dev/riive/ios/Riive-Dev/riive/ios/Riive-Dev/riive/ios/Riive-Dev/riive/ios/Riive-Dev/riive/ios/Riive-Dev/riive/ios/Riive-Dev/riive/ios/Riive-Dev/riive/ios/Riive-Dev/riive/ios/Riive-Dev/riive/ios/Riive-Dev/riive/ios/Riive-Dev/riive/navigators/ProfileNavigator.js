import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import LegalNavigator from './LegalNavigator'

import Profile from '../screens/ProfileScreen'
import AddVehicle from '../screens/AddVehicle'
import EditVehicle from '../screens/EditVehicle'
import AddPayment from '../screens/AddPayment'
import EditPayment from '../screens/EditPayment'
import AddSpace from '../screens/AddSpace'




const ProfileNavigator = createStackNavigator({
    Profile: Profile,
    AddVehicle: AddVehicle,
    EditVehicle: EditVehicle,
    AddPayment: AddPayment,
    EditPayment: EditPayment,
    AddSpace: AddSpace,
    LegalNavigator: LegalNavigator
},
{
    
    initialRouteName: "Profile",
    
    // headerMode: "none", 
});

export default ProfileNavigator;