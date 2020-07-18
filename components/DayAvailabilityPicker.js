import React, { Fragment } from 'react'
import {View, StyleSheet} from 'react-native'

import ClickableChip from './ClickableChip'
import Text from './Txt'
import Colors from '../constants/Colors'

export default class DayAvailabilityPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeDay: 0,
        }
    }

    render(){
        let ActiveDayAvailability = []
        for(let i = 0; i < this.props.availability.length; i++){
            if(this.props.availability[i].dayValue == this.state.activeDay){
                ActiveDayAvailability.push(this.props.availability[i])
            }else{
                continue;
            }
        }

        return(
            <Fragment>
                <View style={styles.daysRow}>
                    {this.props.availability.map((x) => (
                        <ClickableChip key={x.dayValue} 
                        bgColor={x.dayValue == this.state.activeDay ? Colors.apollo900 : "#FFFFFF"} 
                        textColor={x.dayValue == this.state.activeDay ? "#FFFFFF" : "#000000"}
                        onPress={() => this.setState({activeDay: x.dayValue})} 
                        style={{flex: 1}}>
                            {x.abbrName}
                        </ClickableChip>
                    ))}
                </View>
                <View>
                    <Text>{ActiveDayAvailability[0].dayName}</Text>
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