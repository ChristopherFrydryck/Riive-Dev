import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'

class MapInput extends React.Component{
    
    render(){
        return(
            <GooglePlacesAutocomplete 
                placeholder="Search"
                minLength={2}
                autoFocus={true}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    // this.props.notifyChange(details.geometry.location)
                    alert("clicked")
                    }
                }
                query={{
                    key: 'AIzaSyBa1s5i_DzraNU6Gw_iO-wwvG2jJGdnq8c',
                    language: 'en'
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
            />
        )
    }
}
export default MapInput;