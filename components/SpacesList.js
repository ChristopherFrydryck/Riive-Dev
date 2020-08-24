import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
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

    constructor(props){
        super(props);
        this.state = {
            data: this.props.UserStore.listings,
        }
    }

    async componentDidMount(){
        const iconAssets = cacheFonts([FontAwesome.font, MaterialCommunityIcons.font])
        await Promise.all([...iconAssets])
        this.setState({data: this.props.UserStore.listings})
        this.props.ComponentStore.spotsLoaded = true;
    }

    selectSpace = (spot) => {
            // console.log(spot.listingID)
            this.props.ComponentStore.selectedSpot = []
            this.props.ComponentStore.selectedSpot.push({
                listingID: spot.listingID,
                address: spot.address,
                region: spot.region,
                photo: spot.photo,
                spaceName: spot.spaceName,
                spaceBio: spot.spaceBio,
                spacePrice: spot.spacePrice,
                spacePriceCents: spot.spacePriceCents,
                numSpaces: spot.numSpaces,
                availability: spot.availability,
            })
            // console.log(this.props.ComponentStore.selectedSpot[0].spaceName)
            this.props.navigation.navigate("EditSpace")
         

       
        
        
    }

    renderSpaceCard = (spot, index) => {
       
        return(
        <TouchableOpacity
        key={spot.listingID}
        style={index == 0 ? styles.li_first : styles.li}
        onPress = {() => this.selectSpace(spot)}
        >
        <View style={styles.image}>
            <Image 
                aspectRatio={21/9}
                source={{uri: spot.photo}}
                backupSource={require('../assets/img/Logo_001.png')}
                resizeMode={'cover'}
            /> 
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', padding: 8}}>
            {/* <Icon
                iconName="navigation"
                iconColor={Colors.apollo500}
                iconSize={28}
                style={{marginRight: 8}}
                
            /> */}
            <View style={{flexDirection: "column"}}>
            {spot.spaceName.length <= 28 ?
            <Text style={{fontSize: 16}}>{spot.spaceName}</Text>
            : <Text style={{fontSize: 16}}>{spot.spaceName.substring(0, 28) + "..."}</Text>}
            {spot.address.full.length <= 28 ?
            <Text style={{fontSize: 16}}>{spot.address.full}</Text>
            : <Text style={{fontSize: 16}}>{spot.address.full.substring(0, 28) + "..."}</Text>}
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
        )
    }

    render(){
        let {spotsLoaded} =  this.props.ComponentStore;
        let loaders = [];
        if(spotsLoaded && this.state.data.length == 1){
        return(
        <View style={styles.container}>
                        
            {this.renderSpaceCard(this.state.data[0])} 
               
            </View>
            
        )}else if(spotsLoaded && this.state.data.length > 1){
            // console.log(this.state.data[0].availability[new Date().getDay()].data)
           
            return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.data.slice().sort((a, b) => b.created - a.created)}
                    renderItem={({item, index}) => this.renderSpaceCard(item, index)}
                    keyExtractor={item => item.listingID}
                    horizontal={true}
                    snapToAlignment={"start"}
                    snapToInterval={Dimensions.get("window").width * 0.80 + 16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                />
            </View>
            )
        }else{
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
        marginTop: 8,
     
    },
    image: {
        overflow: 'hidden',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
       
    },
    li: {
        width: Dimensions.get("window").width * .8,
        marginHorizontal: 8,
        backgroundColor: 'white',
        shadowColor: '#000', 
          shadowOpacity: 0.6, 
          shadowOffset:{width: 2, height: 2}, 
          shadowRadius: 3, 
          elevation: 12,
          borderRadius: 4,
          marginVertical: 8
        
       
    },
    li_first: {
        width: Dimensions.get("window").width * .8,
        marginRight: 8,
        marginLeft: 4,
        backgroundColor: 'white',
        shadowColor: '#000', 
          shadowOpacity: 0.6, 
          shadowOffset:{width: 2, height: 2}, 
          shadowRadius: 3, 
          elevation: 12,
          borderRadius: 4,
          marginVertical: 8
         
        
    }
})

export default withNavigation(SpacesList);