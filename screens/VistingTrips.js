import React, {Component} from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, RefreshControl, SectionList, ViewPagerAndroid } from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Colors from '../constants/Colors'

import * as firebase from 'firebase'
import firebaseConfig from '../firebaseConfig'
import withFirebaseAuth from 'react-with-firebase-auth'
import 'firebase/auth';
import 'firebase/firestore';

//MobX Imports
import {inject, observer} from 'mobx-react/native'
import { Constants } from 'expo-constants';
import { TouchableWithoutFeedback } from 'react-native';


@inject("UserStore", "ComponentStore")
@observer
export default class VisitingTrips extends Component{
   constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            visits: [],
        }
        // this._visits = [];

   
   }

   componentDidMount(){
    // Set Status Bar page info here!
   this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('dark-content', true);
        Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
        
    });

    this.updateVisits();
    
}



    updateVisits = async() => {
        console.log("Yo")
        this.setState({isRefreshing: true})
        const db = firebase.firestore();

        var date = new Date()
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let today = date.getDate();
        let month = months[date.getMonth()]
        let year = date.getFullYear();

        const spaceVisits = db.collection("trips").where("visitorID", "==", this.props.UserStore.userID)
        spaceVisits.where("isCancelled", '==', 'false')


        let tomorrowAtMidnight = new Date();
                tomorrowAtMidnight.setDate(tomorrowAtMidnight.getDate() + 1)
                tomorrowAtMidnight.setHours(0)
                tomorrowAtMidnight.setMinutes(0)
                tomorrowAtMidnight.setMilliseconds(0)
        
        
        let visits = [];
        

        await spaceVisits.limit(3).get().then( async(spaceData) => {
            for(doc of spaceData.docs){
                const listingCollection = db.collection("listings").doc(doc.data().listingID)

                const isToday = doc.data().visit.day.dateName === today && doc.data().visit.day.year === year && doc.data().visit.day.monthName === month;

                

                const beforeToday = (parseInt(doc.data().visit.time.end.unix) < tomorrowAtMidnight)
                // console.log(`Tomorrow date unix: ${new Date().setHours(24,0,0,0)} Visit time end: ${doc.data().visit.time.end.unix}`)
               
                

                await listingCollection.get().then(listing => {
                    return listing.data()
                }).then(listing => {
                    if(isToday){
                        var title = "Today"
                    }else{
                        var title = `${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`
                    }

                    if(visits.some(x => x.title === title)){
                        let visitIndex = visits.findIndex(i => i.title === title)
                        visits[visitIndex].data.push({listing: listing, isInPast: beforeToday, visit: doc.data()})
                    }else{
                        visits.push({title: title, isInPast: beforeToday, data: [{listing: listing, visit: doc.data()}]})
                    } 
                })               
            }

            // Sort by futuremost trips
            visits.sort((a, b) => b.data[0].visit.visit.time.end.unix - a.data[0].visit.visit.time.end.unix)
        })


        this.setState({isRefreshing: false, visits: visits})

        

    }

    
    renderVisit = (data) => {
        return(
            <View style={styles.visitCard}>
                <Text>{data.listing.spaceName}</Text>
                <Text>Is before today {data.isInPast ? "Yes" : "No"}</Text>
                <Text>{data.listing.address.number} {data.listing.address.street}</Text>
                <Text>{data.listing.address.city}, {data.listing.address.state_abbr} {data.listing.address.zip}</Text>
            </View>  
        )
    }
 

    

    render(){
        return(
            <View style={styles.container}>
                 {/* <ScrollView refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}>
                    <Text>This is Visiting trips.</Text>
                     <View> */}
                        {/* <SectionList
                            refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}
                            ref={(ref) => { this.visitsRef = ref; }}
                            sections={this.state.visits}
                            renderItem={({item}) => this.renderVisit(item)}
                            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                            keyExtractor={(item, index) => index}
                         
                        /> */}
               {/* </View>
             </ScrollView> */}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 8,
        paddingHorizontal: 8
    },
    sectionHeader: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        fontWeight: '400',
        color: Colors.cosmos300,
        backgroundColor: 'white'
      },
    
      item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
      visitCard: {
          backgroundColor: 'white',
          flex: 1,
          marginVertical: 8,
          marginHorizontal: 4,
          shadowColor: '#000', 
          shadowOpacity: 0.6, 
          shadowOffset:{width: 2, height: 2}, 
          shadowRadius: 3, 
          elevation: 12,
          borderRadius: 4,
      }
})