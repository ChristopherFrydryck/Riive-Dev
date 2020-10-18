import React, { Fragment } from 'react'
import {View, StyleSheet, Switch, Modal, SafeAreaView, Dimensions, Animated, Picker, Platform} from 'react-native'

import Text from './Txt'
import Colors from '../constants/Colors'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { PropTypes } from 'mobx-react/native'
import { TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native'

export default class SearchFilter extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            dayData: [],
        }

    }

    componentDidMount() {
        this.setState({
            dayData: this.getDays()
        })
    }

    getDays = () => {
        const numInvalidDaysOnEachSide = 3
        var date = new Date();
        var oneWeekFromToday = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        var dTwoDaysAgo = date.setDate(date.getDate() - numInvalidDaysOnEachSide);
        var d = new Date(dTwoDaysAgo);
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var next11 = new Array(7+numInvalidDaysOnEachSide*2)

        for( i = 0; i < next11.length; i++){
            next11[i] = {
                index: i,
                dayName: days[(d.getDay()+i)%7],
                dayNameAbbr: days[(d.getDay()+i)%7].slice(0,3),
                monthName: months[d.getMonth()],
                monthNameAbbr: months[d.getMonth()].slice(0,3),
                dateName: (d.getDate()+i),
                dayValue: (d.getDay()+i)%7,
                isEnabled: i < numInvalidDaysOnEachSide || i > numInvalidDaysOnEachSide + 6 ? false : true,

            }
        }
        return next11
    }

    renderDays = (day, index) => {
        const styleDay = day.isEnabled ? styles.enabledDay : styles.disabledDay;
        return(
            <View key={index} style={{display: 'flex', flexDirection: 'column', width: Dimensions.get('window').width / 6., alignItems: 'center'}}>
                <Text style={styleDay}>{day.dayNameAbbr}</Text>
                <Text style={[styleDay, {fontSize: 24}]}>{day.dateName}</Text>
                <Text style={styleDay}>{day.monthNameAbbr}</Text>
            </View>
            
        )
    }

    render(){
        let {visible, currentSearch} = this.props;
        
        return(
            <Fragment>            
                <View style={[styles.container, {display: visible ? "flex" : "none"}]}>
                    <View style={[styles.section,{backgroundColor: Colors.tango500, flex: 1}]}>
                        <Text style={styles.searchTitle} numberOfLines={1}>{currentSearch.length > 0 ? currentSearch : "No search yet"}</Text> 
                        <FlatList 
                            data={this.state.dayData}
                            renderItem={({item, index}) => this.renderDays(item, index)}
                            keyExtractor={item => item.index}
                            horizontal={true}
                            snapToAlignment={"center"}
                        />
                        <View style={styles.triangle} />
                    </View>
                    <View style={[styles.section, {flex: 1, backgroundColor: 'white'}]}>

                    </View>
                </View>
            </Fragment>
        
        )
    }

}
  
SearchFilter.defaultProps = {
    visible: false,
    currentSearch: '',
};


const styles = StyleSheet.create({
    container: {
        zIndex: 99,
        flex: 1,
        width: Dimensions.get("window").width,
    },
    section:{
        paddingHorizontal: 16,
    },
    searchTitle:{
        fontSize: 18,
    },
    enabledDay:{
     
    },
    disabledDay:{

        opacity: 0.2,
    },
    triangle: {
        position: 'absolute',
        bottom: 0,
        left: Dimensions.get('window').width/2 - 20,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white'
      }
})