import React, { Fragment } from 'react'
import {View, StyleSheet, Switch, Modal, SafeAreaView, Dimensions, Animated, Picker, Platform, FlatList, TouchableOpacity} from 'react-native'





import Text from './Txt'
import Colors from '../constants/Colors'
import Times from '../constants/TimesAvailable'



export default class SearchFilter extends React.Component{
    constructor(props){
        super(props);

        var startTimes = [];
        for (var i = 0 ; i < Times[0].start.length; i++){
           startTimes.push({key: i, label: Times[0].start[i], labelFormatted: this.convertToCommonTime(Times[0].start[i])})
        }

        var endTimes = []
         for (var i = 0 ; i < Times[1].end.length; i++){
            endTimes.push({key: i, label: Times[1].end[i], labelFormatted: this.convertToCommonTime(Times[1].end[i])})
         }

        this.state = {
            dayData: this.getDays(),
            startTimes: startTimes,
            endTimes: endTimes,

            xSlide: new Animated.Value(20),
            arriveActive: true,

            arriveValue: startTimes[24],
            departValue: endTimes[31]

        }
        this.timeWidth = 48;
        this.currentIndex = 0;
        this._updateIndex = this._updateIndex.bind(this);
        this._updateIndexTimes = this._updateIndexTimes.bind(this);
        this.viewabilityConfig = {
        itemVisiblePercentThreshold: 5
        };

       

    }

    componentDidMount(){
        this.goToIndexArrivals(this.state.arriveValue.key, true)

       
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

        for(let i = 0; i < next11.length; i++){
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
        
    renderArriveTimes = (item, index) => {
        let hourStyle, textStyle;
            if(index === this.state.arriveValue.key){
                textStyle = [styles.timeText, styles.timeTextActive];
                if(index === 0){
                    hourStyle = [styles.wholeHour, styles.activeHour, {width: this.timeWidth/2, borderLeftWidth: 0, borderRightWidth: 22}]
                }else if(index % 2 === 0){
                    hourStyle = [styles.wholeHour, styles.activeHour]
                }else if(index === this.state.startTimes.length - 1){
                    hourStyle = [styles.halfHour, styles.activeHour, {width: this.timeWidth/2, borderRightWidth: 0}]
                }else{
                    hourStyle = [styles.halfHour, styles.activeHour]
                }
            }else{
                textStyle = styles.timeText;
                if(index === 0){
                    hourStyle = [styles.wholeHour, {width: this.timeWidth/2, borderLeftWidth: 0, borderRightWidth: 22}]
                }else if(index % 2 === 0){
                    hourStyle = styles.wholeHour
                }else if(index === this.state.startTimes.length - 1){
                    hourStyle = [styles.halfHour, {width: this.timeWidth/2, borderRightWidth: 0}]
                }else{
                    hourStyle = styles.halfHour
                }
            }
        return(
            <View style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <View style={hourStyle}/>
                    {item.key % 2 === 0 ? 
                        <View style={{flexDirection: 'row', position: 'absolute', width: 48, zIndex: 999, bottom: 0,}}>
                            <Text style={textStyle}>{this.convertToCommonTime(item.label).split(":")[0]}</Text>
                            <Text style={textStyle.length > 1 ? styles.timeTextActive : null}>{item.labelFormatted.slice(-2)}</Text>
                        </View>
                    : null}
            </View>
        )
     }

     renderDepartTimes = (item, index) => {
            let hourStyle, textStyle;
            if(index === this.state.departValue.key){
                textStyle = [styles.timeTextDepart, styles.timeTextActive];
                if(index === 0){
                    hourStyle = [styles.wholeHour, styles.activeHour, {width: this.timeWidth/2, borderLeftWidth: 0, borderRightWidth: 22}]
                }else if(index % 2 === 0){
                    hourStyle = [styles.wholeHour, styles.activeHour]
                }else if(index === this.state.endTimes.length - 1){
                    hourStyle = [styles.halfHour, styles.activeHour, {width: this.timeWidth/2, borderRightWidth: 0}]
                }else{
                    hourStyle = [styles.halfHour, styles.activeHour]
                }
            }else{
                textStyle = styles.timeTextDepart;
                if(index === 0){
                    hourStyle = [styles.wholeHour, {width: this.timeWidth/2, borderLeftWidth: 0, borderRightWidth: 22}]
                }else if(index % 2 === 0){
                    hourStyle = styles.wholeHour
                }else if(index === this.state.endTimes.length - 1){
                    hourStyle = [styles.halfHour, {width: this.timeWidth/2, borderRightWidth: 0}]
                }else{
                    hourStyle = styles.halfHour
                }
            }
        return(
            <View style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <View style={hourStyle}/>
                    {item.key % 2 === 0 ? 
                        <View style={{flexDirection: 'row', position: 'absolute', width: 60, zIndex: 999, bottom: 0,}}>
                            <Text style={textStyle}>{this.convertToCommonTime(item.label).split(" ")[0]}</Text>
                            <Text style={textStyle.length > 1 ? styles.timeTextActive : null}>{item.labelFormatted.slice(-2)}</Text>
                        </View>
                    : null}
            </View>
        )
     }

     renderInvalidDepartTimes = (item, index) => {
        let hourStyle, textStyle;
       
       
            textStyle = styles.timeTextDepart;
            if(index === 0){
                hourStyle = [styles.wholeHour, {width: this.timeWidth/2, borderLeftWidth: 0, borderRightWidth: 22}]
            }else if(index % 2 === 0){
                hourStyle = styles.wholeHour
            }else if(index === this.state.endTimes.length - 1){
                hourStyle = [styles.halfHour, {width: this.timeWidth/2, borderRightWidth: 0}]
            }else{
                hourStyle = styles.halfHour
            }
        return(
            <View style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <View style={hourStyle}/>
                    {item.key % 2 === 0 ? 
                        <View style={{flexDirection: 'row', position: 'absolute', width: 60, zIndex: 999, bottom: 0,}}>
                            <Text style={textStyle}>{this.convertToCommonTime(item.label).split(" ")[0]}</Text>
                            <Text style={textStyle.length > 1 ? styles.timeTextActive : null}>{item.labelFormatted.slice(-2)}</Text>
                        </View>
                    : null}
            </View>
        )
     }
                                
                                
    slideAnimate = async() => {
            // console.log(`Arr Value before: ${this.state.arriveValue.labelFormatted}`)
        const {width} = Dimensions.get('window')
        if(this.state.arriveActive){
            await Animated.spring(this.state.xSlide, {
                toValue: width/2 + 20
            }).start()
            await this.setState(prevState => ({arriveActive: false, arriveValue: prevState.arriveValue}))
            await this.goToIndexDepartures(this.state.departValue.key, false)
        }else{
            await Animated.spring(this.state.xSlide, {
                toValue: 20
            }).start()
            await this.setState(prevState => ({arriveActive: true, arriveValue: prevState.arriveValue}))
            await this.goToIndexArrivals(this.state.arriveValue.key, false)
        }
        // console.log(`Arr Value after: ${this.state.arriveValue.labelFormatted}`)
    }

    goToIndexArrivals = (i, animated) => {
         const wait = new Promise((resolve) => setTimeout(resolve, 0));
        wait.then( () => {
            this.arrivalFlatlist.scrollToIndex({animated: animated, index: i, viewOffset: Dimensions.get("window").width/2}); // Throws no errors, has no effect?
        });
    }

    goToIndexDepartures = (i, animated) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 0));
       wait.then( () => {
           this.departureFlatlist.scrollToIndex({animated: animated, index: i, viewOffset: Dimensions.get("window").width/2}); // Throws no errors, has no effect?
       });
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

