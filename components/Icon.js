import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'

import { Feather, Entypo, EvilIcons, Foundation, Ionicons, AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';


const Icon = ({iconLib, iconColor, iconName, iconSize, onPress, alignSelf, justifySelf, ...props }) => {
    const style = [styles.icon,  props.style || {}]
    const allProps = Object.assign({}, props,{style:style})  

    if(iconLib == "Ionicons"){
        return(
            <Ionicons {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "AntDesign"){
        return(
            <AntDesign {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "FontAwesome"){
        return(
            <FontAwesome {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "FontAwesome5"){
        return(
            <FontAwesome5 {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "MaterialCommunityIcons"){
        return(
            <MaterialCommunityIcons {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "MaterialIcons"){
        return(
            <MaterialIcons {...allProps}  name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "Entypo"){
        return(
            <Entypo {...allProps}   name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "EvilIcons"){
        return(
            <EvilIcons {...allProps}  name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else if(iconLib == "Foundation"){
        return(
            <Foundation {...allProps} name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }else{
        return(
            <Feather {...allProps} name={iconName} size={iconSize} color={iconColor} onPress={onPress} alignSelf={alignSelf} justifySelf={justifySelf} />
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        display: 'flex',
    }
})

export default Icon;