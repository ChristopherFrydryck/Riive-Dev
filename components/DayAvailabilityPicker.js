import React, { Fragment } from 'react'
import {View, StyleSheet, Switch, Modal, SafeAreaView, Dimensions, Animated, Picker, Platform} from 'react-native'


import Text from './Txt'
import Colors from '../constants/Colors'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import Dropdown from '../components/Dropdown'
import ClickableChip from '../components/ClickableChip'
import ModalSelector from 'react-native-modal-selector'

import Times from '../constants/TimesAvailable'

import { ScrollView } from 'react-native-gesture-handler'
import { act } from 'react-test-renderer'



export default class DayAvailabilityPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeDay: new Date().getDay(),
            
            dailyStaging: this.props.availability,
      
            timesValid: [true, true, true, true, true, true, true],
            timeSlotModalVisible: false,
            activeTimeFadeAnimation: new Animated.Value(0),
            daily: JSON.parse(JSON.stringify(this.props.availability)),
            
        }


    }

    componentDidMount () {
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

        var newDaily = this.state.dailyStaging;
        var removedSelectedDay = newDaily.filter(x => x.dayValue != day.dayValue);
        var activeDay = newDaily.filter(x => x.dayValue == day.dayValue);
        var activeDayBlock = activeDay[0].data.filter(x => x.id == id);



        activeDayBlock[0].available = !activeDayBlock[0].available;

        removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

        this.setState(state => ({dailyStaging: removedSelectedDay}))
        

        

      
        // console.log(activeDayBlock[0])
        // console.log(removedSelectedDay)

    }

    testValidAvailability = () => {
        // Error checking schedule
        if(this.state.dailyStaging[this.state.activeDay].data.length == 1){
            if(this.state.dailyStaging[this.state.activeDay].data[0].start == "0000" && this.state.dailyStaging[this.state.activeDay].data[0].end == "2359"){
                let timesValidValue = [...this.state.timesValid]
                timesValidValue[this.state.activeDay] = true
                this.setState({timesValid: timesValidValue})
              
            }else{
                let timesValidValue = [...this.state.timesValid]
                timesValidValue[this.state.activeDay] = false
                this.setState({timesValid: timesValidValue})
           
            }
        }else{
            let sortedDaily = this.state.dailyStaging[this.state.activeDay].data.sort((a, b) => parseInt(a.start) - parseInt(b.start))
            // console.log(sortedDaily)
            if(sortedDaily[0].start == "0000" && sortedDaily[sortedDaily.length - 1].end == "2359"){
                // console.log("Success")
                for(let i = 0; i < sortedDaily.length; i++){
                    if(sortedDaily[i+1]){
                        if(parseInt(sortedDaily[i+1].start) - parseInt(sortedDaily[i].end) == 41 || parseInt(sortedDaily[i+1].start) - parseInt(sortedDaily[i].end) == 1){
                            let timesValidValue = [...this.state.timesValid]
                            timesValidValue[this.state.activeDay] = true
                            this.setState({timesValid: timesValidValue})
                            continue;
                        }else{
                            let timesValidValue = [...this.state.timesValid]
                            timesValidValue[this.state.activeDay] = false
                            this.setState({timesValid: timesValidValue})
                            break;
                        }
                    }
                }
            }else{
                let timesValidValue = [...this.state.timesValid]
                timesValidValue[this.state.activeDay] = false
                this.setState({timesValid: timesValidValue})

            }
           
        }
    }

    changeStartTime = (input, dayValue, id) => {
        var timeSelected;

        var newDaily = this.state.dailyStaging;
        // Removes active day from array of all days and availability
        var removedSelectedDay = newDaily.filter(x => x.dayValue != dayValue);
        // Showcases only current active day and availability
        var activeDay = newDaily.filter(x => x.dayValue == dayValue);
        // Showcases only edited block of data within the entire active day
        var activeDayBlock = activeDay[0].data.filter(x => x.id == id);

       

        

        if(Platform.OS === 'ios'){
            timeSelected = input.baseValue
            activeDayBlock[0].start = timeSelected;
            removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

            this.setState({dailyStaging: removedSelectedDay})

            
        
            // console.log(removedSelectedDay)
        }else{
            timeSelected = input
            activeDayBlock[0].start = timeSelected;
            removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

            this.setState({dailyStaging: removedSelectedDay})
        }


        // Error checking schedule
       this.testValidAvailability()
        

        // console.log(timeSelected)
    }

    changeEndTime = (input, dayValue, id) => {
        var timeSelected;

        var newDaily = this.state.dailyStaging;
        // Removes active day from array of all days and availability
        var removedSelectedDay = newDaily.filter(x => x.dayValue != dayValue);
        // Showcases only current active day and availability
        var activeDay = newDaily.filter(x => x.dayValue == dayValue);
        // Showcases only edited block of data within the entire active day
        var activeDayBlock = activeDay[0].data.filter(x => x.id == id);

        

        if(Platform.OS === 'ios'){
            timeSelected = input.baseValue
            activeDayBlock[0].end = timeSelected;
            removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

            this.setState({dailyStaging: removedSelectedDay})
      
            // console.log(removedSelectedDay)
        }else{
            timeSelected = input
            activeDayBlock[0].end = timeSelected;
            removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

            this.setState({dailyStaging: removedSelectedDay})
        }

        // Error checking schedule
        this.testValidAvailability()

           
    
    }




    fadeAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(          // Animate over time
                    this.state.activeTimeFadeAnimation, // The animated value to drive
                    {
                        toValue: 1,           // Animate to opacity: 1 (opaque)
                        duration: 1000,       // 2000ms
                    }),
                    Animated.timing(          // Animate over time
                        this.state.activeTimeFadeAnimation, // The animated value to drive
                        {
                            toValue: 0,           // Animate to opacity: 1 (opaque)
                            duration: 1000,       // 2000ms
                        }),
            ]) 
        ).start();                  
    }


    changeDay = (dv) => {
        this.setState({activeDay: dv})
        this.fadeAnimation();
    }

    deleteTimeSlot = (day, id) => {
        
        // Gather data of current day
        var timeSlots = day.data
        // Remove day deleted from the data
        var removedTimeSlot = timeSlots.filter(x => x.id != id)
        // get current data of day and add new data with removed time
        var dailyVals = this.state.dailyStaging[this.state.activeDay];
        dailyVals.data = removedTimeSlot;

        var newDaily = this.state.dailyStaging;
        // Removes active day from array of all days and availability
        var removedSelectedDay = newDaily.filter(x => x.dayValue != this.state.dailyStaging[this.state.activeDay].dayValue);
        // Showcases only current active day and availability
        var activeDay = newDaily.filter(x => x.dayValue == this.state.dailyStaging[this.state.activeDay].dayValue);

     
        removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

        this.setState({dailyStaging: removedSelectedDay})
        this.testValidAvailability()


    }

    addTimeSlot = (startTime, endTime) => {
        var newDaily = this.state.dailyStaging;
        // Removes active day from array of all days and availability
        var removedSelectedDay = newDaily.filter(x => x.dayValue != this.state.dailyStaging[this.state.activeDay].dayValue);
        // Showcases only current active day and availability
        var activeDay = newDaily.filter(x => x.dayValue == this.state.dailyStaging[this.state.activeDay].dayValue);

        activeDay[0].data.push({
            "available": true,
            "end": endTime,
            "id": null,
            "start": startTime,
        })

        activeDay[0].data.sort((a, b) => {parseInt(a.start) - parseInt(b.start)})

        for(let i = 0; i < activeDay[0].data.length; i++){
            if(i < 10){
                activeDay[0].data[i].id = parseInt(`${activeDay[0].dayValue + 1}0${i}`)
            }else{
                activeDay[0].data[i].id = parseInt(`${activeDay[0].dayValue + 1}${i}`)
            }
           
        }

      
       

     
        removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);

        // console.log(removedSelectedDay)

        this.setState({dailyStaging: removedSelectedDay})

    }

    createTimeSpan = (option) => {
        if(this.state.dailyStaging[this.state.activeDay].data.length == 1){
            if(this.state.dailyStaging[this.state.activeDay].data[0].end == "2359"){
                var newDaily = this.state.dailyStaging;
                // Showcases only current active day and availability
                var activeDay = newDaily.filter(x => x.dayValue == this.state.dailyStaging[this.state.activeDay].dayValue);
                // Removes active day from array of all days and availability
                var removedSelectedDay = newDaily.filter(x => x.dayValue != this.state.dailyStaging[this.state.activeDay].dayValue);


                activeDay[0].data[0] = {
                    "available": this.state.dailyStaging[this.state.activeDay].data[0].available,
                    "end": "1159",
                    "id": this.state.dailyStaging[this.state.activeDay].data[0].id,
                    "start": "0000",
                }

                removedSelectedDay.splice(activeDay[0].dayValue, 0, activeDay[0]);


                this.setState({dailyStaging:  removedSelectedDay})
                this.addTimeSlot("1200", "2359")
                this.testValidAvailability()
            }else{
                this.addTimeSlot(Times[0].start[Times[1].end.indexOf(this.state.dailyStaging[this.state.activeDay].data[0].end) + 1],"2359")
                this.testValidAvailability()
            }
        }else{
            let nextDayIndex = this.state.dailyStaging[this.state.activeDay].data.indexOf(option) + 1;

            // See if it is the last option where we add an end time
            if(nextDayIndex + 1 > this.state.dailyStaging[this.state.activeDay].data.length){
                this.addTimeSlot(Times[0].start[Times[1].end.indexOf(option.end) + 1], "2359")
            }else{
                this.addTimeSlot(Times[0].start[Times[1].end.indexOf(option.end) + 1],
            Times[1].end[Times[0].start.indexOf(this.state.dailyStaging[this.state.activeDay].data[nextDayIndex].start) - 1])
            }
            
            this.testValidAvailability()
        }

        // console.log(this.state.dailyStaging[this.state.activeDay].data.indexOf(option))

        // console.log(this.state.dailyStaging[this.state.activeDay].data)

        // console.log(option)

    }


    getNextDay = (d, increment) => {
        if(d.substring(2) == '29' || d.substring(2) == '59'){
            const dayIndex = Times[1].end.indexOf(d)
            return Times[1].end[dayIndex + increment]
        }else{
            const dayIndex = Times[0].start.indexOf(d)
            return Times[0].start[dayIndex + increment]
        }
    }

    openModal = () => {
        
        this.setState((prevState, state) => ({timeSlotModalVisible: true}))
        this.testValidAvailability()


    }

    closeModal = async () => {
      
      await  this.setState((prevState) => ({timeSlotModalVisible: false}))


    }

    updateAvailability = async () => {
        const val = JSON.stringify(this.state.dailyStaging)
        await this.setState((prevState) => ({daily: JSON.parse(val), timeSlotModalVisible: false}))
      
        
    }

    render(){

        var dayToday = new Date().getDay()
        var hourToday = new Date().getHours()

        
        var startTimes = [];
        for (var i = 0 ; i < Times[0].start.length; i++){
           startTimes.push({key: i, label: Times[0].start[i], labelFormatted: this.convertToCommonTime(Times[0].start[i])})
        }

   

        var endTimes = []
        for (var i = 0 ; i < Times[1].end.length; i++){
            endTimes.push({key: i, label: Times[1].end[i], labelFormatted: this.convertToCommonTime(Times[1].end[i])})
         }

     



        
          

        return(
            
            <Fragment>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.timeSlotModalVisible}
                    onRequestClose={() => this.closeModal()}
                >
                    <SafeAreaView style={{paddingTop: 16, paddingHorizontal: 16, flex: 1, alignItems: 'center'}}>
                    <View>
                        <TopBar style={{flex: 0}}>
                            <Text style={{fontSize: 20, marginRight: 'auto', marginTop: 8}}>{this.state.dailyStaging[this.state.activeDay].dayName} Availability</Text>
                                <Icon 
                                    iconName="x"
                                    iconColor={Colors.cosmos500}
                                    iconSize={28}
                                    onPress={() => this.closeModal()}
                                    style={{marginTop: 10, marginLeft: "auto", marginRight: 5}}
                                />
                            </TopBar>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16, marginBottom: 8}}>
                                <Text>Time</Text>
                                <Text>Available</Text>
                            </View>
                            <ScrollView contentContainerStyle={{flex: 1}}>
                        
                            {this.state.dailyStaging[this.state.activeDay].data.map((option, i) => {
                 
                                return(
                                <View key={option.id} >
                                    <View  style={{paddingHorizontal: 16, display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',borderColor: Colors.mist900, borderTopWidth: 1, borderBottomWidth: i == 0  && this.state.dailyStaging[this.state.activeDay].data.length > 1 ? 0 : 1, backgroundColor: 'white'}}> 

                                    {/* Delete Icon */}
                                    {this.state.dailyStaging[this.state.activeDay].data.length > 1 ?
                                    <Icon 
                                        iconName="trash"
                                        iconColor={Colors.hal500}
                                        iconSize={20}
                                        onPress={() => this.deleteTimeSlot(this.state.dailyStaging[this.state.activeDay], option.id)}
                                    /> 
                                    : null}
                            
                                    <View style={{flexDirection: 'row', flex: 2, justifyContent: 'space-evenly'}}>

                                        <Dropdown 
                                            style={{minWidth: 145}}
                                            label="Start Time"
                                    
                                            selectedValue={this.convertToCommonTime(option.start)}
                                            onValueChange={(x) => this.changeStartTime(x, this.state.dailyStaging[this.state.activeDay].dayValue, option.id)}
                                        >
                                            {Platform.OS === 'ios' ?
                                                this.state.dailyStaging[this.state.activeDay].data[i - 1] ?
                                                    startTimes.filter(x => parseInt(x.label) > parseInt(this.state.dailyStaging[this.state.activeDay].data[i - 1].end)).map(x => {
                                                        return({key: x.key, label: x.labelFormatted, baseValue: x.label})
                                                    })
                                                :
                                                    startTimes.filter(x => parseInt(x.label) < parseInt(this.state.dailyStaging[this.state.activeDay].data[i].end)).map(x => {
                                                        return({key: x.key, label: x.labelFormatted, baseValue: x.label})
                                                    })
                                            :   
                                                this.state.dailyStaging[this.state.activeDay].data[i - 1] ?
                                                    startTimes.filter(x => parseInt(x.label) > parseInt(this.state.dailyStaging[this.state.activeDay].data[i - 1].end)).map(x => {
                                                        return(<Picker.Item key={x.key} label={x.labelFormatted} value={x.label} />)
                                                    }) 
                                                :
                                                    startTimes.filter(x => parseInt(x.label) < parseInt(this.state.dailyStaging[this.state.activeDay].data[i].end)).map(x => {
                                                    return(<Picker.Item key={x.key} label={x.labelFormatted} value={x.label} />)
                                                    })  
                                            }
                                        </Dropdown>

                                        <Dropdown 
                                            style={{minWidth: 145}}
                                            label="End Time"
                                            selectedValue={this.convertToCommonTime(option.end)}
                                            onValueChange={(x) => this.changeEndTime(x, this.state.dailyStaging[this.state.activeDay].dayValue, option.id)}
                                        
                                        >
                                            {Platform.OS === 'ios' ?
                                                this.state.dailyStaging[this.state.activeDay].data[i + 1] ?
                                                endTimes.filter(x => parseInt(x.label) > parseInt(option.start) && parseInt(this.state.dailyStaging[this.state.activeDay].data[i + 1].start) > parseInt(x.label)).map(x => {
                                                    return({key: x.key, label: x.labelFormatted, baseValue: x.label})
                                                })
                                                :
                                            endTimes.filter(x => parseInt(x.label) > parseInt(option.start)).map(x => {
                                                return({key: x.key, label: x.labelFormatted, baseValue: x.label})
                                            })
                                            :  
                                                this.state.dailyStaging[this.state.activeDay].data[i + 1] ? 
                                                endTimes.filter(x => parseInt(x.label) > parseInt(option.start) && parseInt(this.state.dailyStaging[this.state.activeDay].data[i + 1].start) > parseInt(x.label)).map(x => {
                                                    return(<Picker.Item key={x.key} label={x.labelFormatted} value={x.label} />)
                                                })  
                                                :
                                                endTimes.filter(x => parseInt(x.label) > parseInt(option.start)).map(x => {
                                                    return(<Picker.Item key={x.key} label={x.labelFormatted} value={x.label} />)
                                                }) 
                                            }
                                        </Dropdown>
                        

                                
                                    
                                        {/* <Text style={{fontSize: 16}}>{this.convertToCommonTime(option.start)} - {this.convertToCommonTime(option.end)}</Text> */}
                                    
                                    </View>
                                    
                                    
                                    
                                        
                                    
                                    <Switch
                            
                                        onValueChange={() => this.changeAvailability(this.state.dailyStaging[this.state.activeDay], option.id)}
                                        value={option.available}
                                    />
                                   
                                </View> 
                        
                                     {/* Add time button */}
                                    {this.state.dailyStaging[this.state.activeDay].data[i + 1] && parseInt(this.state.dailyStaging[this.state.activeDay].data[i + 1].start) - parseInt(this.state.dailyStaging[this.state.activeDay].data[i].end) != 41 && parseInt(this.state.dailyStaging[this.state.activeDay].data[i + 1].start) - parseInt(this.state.dailyStaging[this.state.activeDay].data[i].end) != 1 || this.state.dailyStaging[this.state.activeDay].data.length == 1 ||  this.state.dailyStaging[this.state.activeDay].data[i] == this.state.dailyStaging[this.state.activeDay].data[this.state.dailyStaging[this.state.activeDay].data.length - 1] && this.state.dailyStaging[this.state.activeDay].data[i].end != "2359" ? 
                                        <ClickableChip 
                                            bgColor='rgba(255, 193, 76, 0.3)' // Colors.Tango300 with opacity of 30%
                                            style={{width: 130}}
                                           
                                            onPress={() => this.createTimeSpan(option)}
                                            textColor={Colors.tango700}>
                                                + Add Time Slot
                                        </ClickableChip> : null}
                             
                            
                                </View>
                                )
                                
                            })}
                              <Button style={this.state.timesValid[this.state.activeDay] ? {backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: Colors.tango900, marginBottom: 32, alignSelf: 'flex-end'} : {backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: Colors.mist900}} textStyle={ this.state.timesValid[this.state.activeDay] ? {color: Colors.tango900} : {color: Colors.mist900}} onPress={() => this.updateAvailability()} disabled={!this.state.timesValid[this.state.activeDay]}>Save Changes on {this.state.dailyStaging[this.state.activeDay].dayName}</Button>
                            </ScrollView>
                        
                            </View>
                          
                            
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
                        <Button style={{backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: Colors.tango900}} textStyle={{color: Colors.tango900}} onPress={(x) => this.openModal()}>Edit Time Slot{this.state.daily[this.state.activeDay].data.length > 1 ? "s" : null}</Button>
                       

                            
                     
                     
                  
                   
                    
                        
                         
                    
                    
                     
                    
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