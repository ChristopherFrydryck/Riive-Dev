import React, {Component} from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, RefreshControl, SectionList, ViewPagerAndroid } from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Image from '../components/Image'
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
import { TouchableOpacity } from 'react-native-gesture-handler'


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
        await spaceVisits.where("isCancelled", '==', 'false')
        await spaceVisits.orderBy("endTimeUnix", "desc")
        
        
        let visits = [];
        

        await spaceVisits.limit(5).get().then( async(spaceData) => {
            for(doc of spaceData.docs){
                const listingCollection = db.collection("listings").doc(doc.data().listingID)

                const isToday = doc.data().visit.day.dateName === today && doc.data().visit.day.year === year && doc.data().visit.day.monthName === month;



                
               
                

                await listingCollection.get().then(listing => {
                    return listing.data()
                }).then(listing => {

                    if(isToday){
                        var title = "Today"
                    }else{
                        var title = `${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`
                    }

                    const timeDiff = doc.data().visit.time.end.unix - new Date().getTime()

                    let isInPast = timeDiff != Math.abs(timeDiff)

                    let visitData = {listing: listing, isInPast: isInPast, visit: doc.data()}

                    if(visits.some(x => x.title === title)){
                        let visitIndex = visits.findIndex(i => i.title === title)
                        visits[visitIndex].data.push(visitData)
                    }else{
                        visits.push({title: title, isInPast: isInPast, data: [visitData]})
                    } 
                })               
            }

            // Sort by futuremost trips
            // visits.sort((a, b) => b.data[0].visit.visit.time.end.unix - a.data[0].visit.visit.time.end.unix)
        })


        this.setState({isRefreshing: false, visits: visits})

        

    }

    
    renderVisit = (data) => {
        const {visit, listing, isInPast} = data;
        return(

            <TouchableOpacity style={styles.visitCard}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{borderRadius: 4, overflow: 'hidden'}}>
                        <Text style={{position: 'absolute', borderRadius: 4, zIndex: 9, backgroundColor: 'white', top: 4, left: 4, paddingHorizontal: 6, paddingVertical: 4}}>{visit.price.price}</Text>
                        <Image 
                                aspectRatio={1/1}
                                source={{uri: listing.photo}}
                                height={100}
                                style={{shadowColor: '#000', 
                                shadowOpacity: 0.6, 
                                shadowOffset:{width: 0, height: 0}, 
                                shadowRadius: 3, 
                                elevation: 12,}}
                                resizeMode={'cover'}
                        /> 
                    </View>
                 <View style={{flex: 1, marginHorizontal: 8}}>
                    
                    <Text style={{fontSize: 16}}>{listing.spaceName}</Text>
                    
                <Text>Is before today {isInPast ? "Yes" : "No"}</Text>
                <Text>{listing.address.number} {data.listing.address.street}</Text>
                <Text>{listing.address.city}, {listing.address.state_abbr} {listing.address.zip}</Text>
                 </View>
                 
                </View>
            </TouchableOpacity>  
        )
    }
 

    

    render(){
        return(
            <View style={styles.container}>
                 {/* <ScrollView refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}>
                    <Text>This is Visiting trips.</Text>
                     <View> */}
                        <SectionList
                            refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}
                            ref={(ref) => { this.visitsRef = ref; }}
                            sections={this.state.visits}
                            renderItem={({item}) => this.renderVisit(item)}
                            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                            keyExtractor={(item, index) => index}
                         
                        />
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
          
          height: 100,
          marginVertical: 8,
          marginHorizontal: 4,
        //   shadowColor: '#000', 
        //   shadowOpacity: 0.6, 
        //   shadowOffset:{width: 2, height: 2}, 
        //   shadowRadius: 3, 
        //   elevation: 12,
          borderRadius: 4,
      }
})