import { View, Text, Alert, Image, Button, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import GoProTelemetry from 'gopro-telemetry'
import * as ImagePicker from 'expo-image-picker'
import FileSystem, { File, Directory, Paths} from 'expo-file-system'
import RNFS  from 'react-native-fs'
import GPMFExtract from 'gpmf-extract'
import gpmfextract from 'gpmf-extract'
import * as VideoThumbnails from 'expo-video-thumbnails';

export default function GetGoproData() {

    const [video, setVideo] = useState<string | null>(null)
    const [image, setImage] = useState<string | null>(null);

    const [telemetry, setTelemetry] = useState<string>("")

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

            setVideo(uri);
        }

        generateThumbnail(video)
        
    };


    const calculateData = async() => {

        try {

            const file = await File.pickFileAsync().then(output => {
                if (Array.isArray(output)) {
                    return output[0]
                }
                else return output
            })

            const chunkSize = 10 * 1024 * 1024; // 10MB

            const buffer: Buffer<ArrayBufferLike> = Buffer.from(file.bytesSync())


            gpmfextract(buffer, { browserMode: false })
                .then(extracted => {

                    console.log("extracted...")

                    GoProTelemetry(extracted, {}, telemetry => {
                        console.log("telemetry succesffull")
                        console.log(JSON.stringify(telemetry))
                        setTelemetry(JSON.stringify(telemetry))
                    })
                }).catch(err => console.log(err))

        } catch (error) {
            console.error(error);
        }
    }



    //this is set to false because I couldn't get it working...
    const useDataExtraction : boolean = false;


    return (
        <View style={styles.container}>
            <Button title="Pick a video from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }}  style={styles.image} />}

            {
                useDataExtraction ? (
                    <Button title="Calculate data of the video" onPress={calculateData} />
                )
                : null
            }
            

            <Text>{telemetry}</Text>
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