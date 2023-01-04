import React, { useState, useEffect, useRef } from 'react';
import { Text, View, image, TouchableOpacity, SafeAreaView, StyleSheet, ToastAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { color } from '@rneui/base';
import Main from './src/views/main/Main';

const TensorCamera = cameraWithTensors(Camera);
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null)
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [cameraRef, setCameraRef] = useState(null)
  const [recording, setRecording] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isActive, setActive] = useState(false)
  const [video, setVideo] = useState();
const  handleCameraStream=(images, updatePreview, gl)=> {
    const loop = async () => {
      const nextImageTensor = images.next().value

      //
      // do something with tensor here
      //

      // if autorender is false you need the following two lines.
      // updatePreview();
      // gl.endFrameEXP();

      requestAnimationFrame(loop);
    }
    loop();
  }
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      console.log('You did not select any video.');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  if (video) {
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
        ToastAndroid.show('Successfully Saved to Gallery', ToastAndroid.CENTER);
      });
    };
console.log('aaaaaaaa');
    return (

      <Main/>
    //   <View>
    //   <TensorCamera
    //    // Standard Camera props
    //    style={styles.camera}
    //    type={Camera.Constants.Type.front}
    //    // Tensor related props
    //    resizeHeight={200}
    //    resizeWidth={152}
    //    resizeDepth={3}
    //    onReady={handleCameraStream}
    //    autorender={true}
    //   />
    // </View>
      // <SafeAreaView >
      //   <Video
      //     style={styles.video}
      //     source={{ uri: video.uri }}
      //     useNativeControls
      //     resizeMode='contain'
      //     isLooping
      //   />

      //   {hasMediaLibraryPermission ? <TouchableOpacity style={

      //     styles.button
      //   } onPress= {saveVideo}
      //   >
      //     <Text style={{ fontSize: 27,  fontWeight: 'bold', fontFamily: 'sans-serif' }}>Save</Text>
      //     {/* Camera Screen Style  */}
      //   </TouchableOpacity> : undefined}

      //   <TouchableOpacity style={
      //     styles.button1
      //   } onPress={()=> setVideo(undefined)}>

      //     <Text style={{ fontSize: 25,  fontWeight: 'bold', fontFamily: 'sans-serif' }}>Discard</Text>
      //     {/* Camera Screen Style  */}
      //   </TouchableOpacity>
      // </SafeAreaView>
    );
  }
  


  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
        ratio={"16:9"}
      >


        {/* Recent Activities Style  */}
        <TouchableOpacity title='' style={{
          borderWidth: 6,
          borderRadius: 50,
          height: 50,
          width: 50,
          backgroundColor: 'grey',
          marginLeft: 295,
          marginTop: 50,
        }} >
        </TouchableOpacity>
        {/* Camera Screen Style  */}
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {/* Gallery Style  */}
            <TouchableOpacity
              onPress={pickImageAsync}
            >
              <View
                style={{
                  borderWidth: 3,
                  borderColor: "white",
                  borderRadius: 13,
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20
                }}
              >
                <View
                  style={{
                    borderWidth: 4,
                    borderRadius: 13,
                    borderColor: "grey",
                    height: 40,
                    width: 40,
                    backgroundColor: 'smokeWhite',

                  }}
                >

                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                if (!recording) {
                  setActive(true)
                  setRecording(true);
                  let video = await cameraRef.recordAsync();
                  setVideo(video)
                  console.log("video", video);
                } else {
                  setRecording(false);
                  cameraRef.stopRecording();
                  setActive(false)
                }
              }}
            >
              <View
                style={{
                  borderWidth: 4,
                  borderRadius: 50,
                  borderColor: isActive ? 'red' : 'white',
                  height: 90,
                  width: 90,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 95
                }}
              >
                <View
                  style={{
                    borderWidth: 5,
                    borderRadius: 40,
                    borderColor: isActive ? "red" : 'grey',
                    height: 70,
                    width: 70,
                    backgroundColor: isActive ? "red" : 'black',

                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: '#fff',
    alignSelf: "stretch"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#9dd600",
    padding: 10,
    borderRadius: 40,
    height: 60,
    width: 120,
    marginTop: 300,
    marginBottom: 15,
    marginLeft: 119,
    alignContent: 'center',
    margin: 'auto',

  },
  button1: {
    alignItems: "center",
    backgroundColor: "#E94B3CFF",
    padding: 10,
    borderRadius: 40,
    height: 60,
    width: 120,
    //   backgroundColor: 'grey',
      margin: 'auto',
    marginBottom: 15,
    marginLeft: 120,
    alignContent: 'center',
   
  }
});
