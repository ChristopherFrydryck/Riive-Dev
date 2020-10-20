import React, { Fragment } from 'react'
import {View, StyleSheet, Switch, Modal, SafeAreaView, Dimensions, Animated, Picker, Platform, FlatList, TouchableOpacity} from 'react-native'

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import Text from './Txt'
import Colors from '../constants/Colors'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { PropTypes } from 'mobx-react/native'



export default class SearchFilter extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            dayData: this.getDays(),

            xSlide: new Animated.Value(20),
            arriveActive: true,

        }

        this.currentIndex = 0;
        this._updateIndex = this._updateIndex.bind(this);
        this.viewabilityConfig = {
        itemVisiblePercentThreshold: 5
        };

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
            <View key={index} style={{display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', width: Dimensions.get('window').width * .16}}>
                <Text style={styleDay}>{day.dayNameAbbr}</Text>
                <Text style={[styleDay, {fontSize: 24}]}>{day.dateName}</Text>
                <Text style={styleDay}>{day.monthNameAbbr}</Text>
            </View>
            
        )
    }

    slide = () => {
        const {width} = Dimensions.get('window')
        if(this.state.arriveActive){
            Animated.spring(this.state.xSlide, {
                toValue: width/2 + 20
            }).start()
            this.setState({arriveActive: false})
        }else{
            Animated.spring(this.state.xSlide, {
                toValue: 20
            }).start()
            this.setState({arriveActive: true})
        }
    }

    getInvalidDays = (days) => {
        const dayData = this.state.dayData;
        const response = null;
        if(days === 'before'){
            
        }else{
            dayData.filter((x, i)=> !x.isEnabled && i > 6)
            for(let i = 0; i < dayData.length; i++){
                response += this.renderDays(dayData[i], dayData[i].index)
            }
        }
        return response;
    }

    _updateIndex({ viewableItems }) {
        // getting the first element visible index
        if(viewableItems.length > 0){
            this.currentIndex = viewableItems[0].index;
            console.log(viewableItems[0].item.dayName)
        }
          
    }

    _scrollToIndex(index){
        console.log("HELLO")
        this._flatList.scrollToIndex({
            animated: true,
            index: index,
            viewOffset: Dimensions.get('window').width / 2 -40
        })
    }

    render(){
        let {visible, currentSearch} = this.props;
        let {width, height} = Dimensions.get('window');
        return(
            <Fragment>            
                <View style={[styles.container, {display: visible ? "flex" : "none"}]}>
                    <View style={[styles.section,{backgroundColor: Colors.tango500, flex: 0, paddingBottom: 24}]}>
                        <View style={styles.padding}>
                            <Text style={styles.searchTitle} numberOfLines={1}>{currentSearch.length > 0 ? "Parking near " + currentSearch : "No search yet"}</Text> 
                        </View>
                        <FlatList 
                            ref={(ref) => { this._flatList = ref; }}
                            data={this.state.dayData.filter(x => x.isEnabled)}
                            renderItem={({item, index}) => {
                                
                                    return this.renderDays(item, index)
                                
                            }}
                            keyExtractor={item => item.index.toString()}
                            horizontal={true}
                            
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment={"start"}
                          
                     
                            // contentInset={{right: 10}}

                            contentContainerStyle={ Platform.OS == 'android' ? {marginLeft: -20} : {marginLeft: -20, }}

                            snapToOffsets ={[...Array(this.state.dayData.filter(x => x.isEnabled).length)].map((x, i) => i * (width*.16)) }

                            ListHeaderComponent={() => {
                                let res = this.state.dayData.filter((x, i)=> !x.isEnabled && i < 4).map(x => {
                                    return this.renderDays(x, x.index)
                                })
                                return (
                                    <View style={{flexDirection: 'row'}}>{res}</View>
                                )
                            }
                                
                            }

                            ListFooterComponent={() => {
                                let res = this.state.dayData.filter((x, i)=> !x.isEnabled && i > 6).map(x => {
                                    return this.renderDays(x, x.index)
                                })
                                return (
                                    <View style={{flexDirection: 'row', width: width / 2}}>{res}</View>
                                )
                            }
                                
                            }

                            ListFooterComponentStyle={{
                                width: width / 2 - 55,
                                flexGrow: 1,
                                overflow: 'visible'
                            }}
                            

                            // onEndReached={() => this._scrollToIndex(4)}
                            // onEndThreshold={3}
                            bounces={false}
                            getItemLayout={(data, index) => (
                                {length: width * .16, offset: (width*.16)*index - 40, index}
                            )}
                            initialScrollIndex={this.currentIndex}
                            // onScrollToIndexFailed = {(e) => {console.log(e)}}
                            decelerationRate={0}
                            onViewableItemsChanged={this._updateIndex}
                            viewabilityConfig={this.viewabilityConfig}
                          
                        />
                        <View style={styles.triangle} />
                    </View>
                    <View style={[styles.section, {flex: 1, backgroundColor: 'white'}]}>
                        <View style={{ flexDirection: 'row', height: 32}}>
                                <TouchableOpacity onPress={() => this.slide()} style={{flex: 1}}>
                                    <Text style={{fontSize: 20, textAlign: 'center', color: this.state.arriveActive ? 'black' : Colors.cosmos300}}>Arrive</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.slide()} style={{flex: 1}}>
                                    <Text style={{fontSize: 20, textAlign: 'center', color: this.state.arriveActive ? Colors.cosmos300 : 'black'}}>Depart</Text>
                                </TouchableOpacity>
                                <Animated.View style={{borderBottomWidth: 3, borderBottomColor: Colors.apollo500, position: 'absolute', width: width/2.5, height: 35, transform:[{translateX: this.state.xSlide}]
                            }} />
                        </View>
                            {/* <View style={{
                            paddingLeft: 2, 
                            width: 2, 
                            flex: 1, 
                            backgroundColor: 'green', borderLeftWidth: 7, borderRightWidth: 7, borderColor: 'white'}}></View> */}
                            
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
        flex: 1.5,
        width: Dimensions.get("window").width,
    },
    section:{
        // paddingHorizontal: 16,
    },
    padding:{
        paddingHorizontal: 16,
    },
    searchTitle:{
        fontSize: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    enabledDay:{
     
    },
    disabledDay:{

        opacity: 0.2,
    },
    triangle: {
        position: 'absolute',
        bottom: 0,
        left: Dimensions.get('window').width/2 - 15,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white'
      }
})