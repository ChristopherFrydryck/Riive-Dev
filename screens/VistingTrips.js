import React, {Component} from 'react'
import { View, ScrollView, StatusBar, Platform, StyleSheet, RefreshControl, SectionList, ViewPagerAndroid } from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'


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
        }
        this._visits = [];

        this.updateVisits.bind(this)
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
        this.setState({isRefreshing: true})
        const db = firebase.firestore();

        const spaceVisits = db.collection("trips").where("visitorID", "==", this.props.UserStore.userID)
        spaceVisits.where("isCancelled", '==', 'false')
        const listingData = db.collection("listings").where("listingID", 'array-contains', 'listings')
        

        console.log(this.props.UserStore.visits)
        await spaceVisits.get().then((spaceData) => {
            spaceData.docs.map(doc => {
                if(this._visits.some(x => x.title === `${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`)){
                    let visitIndex = this._visits.findIndex(i => i.title === `${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`)
                    this._visits[visitIndex].data.push(doc.data())
                }else{
                    this._visits.push({title: `${doc.data().visit.day.monthName} ${doc.data().visit.day.dateName} ${doc.data().visit.day.year}`, data: [doc.data()]})
                }
                
            })              
        })
        // await this._visits.sort((a, b) => a.data.visit.time.end.unix < b.data.visit.time.end.unix)

        // console.log(this._visits)

        // this._visits = [
        //     {title: 'A', data: ['ALTERED','ABBY','ACTION U.S.A.','AMUCK','ANGUISH']},  
        //     {title: 'B', data: ['BEST MEN','BEYOND JUSTICE','BLACK GUNN','BLOOD RANCH','BEASTIES']},  
        //     {title: 'C', data: ['CARTEL', 'CASTLE OF EVIL', 'CHANCE', 'COP GAME', 'CROSS FIRE',]}
        // ]

        this.setState({isRefreshing: false})

    }

    
    renderVisit = (data) => {
        return(
            <View style={styles.visitCard}>
                <Text>{data.listingID}</Text>
                <Text>{data.listingID}</Text>
            </View>  
        )
    }
 

    

    render(){
        return(
            <View style={styles.container}>
                 {/* <ScrollView refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.updateVisits}/>}>
                    <Text>This is Visiting trips.</Text>
                     <View> */}
                        <SectionList
                            ref={(ref) => { this.visitsRef = ref; }}
                            sections={this._visits}
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#F55145',
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