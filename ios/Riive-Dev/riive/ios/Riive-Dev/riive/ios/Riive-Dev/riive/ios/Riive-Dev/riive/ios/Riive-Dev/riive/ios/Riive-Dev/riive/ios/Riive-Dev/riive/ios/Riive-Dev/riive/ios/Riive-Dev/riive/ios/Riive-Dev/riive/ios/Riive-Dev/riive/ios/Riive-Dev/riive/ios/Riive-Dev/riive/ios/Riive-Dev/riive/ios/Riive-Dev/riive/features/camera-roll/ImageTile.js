import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from '../../components/Icon'
const { width } = Dimensions.get('window')

class ImageTile extends React.PureComponent {
  render() {
    let { item, index, selected, selectImage, numSelected } = this.props;
    if (!item) return null;
    return (
      <View>
        <View style={{opacity: selected ? 1 : 0, position: 'absolute', top: 8, right: 8, backgroundColor: Colors.fortune900, borderRadius: 24, width: 24, height: 24, zIndex: 20, display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        {/* <Text style={{color: "white"}}>{selected ? numSelected : "?"}</Text> */}
        <Icon 
          iconName="check"
          iconColor={Colors.cosmos500}
          iconSize={16}
          style={{color: 'white'}}
        />
        </View>
        <TouchableHighlight
          style={{opacity: selected ? 0.5 : 1}}
          underlayColor='transparent'
          onPress={() => selectImage(index)}
        >
          
          <Image
            style={{width: width/4, height: width/4}}
            source={{uri: item}}
          />
        </TouchableHighlight>
      </View>
    )
  }
}
export default ImageTile;