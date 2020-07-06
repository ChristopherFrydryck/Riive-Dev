import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Text from './Txt'
import Color from '../constants/Colors'
import {TextInputMask} from 'react-native-masked-text'
import { isNullOrUndefined } from 'util';

const input = ({label, masked, flex, error, value, onChangeText, placeholder, secureTextEntry, id, keyboardType, maxLength, autoCapitalize, editable, ccType, numLines, rightText, ...props}) => {
 
   
    if(!props.mask){
    return (
        <View style={{flex: flex}}>
            <View style={styles.container}>
                 <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                     <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                     <Text style={styles.label_disabled}>{rightText}</Text>
                </View>
                
                <TextInput
                    autoCorrect={false}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    style={editable ? styles.input : styles.input_disabled}
                    secureTextEntry={secureTextEntry}
                    value={value}
                    id={id}
                    keyboardType = {keyboardType}
                    maxLength = {maxLength}
                    error = {error}
                    editable = {editable}
                    rightText = {rightText}
                />
            </View>
            <Text style={styles.error}>{error}</Text>
        </View>    
    )}else if(props.mask == 'multiline'){
        return(
        <View style={{flex: flex}}>
            <View style={styles.container}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                    <Text style={styles.label_disabled}>{rightText}</Text>
                </View>
                
                <TextInput
                    autoCorrect={false}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    style={editable ? styles.input : styles.input_disabled}
                    secureTextEntry={secureTextEntry}
                    value={value}
                    id={id}
                    textAlignVertical= "top"
                    multiline = {true}
                    keyboardType = {keyboardType}
                    numberOfLines = {numLines}
                    maxLength = {maxLength}
                    error = {error}
                    editable = {editable}
                    rightText = {rightText}
                />
            </View>
            <Text style={styles.error}>{error}</Text>
        </View>
    )}else if(props.mask == 'credit-card'){
        if(ccType == 'amex' || 'Amex' || "AMEX"){
            var cc = 'amex'
        }else{
            var cc = 'visa-or-mastercard'
        }
        // For docs on text input masking:
        // https://github.com/benhurott/react-native-masked-text
        return (
            <View style={{flex: flex}}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                        <Text style={styles.label_disabled}>{rightText}</Text>
                     </View>
                    
                    <TextInputMask
                        type={'credit-card'}
                        options={{
                            obfuscated: false,
                            issuer: ccType
                        }}
                        value={value}
                        style={editable ? styles.input : styles.input_disabled}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        keyboardType='numeric' 
                        rightText = {rightText}
                    />
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>    
        )
    }if(props.mask == 'phone'){
        return (
            <View style={{flex: flex}}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                            <Text style={styles.label_disabled}>{rightText}</Text>
                    </View>
                    
                    <TextInputMask
                        type={'custom'}
                        options={{
                            mask: '999-999-9999'
                        }}
                        value={value}
                        style={editable ? styles.input : styles.input_disabled}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        keyboardType='numeric' 
                        rightText = {rightText}
                    />
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>    
        )
    }if(props.mask == 'mm/dd/yyyy'){
        return (
            <View style={{flex: flex}}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                        <Text style={styles.label_disabled}>{rightText}</Text>
                    </View>
                    
                    <TextInputMask
                        type={'custom'}
                        options={{
                            mask: '99/99/9999'
                        }}
                        value={value}
                        style={editable ? styles.input : styles.input_disabled}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        keyboardType='numeric' 
                        rightText = {rightText}
                    />
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>    
        )
    }if(props.mask == 'mm/yy'){
        return (
            <View style={{flex: flex}}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                            <Text style={styles.label_disabled}>{rightText}</Text>
                        </View>
                    
                    <TextInputMask
                        type={'custom'}
                        options={{
                            mask: '99/99'
                        }}
                        value={value}
                        style={editable ? styles.input : styles.input_disabled}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        keyboardType='numeric' 
                        rightText = {rightText}
                    />
                </View>
                <Text style={styles.error}>{error}</Text>
            </View>    
        )
    }if(props.mask == 'USD'){
        return(
            <View style={{flex: flex}}>
                    <View style={styles.container}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={editable ? styles.label : styles.label_disabled}>{label} </Text>
                            <Text style={styles.label_disabled}>{rightText}</Text>
                        </View>
                        <TextInputMask
                            type={'money'}
                            options={{
                                precision: 2,
                                separator: '.',
                                delimiter: ',',
                                unit: '$',
                                suffixUnit: ''
                            }}
                            value={value}
                            style={editable ? styles.input : styles.input_disabled}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            keyboardType='numeric' 
                            maxLength = {maxLength}
                            rightText = {rightText}
                        />
                    </View>
                    <Text style={styles.error}>{error}</Text>
                </View>    
        )
    }
};


const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        width: '100%',
        borderColor: '#eee',
        borderBottomWidth: 2

    },
    
    label: {
        paddingTop: 5,
        paddingBottom: 2,
        paddingTop: 0,
        color: '#333',
        fontSize: 14,
        fontWeight: '400',
        width: 'auto'
    },
    label_disabled: {
        paddingTop: 5,
        paddingBottom: 2,
        paddingTop: 0,
        color: Color.cosmos300,
        fontSize: 14,
        fontWeight: '400',
        width: 'auto'
    },
    input: {
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 0,
        color: '#333',
        fontSize: 18,
        width: '100%'
    },
    input_disabled: {
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 0,
        color: Color.mist900,
        fontSize: 18,
        width: '100%'
    },
    error: {
        paddingTop: 3,
        paddingBottom: 0,
        color: 'red',
        fontSize: 12,
        fontWeight: '300',
        width: 'auto'
    }
})

input.defaultProps = {
    editable: true,
    masked: false,
    ccType: 'visa-or-mastercard'
}

export default input