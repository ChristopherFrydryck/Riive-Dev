import React from 'react'
import { View, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';

// Props:
// source
// backupSource = backup if image fails or is loading
// underlayColor
// backupSource
// aspectRatio
// resizeMode
// enabled
// onPress
// accessibilityLabel

class Img extends React.Component{
    constructor(props){
        super(props)

        this.state={
            isReady: false,
        }
    }

    render(){
        const style = [styles.img,  this.props.style || {}]
        const allProps = Object.assign({}, this.props,{style:style}) 

        return(
            <TouchableOpacity
           
                onPress={this.props.onPress}
                disabled={this.props.onPress ? false : true}

            >
                <ImageBackground
                    {...allProps}
                    style={{aspectRatio: this.props.aspectRatio, resizeMode: this.props.resizeMode}}
                    source={this.state.isReady ? null : this.props.backupSource}
                >
                    <Image 
                        underlayColor = {this.props.underlayColor}
                        style={{aspectRatio: this.props.aspectRatio, resizeMode: this.props.resizeMode}}
                        source={this.props.source}
                        defaultSource = {this.props.backupSource}
                        onLoad = {() => this.setState({imgReady: true})}
                        {...allProps}
                    />
                </ImageBackground>
            </TouchableOpacity>
        )
    }    
}

const styles = StyleSheet.create({
    img: {
        height: null,
        width: null,
        
    }
})

export default Img