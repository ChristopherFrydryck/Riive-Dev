import React from 'react'
import { Alert, Linking, Platform } from 'react-native'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import messaging from '@react-native-firebase/messaging';

export let notificationPermissions = async() => {
    if(Platform.OS === 'ios'){
        if(Constants.isDevice){
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                let tok = await messaging().getToken();
                console.log(tok)
                console.log('Authorization status:', authStatus);
                messaging().onMessage((payload) => {
                    const {title, body} = payload.notification;
                    const { data, messageId } = payload;

                    Alert.alert(title, body, [{text: 'Close'}])
                })
            }else{
                Alert.alert(
                    'Warning',
                    'You will be unable to see reminders and up to date information on your trips without push notifications. Please enable push notifications for Riive in your settings.',
                    [
                    { text: 'Cancel' },
                    // If they said no initially and want to change their mind,
                    // we can automatically open our app in their settings
                    // so there's less friction in turning notifications on
                    { text: 'Enable Notifications', onPress: () => Linking.openURL('app-settings:')}
                    ]
                )
            }
        }else{
            alert("Must use a physical device for push notifications");
        }
    }else{
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
                        { text: 'Enable Notifications', onPress: () => Linking.openSettings() }
                        ]
                    )
                    return false;
                }
                token = await Notifications.getDevicePushTokenAsync({
                    gcmSenderId: "888723186328",
                })
                console.log(token);
                
                
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
    
    
    
}