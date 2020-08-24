import React from 'react'
import { Text, StyleSheet, ActivityIndicator} from 'react-native'
import * as Font from 'expo-font'



class Txt extends React.Component{ 
    

    setFontType = (type) => {
        switch (type) {
            case 'black':
                return 'WorkSans-Black'
            case 'bold':
                return 'WorkSans-Bold'
            case 'extraBold':
                return 'WorkSans-ExtraBold'
            case 'semiBold':
                return 'WorkSans-SemiBold'
            case 'medium':
                return 'WorkSans-Medium'
            case 'italic':
                return 'WorkSans-Italic'
            case 'light':
                return 'WorkSans-Light'
            case 'extraLight':
                return 'WorkSans-ExtraLight'    
            case 'thin':
                return 'WorkSans-Thin'    
            default:
                return 'WorkSans-Regular'
        }

    }

 
    render(){
        const font = this.setFontType(this.props.type ? this.props.type : 'normal')
        const style = [{ fontFamily: font}, this.props.style || {}]
        const allProps = Object.assign({}, this.props,{style:style})
       
          
                return(<Text {...allProps}>{this.props.children}</Text>)
                
           
            
        
    }
}

export default Txt;