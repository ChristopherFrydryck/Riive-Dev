import React, {Component} from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, RefreshControl, SectionList, ActivityIndicator} from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Icon from '../components/Icon'
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
            lastRenderedItem: null,
            // secitonlist stuff
            
        }
        // this._visits = [];
        this.scrollingList = false
       

   }

   componentDidMount(){
        // Set Status Bar page info here!
    this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
            
        });

        this.updateVisits();
         
    }

    updateVisits = () => {   
        try{
            this.setState({isRefreshing: true})
            this.scrollingList = false
            const db = firebase.firestore();
            // console.log(`Fetching Original Data on ${Platform.OS}`)

            var date = new Date()
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let today = date.getDate();
            let month = months[date.getMonth()]
            let year = date.getFullYear();


    
            var spaceVisits = db.collection("trips").where("visitorID", "==", this.props.UserStore.userID)
                spaceVisits = spaceVisits.where("isCancelled", '==', false).orderBy("endTimeUnix", "desc").limit(6)

            var visits = [];
            

            spaceVisits.get().then( async(spaceData) => {

                await this.setState({lastRenderedItem: spaceData.docs[spaceData.docs.length-1]})

                for(doc of spaceData.docs){
                    const listingCollection = db.collection("listings").doc(doc.data().listingID)

                    const isToday = doc.data().visit.day.dateName === today && doc.data().visit.day.year === year && doc.data().visit.day.monthName === month;

                    await listingCollection.get().then(listing => {
                        return listing.data()
                    }).then(listing => {

                        if(isToday){
                            var title = "Today"
                        }else{
                            var title = `${days[doc.data().visit.day.dayValue]}, ${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`
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

                // Sort each day by start time
                visits.forEach(x => {
                x.data.sort((a, b) => a.visit.visit.time.start.unix - b.visit.visit.time.start.unix)
                })
                
                return(visits)

                
            }).then(arrays => {
                let a = arrays
                this.setState({isRefreshing: false, visits: a})
                this.scrollingList = true;
            })
        }catch(e){
            alert(e)
            this.setState({isRefreshing: false})
            this.scrollingList = true;
        }

    }

    _onMomentumScrollBegin = () => {
        // console.log(`Scrolling on ${Platform.OS}`)
        this.scrollingList = true;
    }

    loadMoreData = () => {
        if (this.scrollingList && !this.state.isRefreshing && this.state.lastRenderedItem) {
            try{
                // console.log(`Loading More Data on ${Platform.OS}`)
                this.setState({isRefreshing: true})
                this.scrollingList = false;
                const db = firebase.firestore();
        
                var date = new Date()
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let today = date.getDate();
                let month = months[date.getMonth()]
                let year = date.getFullYear();
            

                var spaceVisits = db.collection("trips").where("visitorID", "==", this.props.UserStore.userID)
                spaceVisits = spaceVisits.where("isCancelled", '==', false).orderBy("endTimeUnix", "desc").limit(5)

                var visits = this.state.visits;

                    spaceVisits.startAfter(this.state.lastRenderedItem).get().then( async(nextData) => {
                        await this.setState({lastRenderedItem: nextData.docs[nextData.docs.length-1]})

                        for(doc of nextData.docs){
                            const listingCollection = db.collection("listings").doc(doc.data().listingID)
            
                            const isToday = doc.data().visit.day.dateName === today && doc.data().visit.day.year === year && doc.data().visit.day.monthName === month;
            
                            await listingCollection.get().then(listing => {
                                return listing.data()
                            }).then(listing => {
            
                                if(isToday){
                                    var title = "Today"
                                }else{
                                    var title = `${days[doc.data().visit.day.dayValue]}, ${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`
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
                        // Sort each day by start time
                        visits.forEach(x => {
                            x.data.sort((a, b) => a.visit.visit.time.start.unix - b.visit.visit.time.start.unix)
                        })

                        
                        
                        return(visits)
                    }).then(arrays => {
                        let a = arrays
                        this.setState({isRefreshing: false, visits: a})
                        this.scrollingList = true;
                    })
                }catch(e){
                    alert(e)
                    this.setState({isRefreshing: false})
                    this.scrollingList = true;
                }
        }
    };

    
    renderVisit = (data) => {
        const {visit, listing, isInPast} = data;
        const hostName = `${visit.hostName.split(" ")[0]} ${visit.hostName.split(" ")[1].slice(0,1)}.`
        return(

            <TouchableOpacity style={styles.visitCard} onPress={() => console.log(data)}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{borderRadius: 4, overflow: 'hidden',}}>
                        <View style={{position: 'absolute', zIndex: 9, backgroundColor: 'white', top: 4, left: 4, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4}}>
                            <Text>{visit.price.total}</Text>
                        </View>
                        <Image 
                                aspectRatio={1/1}
                                source={{uri: listing.photo}}
                                height={100}
                                style={{shadowColor: '#000', 
                                shadowOpacity: 0.6, 
                                shadowOffset:{width: 0, height: 0}, 
                                shadowRadius: 3, 
                                elevation: 0,}}
                                resizeMode={'cover'}
                        /> 
                    </View>
                 <View style={{flex: 1, marginHorizontal: 8}}>
                    
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize: 18}}>{listing.spaceName}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>Hosted by {hostName}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>{listing.address.number} {listing.address.street}, {listing.address.city} {listing.address.state_abbr}</Text>
                    <Text>{visit.visit.time.start.labelFormatted} - {visit.visit.time.end.labelFormatted}</Text>
                {/* <Text>Is before today {isInPast ? "Yes" : "No"}</Text> */}
                
                
                 </View>
                 
                </View>
            </TouchableOpacity>  
        )
    }

    emptyComponent = () => {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32}}>
                <Icon 
                    iconName="parking"
                    iconLib="FontAwesome5"
                    iconColor={Colors.cosmos500}
                    iconSize={120}
                    style={{marginBottom: 32}}
                />
                <Text type="medium" style={{fontSize: 24, textAlign: 'center', color: Colors.cosmos500}} >You have no booked trips.</Text>
                <Text type="regular" style={{marginTop: 8, fontSize: 16, textAlign: 'center', color: Colors.cosmos500}}>Pull down to refresh and see any trips you have planned.</Text>
            </View>
        )
    }

    LoadingIndicatorBottom = () => {
        if(this.state.isRefreshing){
            return(
                <View style={{height: 80, alignItems: "center", justifyContent: 'center', paddingVertical: 16}}>
                    <ActivityIndicator color={Colors.apollo900} style={{paddingBottom: 8}}/>
                    <Text>Finding more...</Text>
                </View>
            )
        }else{
            return(
                <View style={{alignItems: "center", justifyContent: 'center', paddingVertical: 16}}>
                    <Text>No more results</Text>
                </View>
            )
        }
        
    }
 

    

    render(){
        return(
            <View style={styles.container}>
                 {/* <ScrollView refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}>
                    <Text>This is Visiting trips.</Text>
                     <View> */}
                        <SectionList
                            contentContainerStyle={{flexGrow: 1}}
                            refreshControl={<RefreshControl color={Colors.apollo900} refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}
                            ref={(ref) => { this.visitsRef = ref; }}
                            sections={this.state.visits}
                            renderItem={({item}) => this.renderVisit(item)}
                            renderSectionHeader={({section}) => <Text style={section.isInPast ? [styles.sectionHeader, styles.sectionHeaderPast] : styles.sectionHeader}>{section.title}</Text>}
                            keyExtractor={(item, index) => index}
                            onEndReachedThreshold={Platform.OS === "ios" ? 0 : 0.1}
                            onEndReached={() => this.loadMoreData()}
                            onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                            ListEmptyComponent={() => this.emptyComponent()}
                            ListFooterComponent={this.LoadingIndicatorBottom()}
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
        paddingHorizontal: 8,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        fontWeight: '400',
        color: Colors.cosmos700,
        backgroundColor: 'white'
      },
    sectionHeaderPast: {
        color: '#c2c2c2',
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
        //   borderRadius: 4,
      }
})