    _updateIndexTimes = async( event ) => {
        let e = event.nativeEvent.contentOffset.x;
        if(this.state.arriveActive){
            if(e < 24){
                await this.setState({arriveValue: this.state.startTimes[0]})
            }else{
                let i = (Math.round(e/48))
                if(i < this.state.startTimes.length){
                   await  this.setState({arriveValue: this.state.startTimes[i]})
                }
            }

            if(this.state.arriveValue.key > this.state.departValue.key){
                this.setState({departValue: this.state.endTimes[this.state.arriveValue.key]})
            }
        }else{
            if(e < 24){
                this.setState({departValue: this.state.endTimes[0]})
            }else{
                let i = (Math.round(e/48))
                if(i < this.state.endTimes.length){
                    this.setState({departValue: this.state.endTimes[i]})
                }
            }

            if(this.state.departValue.key <= this.state.arriveValue.key){
                this.setState({arriveValue: this.state.startTimes[this.state.departValue.key]})
            }
        }
    }

    convertToCommonTime = (t) => {
        let hoursString = t.substring(0,2)
        let minutesString = t.substring(2)


        
        let hours = parseInt(hoursString) == 0 ? "12" : parseInt(hoursString) > 12 ? (parseInt(hoursString) - 12).toString() : parseInt(hoursString);
        // let minutes = parseInt(minutesString)
        return(`${hours}:${minutesString} ${parseInt(hoursString) >= 12 ? 'PM' : 'AM'}`)
    }

