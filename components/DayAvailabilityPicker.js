import React, { Fragment } from 'react'
import {View, StyleSheet, Switch} from 'react-native'

import ClickableChip from './ClickableChip'
import Text from './Txt'
import Colors from '../constants/Colors'



export default class DayAvailabilityPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeDay: 1,
            daily: this.props.availability,
        }


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

        removedSelectedDay.splice(activeDay[0].dayValue - 1 , 0, activeDay[0]);

        this.setState({daily: removedSelectedDay})
        console.log(this.state.daily)
        // console.log(activeDayBlock[0])
        // console.log(removedSelectedDay)


      

        


        // this.setState({
        //     daily: {
        //         filteredDaily,
        //         dayName: "Monday", abbrName:"Mon", dayValue: 1, data: [{available: true, id: 100, start: '0000', end: '9999'}]
        //     }
        // })

        // console.log(this.state.daily)

        // this.setState({daily:  [
        //     {dayName: "Monday", abbrName:"Mon", dayValue: 1, data: [{available: true, id: 200, start: '0000', end: '1059'}, 
        //     {available: false, id: 201, start: '1100', end: '2359'}]}]})
        // this.props.availability
        // console.log("---------------------------------------")
        // console.log(this.state.daily)
        // console.log(this.props.availability)

    }

    changeDay = (dv) => {
        this.setState({activeDay: dv})
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



        
        
          

        return(
            <Fragment>
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
                <View style={{paddingVertical: 8}}>
                   
                       
                                
                        {this.state.daily[this.state.activeDay - 1].data.map((option, i) => {
                           
                            return(
                            <View key={option.id} style={{paddingVertical: 16}}>
                                 <Text>{this.convertToCommonTime(option.start)} => {this.convertToCommonTime(option.end)}</Text>
                                <Switch
                                    onValueChange={() => this.changeAvailability(this.state.daily[this.state.activeDay - 1], option.id)}
                                    value={option.available}
                                />
                            </View> 
                            )
                            
                        })}
                            
                     
                     
                  
                   
                    
                        
                         
                    
                    
                     
                    
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