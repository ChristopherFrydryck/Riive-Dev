import React, { Fragment } from 'react'
import {View, StyleSheet, Switch, Modal, SafeAreaView, Dimensions, Animated} from 'react-native'

import ClickableChip from './ClickableChip'
import Text from './Txt'
import Colors from '../constants/Colors'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'



export default class DayAvailabilityPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeDay: new Date().getDay(),
            daily: this.props.availability,
            timeSlotModalVisible: false,
            activeTimeFadeAnimation: new Animated.Value(0)
        }


    }

    componentDidMount() {
        this.fadeAnimation();
    }

    convertToCommonTime = (t) => {
        let hoursString = t.substring(0,2)
        let minutesString = t.substring(2)


        
        let hours = parseInt(hoursString) == 0 ? "12" : parseInt(hoursString) > 12 ? (parseInt(hoursString) - 12).toString() : hoursString;
        // let minutes = parseInt(minutesString)
        return(`${hours}:${minutesString} ${parseInt(hoursString) >= 12 ? 'PM' : 'AM'}`)
    }

    changeAvailability = (day, id) => {

        var newDaily = this.state.daily;
        var removedSelectedDay = newDaily.filter(x => x.dayValue != day.dayValue);
        var activeDay = newDaily.filter(x => x.dayValue == day.dayValue);
        var activeDayBlock = activeDay[0].data.filter(x => x.id == id);

        activeDayBlock[0].available = !activeDayBlock[0].available;

        removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

        this.setState({daily: removedSelectedDay})
        console.log(this.state.daily)
        // console.log(activeDayBlock[0])
        // console.log(removedSelectedDay)

    }
    

    fadeAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(          // Animate over time
                    this.state.activeTimeFadeAnimation, // The animated value to drive
                    {
                        toValue: 1,           // Animate to opacity: 1 (opaque)
                        duration: 2000,       // 2000ms
                    }),
                    Animated.timing(          // Animate over time
                        this.state.activeTimeFadeAnimation, // The animated value to drive
                        {
                            toValue: 0,           // Animate to opacity: 1 (opaque)
                            duration: 2000,       // 2000ms
                        }),
            ]) 
        ).start();                  
    }


    changeDay = (dv) => {
        this.setState({activeDay: dv})
        this.fadeAnimation();
    }

    render(){
        // var reducedArray = this.state.daily.reduce((filtered, option) => {
        //     if(option.dayValue == this.state.activeDay){
        //         return filtered.concat({
        //             dayName: option.dayName, abbrName: option.abbrName, dayValue: option.dayValue, data: option.data
        //         })
        //         }
        //         return filtered
        //     }, [])
        var dayToday = new Date().getDay()
        var hourToday = new Date().getHours()


        
          

        return(
            <Fragment>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.timeSlotModalVisible}
                    onRequestClose={() => this.setState({timeSlotModalVisible: false})}
                    
                >
                    <SafeAreaView style={{paddingTop: 10, marginHorizontal: 16, flex: 1}}>
                    <TopBar>
                        <Text style={{fontSize: 20, marginRight: 'auto', marginTop: 8}}>Edit {this.state.daily[this.state.activeDay].dayName} Availability</Text>
                            <Icon 
                                iconName="x"
                                iconColor={Colors.cosmos500}
                                iconSize={28}
                                onPress={() => this.setState({timeSlotModalVisible: false})}
                                style={{marginTop: 10, marginLeft: "auto", marginRight: 5}}
                            />
                        </TopBar>
                        <Text>Hello</Text>
                    </SafeAreaView>

                    
                </Modal>
                <View style={styles.daysRow}>
                    {this.props.availability.map((x) => (
                        
                        <ClickableChip key={x.dayValue} 
                        bgColor={x.dayValue == this.state.activeDay ? Colors.apollo900 : "#FFFFFF"} 
                        textColor={x.dayValue == this.state.activeDay ? "#FFFFFF" : "#000000"}
                        onPress={() => this.changeDay(x.dayValue)} 
                        style={{flex: 1}}>
                            {x.abbrName}
                        </ClickableChip>
                    ))}
                </View>
                <View style={{paddingVertical: 16}}>
                   
                       
                                
                        {this.state.daily[this.state.activeDay].data.map((option, i) => {
                            console.log(option)
                        //    console.log(`${parseInt(option.start.substring(0,2))} => ${hourToday}`)
                            return(
                            <View key={option.id} style={{padding: 16, display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',borderColor: Colors.mist900, borderTopWidth: 1, borderBottomWidth: i == 0  && this.state.daily[this.state.activeDay].data.length > 1 ? 0 : 1, backgroundColor: 'white'}}>   
                                <View style={{ flexDirection: "row", alignItems: 'center'}}>
                                    {dayToday == this.state.daily[this.state.activeDay].dayValue &&  parseInt(option.start.substring(0,2)) <= hourToday && parseInt(option.end.substring(0,2)) >= hourToday?
                                    <Animated.View style={{opacity: this.state.activeTimeFadeAnimation, width: 8, height: 8, backgroundColor: Colors.fortune500, borderRadius: Dimensions.get("window").width/2, marginRight: 8}}></Animated.View>
                                    : null }
                                    <Text style={{fontSize: 16}}>{this.convertToCommonTime(option.start)} - {this.convertToCommonTime(option.end)}</Text>
                                    </View>
                                    <Text style={{color: option.available ? Colors.fortune900 : "#000000"}}>{option.available ? "Available" : "Unavailable"}</Text>
                                
                                {/* <Switch
                                    onValueChange={() => this.changeAvailability(this.state.daily[this.state.activeDay - 1], option.id)}
                                    value={option.available}
                                /> */}
                            </View> 
                            )
                            
                        })}
                        <Button style={{backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: Colors.tango900}} textStyle={{color: Colors.tango900}} onPress={() => this.setState({timeSlotModalVisible: true})}>Edit Time Slot{this.state.daily[this.state.activeDay].data.length > 1 ? "s" : null}</Button>
                            
                     
                     
                  
                   
                    
                        
                         
                    
                    
                     
                    
                </View>
            </Fragment>
             
            
            
        )
    }
}

const styles = StyleSheet.create({
    daysRow:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between"
    }
})