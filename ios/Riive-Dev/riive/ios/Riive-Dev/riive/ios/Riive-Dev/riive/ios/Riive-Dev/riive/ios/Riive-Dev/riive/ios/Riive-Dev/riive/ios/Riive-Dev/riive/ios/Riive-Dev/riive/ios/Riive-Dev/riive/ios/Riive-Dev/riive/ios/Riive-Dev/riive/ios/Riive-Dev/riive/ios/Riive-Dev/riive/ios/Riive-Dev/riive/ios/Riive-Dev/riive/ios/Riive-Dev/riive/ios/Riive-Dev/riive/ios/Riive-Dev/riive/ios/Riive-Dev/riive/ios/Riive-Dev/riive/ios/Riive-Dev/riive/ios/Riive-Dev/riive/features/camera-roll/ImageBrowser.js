  
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
  Button,
  ActivityIndicator,
  CameraRoll,
  PermissionsAndroid,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import ImageTile from './ImageTile';
const { width } = Dimensions.get('window')

export default class ImageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: {},
      // orderSelected: [],
      after: null,
      has_next_page: true
    }
  }

  componentDidMount() {
    this.getPhotos()
  }

  selectImage = (index) => {
   
    let newSelected = {...this.state.selected};
    // let newArr = this.state.orderSelected
    if (newSelected[index]) {
      // for(let i = 0; i < newArr.length; i++){
      //   if(newArr[i] == index){
      //     console.log("removing " + newArr[i])
      //     newArr.splice(i, 1)
      //   }else{
          
      //   }
      // }
    
        
        // this.setState({orderSelected: this.state.orderSelected.filter(x => x !== index)});
      
      delete newSelected[index];
    
    } else {
      newSelected[index] = true
    }

    if (Object.keys(newSelected).length > this.props.max)
     return;
    if (!newSelected) newSelected = {};
    this.setState({ selected: newSelected})
    // this.setState({ selected: newSelected, orderSelected: [...this.state.orderSelected, index]})


    // console.log(newArr)
    // console.log(this.state.orderSelected)
  }

  getPhotos = () => {
    let params = { first: 50, assetType: 'Photos' };
    if (this.state.after) params.after = this.state.after
    if (Platform.OS === 'ios') params.groupTypes = 'All' 
    if (!this.state.has_next_page) return
    CameraRoll
      .getPhotos(params)
      .then(this.processPhotos)
  }

  getPhotoswithPermissions = async() => {
    console.log("TRYING>>>")
    if(Platform.OS === 'ios'){
        this.getPhotos()
    }else{
        try{
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
              'title': 'Access Storage',
              'message': "Access Storage for the pictures"
            })
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                console.log("ACCESS GRANTED!")
                this.getPhotos();
            }else{
                console.log("Permissions Denied")
            }
        }catch(e){
            console.warn(e)
        }
    }
  }

  processPhotos = (r) => {
    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map(i=> i.node).map(i=> i.image).map(i=>i.uri)
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  getItemLayout = (data,index) => {
    let length = width/4;
    return { length, offset: length * index, index }
  }

  prepareCallback() {
    let { selected, photos } = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return(selected[index])
    });
    let files = selectedPhotos
      .map(i => FileSystem.getInfoAsync(i, {md5: true}))
    let callbackResult = Promise
      .all(files)
      .then(imageData=> {
        return imageData.map((data, i) => {
          return {file: selectedPhotos[i], ...data}
        })
      })
    this.props.callback(callbackResult)
  }

  renderHeader = () => {
    let selectedCount = Object.keys(this.state.selected).length;
    let headerText = selectedCount + ' Selected';
    if (selectedCount === this.props.max) headerText = headerText + ' (Max)';
    return (
      <View style={styles.header}>
        <Button
          title="Exit"
          onPress={() => this.props.callback(Promise.resolve([]))}
        />
        <Text>{headerText}</Text>
        <Button
          title="Choose"
          onPress={() => this.prepareCallback()}
        />
      </View>
    )
  }
  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false
    return(
      <ImageTile
        item={item}
        numSelected = {index}
        index={index}
        selected={selected}
        selectImage={this.selectImage}
      />
    )
  }
  renderImages() {
    return(
      <FlatList
        data={this.state.photos}
        numColumns={4}
        renderItem={this.renderImageTile}
        keyExtractor={(_,index) => index}
        onEndReached={()=> {this.getPhotoswithPermissions()}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator /></View>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20
  },
})