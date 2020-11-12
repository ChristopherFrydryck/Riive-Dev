import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';


const ListingMarker = ({ onPress, listing, ...props}) => {
    const style = [[styles.chip], props.style || {}]
    const allProps = Object.assign({}, props,{style:style})
    return(
        <Marker 
            key={listing.listingID}
            anchor={{x: 0.5, y: 0.5}} // For Android          
            coordinate={{
                latitude: listing.region.latitude,
                longitude: listing.region.longitude,
            }} 
            title={listing.spaceName}
        >
            
        </Marker>
    )
}

const styles = StyleSheet.create({
    chip:{
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 50,
        alignContent: 'center',
      
    }
})

export default ListingMarker