import { View, Text, Alert, Image, Button, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import GoProTelemetry from 'gopro-telemetry'
import * as ImagePicker from 'expo-image-picker'
import FileSystem, { File, Directory, Paths} from 'expo-file-system'
import RNFS  from 'react-native-fs'
import GPMFExtract from 'gpmf-extract'
import * as VideoThumbnails from 'expo-video-thumbnails';

export default function GetGoproData() {

    const [video, setVideo] = useState<string | null>(null)
    const [image, setImage] = useState<string | null>(null);


    const generateThumbnail = async (videoPath: string | null) => {
        if(videoPath === null) return;
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        videoPath
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  const convertToBase64  = async (uri : string) : Promise<ArrayBuffer> => {

    let result : string | ArrayBuffer | null = ""

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        result = reader.result
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error converting to base64:", error);
      Alert.alert("Error converting to base64");
    }

    return result ? ArrayBuffer.prototype
  };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: false,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {

            const uri = result.assets[0].uri

            //const destination = new Directory(Paths.cache, 'videos');

            

           try {
                
                //destination.create();
                //const output : string = new File(uri).textSync()

                //const file : File = new File(Paths.cache, 'videos', result.assets[0].fileName?? "vid.mp4")
                //file.write(output)

                const response = await fetch(uri);
                const blob = await response.blob();

                console.log("video type ", blob.type )

                GPMFExtract(blob)
                .then(extracted => {
                    GoProTelemetry(extracted, {}, telemetry => {
                        console.log("telemetry succesffull")
                        console.log(JSON.stringify(telemetry))
                    })
                }).catch(err => console.log(err))

            } catch (error) {
                console.error(error);
            }

            

            setVideo(uri);
        }
/*
        try {
            console.log("extract")
                const file : any = await File.pickFileAsync()

                const response = await fetch(file.uri);
                const blob = await response.blob();

                GPMFExtract(blob, )
                .then(extracted => {
                    GoProTelemetry(extracted, {}, telemetry => {
                        console.log("telemetry succesffull")
                        console.log(JSON.stringify(telemetry))
                    })
                }).catch(err => console.log(err))
                
            } catch (error) {
                console.error(error);
            }*/

        generateThumbnail(video)
        
    };



    return (
        <View style={styles.container}>
            <Button title="Pick a video from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }}  style={styles.image} />}
            <Text>{image}</Text>
            <Text>{video}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height: 200,
  },
});