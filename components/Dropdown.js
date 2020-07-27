import React from 'react'
import {View, Picker, StyleSheet, Platform, Dimensions} from 'react-native'
import Text from './Txt'
import ModalSelector from 'react-native-modal-selector'
import Icon from './Icon'
import Color from '../constants/Colors'
import SafeAreaView from 'react-native-safe-area-view'
import Colors from '../constants/Colors'

const Dropdown = ({ flex, error, enabled, label, selectedValue, onValueChange, data, ...props}) => {
    const style = enabled ? [styles.dd, props.style || {}] : [styles.dd_disabled, props.style || {}]
    const allProps = Object.assign({}, props,{style:style})

    const {height} = Dimensions.get('window');

    if(Platform.OS === 'android'){
        return(
            <View style={{flex: flex}}>
                <View style={styles.container}>
                    <Text style={enabled ? styles.label : styles.label_disabled}>{label}</Text>
                    <Picker {...allProps} enabled={enabled} selectedValue={selectedValue} onValueChange={onValueChange}>
                        {props.children}
                    </Picker>
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>
        )
    }else{
        return(
            
            <View style={{flex: flex}}>
                <SafeAreaView />
                <View style={styles.container}>
                    <Text style={enabled ? styles.label : styles.label_disabled}>{label}</Text>
                    <ModalSelector
                        disabled = {!enabled}
                        accessible={true}
                        supportedOrientations={['portrait']}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={onValueChange}
                        overlayStyle={{paddingTop: '15%'}}
                        data={props.children}
                    >
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={enabled ? styles.result : styles.result_disabled}>{selectedValue}</Text>
                        <Icon 
                            iconName="caretdown"
                            iconLib="AntDesign"
                            iconColor={Colors.cosmos300}
                            iconSize={10}
                            style={{alignSelf: "center", marginRight: 16}}
                        />
                    </View>   
                    </ModalSelector>
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 11,
        borderColor: '#adadad',
        borderBottomWidth: 2
    },
    label: {
        paddingTop: 5,
        paddingBottom: 0,
        paddingTop: 0,
        color: '#333',
        fontSize: 14,
        fontWeight: '400',
        width: 'auto'
    },
    label_disabled: {
        paddingTop: 5,
        paddingBottom: 0,
        paddingTop: 0,
        color: Color.mist900,
        fontSize: 14,
        fontWeight: '400',
        width: 'auto'
    },
    result: {
        // paddingTop: 5,
        paddingBottom: 0,
        paddingTop: 0,
        color: '#333',
        fontSize: 16,
        fontWeight: '400',
        width: 'auto'
    },
    result_disabled: {
        // paddingTop: 5,
        paddingBottom: 0,
        paddingTop: 0,
        color: Color.mist900,
        fontSize: 16,
        fontWeight: '400',
        width: 'auto'
    },
    dd:{
        color: Color.cosmos900,
        // height: 28
    },
    dd_disabled:{
        color: Color.mist900
    },
    error:{
        paddingTop: 3,
        paddingBottom: 0,
        color: 'red',
        fontSize: 12,
        fontWeight: '300',
        width: 'auto'
    }
})


Dropdown.defaultProps = {
    enabled: true
  };

  

export default Dropdown