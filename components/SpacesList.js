import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Text from './Txt'
import Colors from '../constants/Colors'
import Icon from '../components/Icon'
import Image from '../components/Image'
import * as Font from 'expo-font'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation';

import { inject, observer } from 'mobx-react/native';

//For Shimmer
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, {Circle, Rect} from 'react-native-svg'


function cacheFonts(fonts){
    return fonts.map(font => Font.loadAsync(font))
}




@inject("UserStore", "ComponentStore")
@observer
class SpacesList extends React.Component{

    async componentDidMount(){
        const iconAssets = cacheFonts([FontAwesome.font, MaterialCommunityIcons.font])
        await Promise.all([...iconAssets])
        this.props.ComponentStore.spotsLoaded = true;
    }

    selectSpace = (spot) => {
        this.props.ComponentStore.selectedSpot = [];
        this.props.ComponentStore.selectedSpot.push({
            listingID: spot.postID,
            address: spot.address,
            region: spot.region,
            photo: spot.photo,
            spaceName: spot.spaceName,
            spaceBio: spot.spaceBio,
            spacePrice: spot.spacePrice,
            spacePriceCents: spot.spaceCents,
            numSpaces: spot.numSpaces,
            availability: spot.daily,
        })
        
        this.props.navigation.navigate("AddSpace")
    }

    render(){
        let {spotsLoaded} =  this.props.ComponentStore;
        let loaders = [];
        if(spotsLoaded){
        return(
        <View style={styles.container}>
                {
                    this.props.UserStore.listings.map((spot, i) => (
      
                        <TouchableOpacity
                            key={this.props.UserStore.listings[i].listingID}
                            style={i == 0 ? styles.li_first : styles.li}
                            onPress = {() => this.selectSpace(spot)}
                            >
                            <Image 
                                style={{width: Dimensions.get("window").width - 32, borderTopLeftRadius: 4, borderTopRightRadius: 4}}
                                aspectRatio={21/9}
                                source={{uri: spot.photo}}
                                backupSource={require('../assets/img/Logo_001.png')}
                                resizeMode={'cover'}
                            /> 
                            <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', padding: 8}}>
                                <Icon
                                    iconName="navigation"
                                    iconColor={Colors.apollo500}
                                    iconSize={28}
                                    style={{marginRight: 8}}
                                    
                                />
                                <View style={{flexDirection: "column"}}>
                                {spot.spaceName.length <= 28 ?
                                <Text style={{fontSize: 16}}>{spot.spaceName}</Text>
                                : <Text style={{fontSize: 16}}>{spot.spaceName.substring(0, 28) + "..."}</Text>}
                                <Text style={{flexWrap: 'wrap'}}>{spot.spacePrice}</Text>
                                </View>
                                <View style={{position:"absolute", right:0}}>
                                    <Icon 
                                        iconName="chevron-right"
                                        iconColor={Colors.mist900}
                                        iconSize={28}
                                    />
                                </View>
    
                            </View>
                           
                           
                        </TouchableOpacity>
                        
                    ))
                }
            </View>
            
        )}else{
            for(let i = 0; i < this.props.UserStore.listings.length; i++){
                loaders.push(
                    <SvgAnimatedLinearGradient key={i} width={Dimensions.get('window').width} height="50">
                        <Rect width={Dimensions.get('window').width} height="40" rx="5" ry="5" />
                    </SvgAnimatedLinearGradient>
                )
            }
            return(
                <View style={styles.container}>{loaders}</View>
            )
        }
    
    }
}



const styles = StyleSheet.create({
    container:{
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: 'white',
        shadowColor: '#000', 
          shadowOpacity: 0.6, 
          shadowOffset:{width: 2, height: 2}, 
          shadowRadius: 3, 
          elevation: 12,
          borderRadius: 4,
    },
    li: {
        // borderBottomColor: Colors.mist700,
        // borderBottomWidth: 1,
        // padding: 15,
        marginVertical: 8
       
    },
    li_first: {
        // borderTopWidth: 1,
        // borderTopColor: Colors.mist700,
        // borderBottomColor: Colors.mist700,
        // borderBottomWidth: 1,
        // padding: 10,
        marginTop: 8
    }
})

export default withNavigation(SpacesList);