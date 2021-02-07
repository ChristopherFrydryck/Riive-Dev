import React from 'react'
import { Alert, Linking } from 'react-native'
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import messaging from '@react-native-firebase/messaging';

export let notificationPermissions = async() => {

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            let tok = await messaging().getToken();
            console.log(tok)
            console.log('Authorization status:', authStatus);
        }
    
    
    let token;
    if (Constants.isDevice) {
        try {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            // If we don't already have permission, ask for it
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Warning',
                    'You will be unable to see reminders and up to date information on your trips without push notifications. Please enable push notifications for Riive in your settings.',
                    [
                    { text: 'Cancel' },
                    // If they said no initially and want to change their mind,
                    // we can automatically open our app in their settings
                    // so there's less friction in turning notifications on
                    { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
                    ]
                )
                return false;
            }
            if(Platform.OS === 'android'){
                console.log('android')
            }else{
                console.log('ios')
            }
            
        return true;
                

        } catch (error) {
            console.log(error)
            Alert.alert(
            'Error',
            'Something went wrong while check your notification permissions, please try again later.'
            );
            return false;
        }
    }else{
        alert("Must use a physical device for push notifications")
    }
}