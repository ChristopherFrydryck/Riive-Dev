import React from 'react'
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import Text from './Txt'
import Circle from './Circle'
import Icon from './Icon'

const ProfilePic = ({ alt, source, initals, fontSize, fontColor, imgWidth, imgHeight, onPress, ...props}) => {
  const style = [styles.container,  props.style || {}]
  const allProps = Object.assign({}, props,{style:style})  
  
  if (source){
    return(
      <View style={{postion: 'absolute'}}>
      <View style={{position: 'relative', alignContent: 'center', zIndex:1,}}>
      
        <TouchableOpacity
        {...allProps }
        underlayColor = '#ccc'
        onPress = {onPress}
      >
        {/* <Text style={{fontSize: fontSize, color: fontColor, fontWeight: '500'}}>FUK</Text> */}
        <Image style={{ width: imgWidth, 
                        height: imgHeight,  
                        borderRadius:  (imgHeight) / 2,
                      }} 
                        source={source}
                        resizeMode="cover"
                        accessible={true} 
                        accessibilityLabel={alt} 
                        loadingIndicatorSource={<ActivityIndicator />} 
          />
      </TouchableOpacity>
      </View>
      
      
   </View>
    )
  }else{
  return(
      <View style={{postion: 'absolute'}}>
      <View style={{position: 'relative', alignContent: 'center', zIndex:1}}>
      
        <TouchableOpacity
        {...allProps }
        underlayColor = '#ccc'
        onPress = {onPress}
      >
        <Text style={{fontSize: fontSize, color: fontColor, fontWeight: '700'}}> {initals} </Text>
      </TouchableOpacity>
      
      </View>
      
      
   </View>
    )
  }
}

const styles = StyleSheet.create ({
    container: {
        // alignSelf: 'center',
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
          justifyContent: 'center',
          alignItems: 'center',
          // borderWidth: 5,
          // borderColor: 'white',
          shadowColor: '#000', 
          shadowOpacity: 0.6, 
          shadowOffset:{width: 2, height: 2}, 
          shadowRadius: 3, 
          elevation: 12,
          backgroundColor: 'white'

    }
   
})

export default ProfilePic