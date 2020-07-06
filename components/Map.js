import React from 'react'
import {StyleSheet} from 'react-native';
import Text from '../components/Txt'
import { MapView } from 'expo'

const Map = (props) => {
    return(
        <View>
            <MapView
            style={{flex: 1}}
            region={props.region}
            showsUserLocation = {true}
            onRegionChange={(reg) => props.onRegionChange(reg)}
        >
            <MapView.Marker coordinate={props.region}/>
        </MapView>
        <Text>Hello.</Text>
        </View>
        
    )
}
export default Map;