    render(){
        let {visible, currentSearch} = this.props;
        let {width, height} = Dimensions.get('window');
        let {startTimes, endTimes} = this.state
        
        
        
        // console.log(endTimes.length)

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

                    {/* Arrive / Depart Tab */}
                    <View style={[styles.section, {flex: 0, backgroundColor: 'white'}]}>
                        <View style={{ flexDirection: 'row', height: 32, paddingTop: 4}}>
                                <TouchableOpacity onPress={() => this.slideAnimate()} style={{flex: 1}}>
                            <Text style={{fontSize: 16, textAlign: 'center', color: this.state.arriveActive ? 'black' : Colors.cosmos300}}>Arrive @ {this.state.arriveValue.labelFormatted}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.slideAnimate()} style={{flex: 1}}>
                                    <Text style={{fontSize: 16, textAlign: 'center', color: this.state.arriveActive ? Colors.cosmos300 : 'black'}}>Depart @ {this.state.departValue.labelFormatted}</Text>
                                </TouchableOpacity>
                                <Animated.View style={{borderBottomWidth: 3, borderBottomColor: Colors.apollo500, position: 'absolute', width: width/2.5, height: 35, transform:[{translateX: this.state.xSlide}]
                            }} />
                        </View>
                            {/* <View style={{
                            left: width/2 - 2,
                            width: 2, 
                            height: 200,
                            position: 'absolute',
                            zIndex: 999,
                            backgroundColor: 'green',
                            borderColor: 'transparent'}}></View> */}
                            {this.state.arriveActive ? 
                            <FlatList 
                                ref={(ref) => { this.arrivalFlatlist = ref; }}
                                data={this.state.startTimes}
                                keyExtractor={(item) => item.key.toString()}
                                onScroll={(event) => { 
                                    this._updateIndexTimes(event)
                                }}
                                getItemLayout={(data, index) => {
                                    return {
                                        length: index === 0 ? this.timeWidth/2 : this.timeWidth,
                                        offset: index === 0 ? 0 : (this.timeWidth * index) + (width/2) + (index*0.5),
                                        index
                                    }
                                }}
                                horizontal
                                bounces={false}
                                initialNumToRender={48}
                                contentContainerStyle={{marginTop: 24, height: 80}}
                                ListHeaderComponentStyle={{paddingLeft: width/2}}
                                ListHeaderComponent={() => {
                                    return(<View />)
                                }}
                                ListFooterComponentStyle={{paddingLeft: width/2}}
                                ListFooterComponent={() => {
                                    return(<View />)
                                }}
                                pagingEnabled={true}
                                decelerationRate={0}
                                showsHorizontalScrollIndicator={false}
                                snapToOffsets = {[...Array(this.state.startTimes.length)].map((x, i) => i * (this.timeWidth + .5))}
                                renderItem={({item, index}) => {
                              
                                        return this.renderArriveTimes(item, index, this.state.arriveActive)
                                    
                                }}
                                
                            />
                            :
                            <FlatList 
                                ref={(ref) => { this.departureFlatlist = ref; }}
                                data={this.state.endTimes}
                                keyExtractor={(item) => item.key.toString()}
                                onScroll={(event) => { 
                                    this._updateIndexTimes(event)
                                }}
                                getItemLayout={(data, index) => {
                                    return {
                                        length: index === 0 ? this.timeWidth/2 : this.timeWidth,
                                        offset: index === 0 ? 0 : (this.timeWidth * index) + (width/2) + (index*0.5),
                                        index
                                    }
                                }}
                                horizontal
                                bounces={false}
                                initialNumToRender={48}
                                contentContainerStyle={{marginTop: 24, height: 80}}
                                ListHeaderComponentStyle={{paddingLeft: width/2}}
                                ListHeaderComponent={({item, index}) => {
                                    // let res = this.state.endTimes.filter((x, i)=> x.key < this.state.arriveValue.key).map(x => {
                                    //     return <Text>{x.labelFormatted}</Text>
                                    // })
                                    // return (
                                    //     <View style={{flexDirection: 'row', width: width / 2}}>{res}</View>
                                    // )
                                   return <View />
                                }}
                                ListFooterComponentStyle={{paddingLeft: width/2}}
                                ListFooterComponent={() => {
                                    return(<View />)
                                }}
                                pagingEnabled={true}
                                decelerationRate={0}
                                showsHorizontalScrollIndicator={false}
                                snapToOffsets = {[...Array(this.state.startTimes.length)].map((x, i) => i * (this.timeWidth + .5))}
                                renderItem={({item, index}) => {
                              
                                        return this.renderDepartTimes(item, index, this.state.arriveActive)
                                    
                                }}
                                
                            />
                            }
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
      },
    wholeHour:{
        paddingLeft: 1, 
        overflow: 'visible',
        width: 48, 
        height: 40,
        backgroundColor: Colors.mist900, 
        borderLeftWidth: 22, 
        borderRightWidth: 22, 
        borderColor: 'white',
        overflow: 'visible',
        zIndex: 999,
    },
    halfHour:{
        paddingLeft: 1,
        width: 48, 
        height: 32,
        backgroundColor: Colors.mist900, 
        borderLeftWidth: 24, 
        borderRightWidth: 24, 
        borderColor: 'white',
        zIndex: 99,
    },
    activeHour:{
        backgroundColor: Colors.tango500,
        ...Platform.select({
            ios: {
                height: 52,
                marginTop: -16,
            }        
        }),
    },
    timeText:{
        fontSize: 22,
        // position: 'absolute',
        fontWeight: 'bold',
        elevation: 999,
        bottom: 0,
    },
    timeTextDepart:{
    ...Platform.select({
        ios: {
            fontSize: 20,
        },
        android:{
            fontSize: 15,
        },
        }),
        // position: 'absolute',
        fontWeight: 'bold',
        elevation: 999,
        bottom: 0,
    },
    timeTextActive:{
        color: Colors.tango900,
    }
})