import  {React, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState()
  const cameraRef = useRef(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [open, setOpen] = useState(false)

  if (hasPermission === null) {
    return <View />
  } 
  
  if (hasPermission === false) {
    return <Text>Acesso negado</Text>
  }

  async function takePicture() {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync()
      setCapturedPhoto(data.uri)
      setOpen(true)
    }
  }


  useEffect(() => {
    (async () => {
      const { status} = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Camera type={type} style={styles.camera} ref={cameraRef} >
        <View style={styles.contentButtons}>
          <TouchableOpacity style={styles.buttonFlip} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
            <FontAwesome name="exchange" size={23} color="red" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={23} color="#fff" />
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (  
      <Modal animationType='slide' transparent={true} visible={open} >
         <View style={styles.contentModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
              <FontAwesome name="close" size={50} color="#fff" />
            </TouchableOpacity>
            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }}/>
         </View>
      </Modal>)} 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  contentButtons: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonFlip: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  }, 
  contentModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20,
  },
  closeButton:{
    position: 'absolute',
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto: {
    width: '100%',
    height: 400,
    borderRadius: 20,
  },
});
