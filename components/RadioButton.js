import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import Text from '../components/Txt';
import Colors from '../constants/Colors'

import { RadioButton } from 'react-native-paper';




const radioButton = ({title, subTitle, selectItem, ...props}) => {
    const style = [styles.main, props.style || {}]
    const allProps = Object.assign({}, props,{style:style})
    

    return(
         <View {...allProps}>
            <RadioButton.Android value={title}/>
            <TouchableWithoutFeedback onPress={selectItem}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16}}>{title}</Text>
                    {subTitle ? <Text style={{fontSize: 12}} >{subTitle}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}


const styles = StyleSheet.create({
    main: {
        flexDirection: "row",
        alignItems: 'center',
    }
})

export default radioButton