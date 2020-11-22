import React, {Component} from 'react'
import {SafeAreaView, View, ScrollView, StyleSheet, Dimensions, StatusBar} from 'react-native'
import Button from '../components/Button'
import Text from '../components/Txt'
import Image from '../components/Image'
import ProfilePic from '../components/ProfilePic';
import ExternalSpacesList from '../components/ExternalSpacesList'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'

import {Menu, Divider, Provider, Snackbar} from 'react-native-paper'

//MobX Imports
import {inject, observer} from 'mobx-react/native'

@inject("UserStore", "ComponentStore")
@observer
export default class ExternalProfile extends Component{

    static navigationOptions = {
        header: null
    };
    

    constructor(props){
        super(props);

        this.state = {
            host: this.props.ComponentStore.selectedUser[0],
            space: this.props.ComponentStore.selectedExternalSpot[0]
        }

    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.tango900);
          });
    }


    componentWillUnmount() {
        this.props.ComponentStore.selectedUser.clear();
    }

    render(){
        let { host, space } = this.state;
        // console.log(host)
        if(this.state.host){
            return(
                <Provider>
                <SafeAreaView style={{ flexDirection: "column", backgroundColor: Colors.tango900}} />
                    <View style={{flex: 1}}>
                    <LinearGradient
                        colors={['#FF8708', '#FFB33D']}
                        style={styles.headerBox}
                    >
                    <TopBar style={{zIndex: 9999}}>
                            <Icon 
                                iconName="arrow-left"
                                iconColor="#FFFFFF"
                                iconSize={28}
                                onPress={() => this.props.navigation.goBack(null)}
                            />
                            <View style={{marginLeft: 'auto'}}>
                                <Menu
                                    visible={this.state.menuVisible}
                                    onDismiss={() => this.setState({menuVisible: false})}
                                    style={{marginLeft: 'auto'}}
                                    anchor={
                                        <Icon 
                                            iconName="more-vertical"
                                            iconColor="#FFFFFF"
                                            iconSize={24}
                                            onPress={() => this.setState({menuVisible: true})}
                                            style={{paddingLeft: 30, marginLeft: "auto"}}
                                        /> 
                                    }
                                >
                                    {/* <Menu.Item onPress={() => {this.onShare()}} title="Share Profile" /> */}
                                    <Menu.Item onPress={() => {}} title="Report User" />
                                </Menu>
                            </View>
                            
                            {/* <Icon 
                                iconName="more-vertical"
                                iconColor="#FFFFFF"
                                iconSize={24}
                                onPress={() => alert("pressed 2!")}
                                style={{marginLeft: "auto"}}
                            /> */}
                        </TopBar>
                        </LinearGradient>
                        <View style={{flex: 0, paddingHorizontal: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                            <ProfilePic 
                                source={{uri: host.photo}}
                                style={{marginTop: -32}}
                                imgWidth={80}
                                imgHeight={80}
                                initals={host.firstname.charAt(0).toUpperCase() + "" + host.lastname.charAt(0).toUpperCase()}
                                fontSize={24}
                                fontColor="#1D2951"
                                alt="Your profile picture"
                            />
                                <View style={{flex: 1, marginLeft: 16, marginTop: -32,}}>
                                    <Text style = {{fontSize: 20, color: 'white'}} type="semiBold">{host.firstname} {host.lastname.charAt(0).toUpperCase()}.</Text>
                                    <Text style={{fontSize: 14, marginTop: 8}} numberOfLines={2} elipsizeMode="tail" >Hosting {space.spaceName} {host.listings.length > 2 ?`and ${host.listings.length - 1} others.` : host.listings.length !== 0 ? `and ${host.listings.length - 1} other.`: "."}</Text>
                                </View>
                            </View>
                            

                        {/* <Button onPress={() => this.props.navigation.goBack()}>Go Back</Button> */}
                        {/* <Button onPress={() => this.props.navigation.navigate('Profile')}>Go to Profile</Button> */}
                        </View>
                        <View style={[styles.container, {marginTop: 8}]}>
                            {host.listings.length == 0 || host.listings.length <= 1 ? <Text style={styles.categoryTitle}>Hosted Space</Text> : <Text style={{fontSize: 20, marginRight: 'auto'}}>Hosted Spaces</Text>}
                        </View>
                        <ExternalSpacesList listings={host.listings}/>
                    </View>
  
                </Provider>
            )
        }else{
            return(
                <Text>Loading...</Text>
            )
        }
    }
}
const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 16
    },
    categoryTitle: {
        fontSize: 20, 
        marginRight: 'auto'
    },
    headerBox: {
        // position: 'absolute',
        height: Dimensions.get("window").height /9,
        paddingBottom: 20,
        width: Dimensions.get('window').width,
        // borderWidth: 1,
        // borderBottomRightRadius: 20,
        // borderBottomLeftRadius: 20,
        position: "relative",
        
    },
})