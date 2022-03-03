/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from "react";
//import * as React from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image'

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
    // https://reactnative.dev/docs/dimensions
    width: 200, // https://reactnative.dev/docs/height-and-width
    //width: '75%',
    aspectRatio: 1,
  },
  listPhoto: {
    flex: 1,
    aspectRatio: 1
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  photoFull: {
    flex: 1,
  },
});

// React.memo is equivalent to PureComponent, but it only compares props.
// https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate
const PhotoListItem = React.memo(({ item, onPress }) => {
  //TODO: https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations
  // const shouldComponentUpdate=()=> {
  //   console.log("PhotoListItem: shouldComponentUpdate...");
  //   return false
  // }

  // const onLayout=(event)=> {
  //   const {x, y, height, width} = event.nativeEvent.layout;
  //   console.log("PhotoListItem: onLayout: width="+width);
  // }
  return (
    <TouchableHighlight key={item.key} onPress={onPress}>
      {/* <View style={styles.listItem} onLayout={onLayout}> */}
      <View style={styles.listItem}>
        <FastImage
          style={styles.listPhoto}
          //source={{uri: item.download_url}}
          //source={{uri: item.download_url, cache: 'only-if-cached'}}
          source={{uri:`https://picsum.photos/id/${item.id}/200`}}
        />
      </View>
    </TouchableHighlight>
  )
});

const PhotoList = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchPhotoList = async () => {
    console.log("PhotoListItem: fetchPhotoList...");
    // https://picsum.photos
    try {
      const response = await fetch('https://picsum.photos/v2/list?limit=100');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
   }
  }

  // Lifecycle hook
  useEffect(() => {
    fetchPhotoList();
  }, []);   // run only once, skipped since emtpy array [] never changes

  const renderItem = ({ item }) => {
    return (
      <PhotoListItem
        item={item}
        onPress={() => {
          //alert('Bang!');
          navigation.navigate('Detail', { item: item })
        }}
      />
    );
  };

  return (
    // https://reactnative.dev/docs/using-a-listview
    // https://reactnative.dev/docs/flatlist
    // https://reactnative.dev/docs/refreshcontrol
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          horizontal={false}
          numColumns={2}
          //maxToRenderPerBatch={10}
          //initialNumToRender={10}
        />
      )}
    </View>
  );
}

const PhotoDetail = ({ navigation, route }) => {
  // const onLayout=(event)=> {
  //   console.log("PhotoDetail: onLayout...");
  //   //const {x, y, height, width} = event.nativeEvent.layout;
  // }
  return (
    //<View style={styles.container} onLayout={onLayout}>
    <View style={styles.container}>
      <FastImage
        style={styles.photoFull}
        // style={{
        //   width: Dimensions.get('screen').width,
        //   height: Dimensions.get('screen').width,
        //   backgroundColor: "red"
        // }}
        //source={{uri: route.params.item.download_url}}
        source={{uri:`https://picsum.photos/id/${route.params.item.id}/${Dimensions.get('screen').width}/${Dimensions.get('screen').height}`}}
        //source={{uri:`https://picsum.photos/id/${route.params.item.id}/${Dimensions.get('screen').width}/${Dimensions.get('screen').height}`,cache: 'only-if-cached'}}
      />
    </View>
  );
};

const App: () => Node = () => {
  return (
    //TODO: Add back in SafeAreaView, StatusBar???
    // https://reactnative.dev/docs/safeareaview
    // https://reactnative.dev/docs/navigation
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Photos"
          component={PhotoList}
          options={{ title: 'Photos' }}
        />
        <Stack.Screen 
          name="Detail" 
          component={PhotoDetail}
          options={({ route }) => ({ title: route.params.item.author })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;