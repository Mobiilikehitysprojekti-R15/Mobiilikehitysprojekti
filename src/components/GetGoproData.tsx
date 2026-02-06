import { View, Text, Alert, Image, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import GoProTelemetry from 'gopro-telemetry'
import * as ImagePicker from 'expo-image-picker'

export default function GetGoproData() {

    const [video, setVideo] = useState<string | null>(null)

    const [videoName, setVideoname] = useState<string>("")


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
            aspect: [16, 9],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setVideo(result.assets[0].uri);
        }


        
    };


    useEffect(() => {


        const getTelemetry = async (filePath: string| null) => {


            //const telemetry = await goproTelemetry(input, {stream: ['ACCL'], repeatSticky:true})

            //console.log(telemetry)
        }

        getTelemetry(video)

    },[video])


    return (
        <View>
            <Button title="Pick a video from camera roll" onPress={pickImage} />

            <Text>{videoName}</Text>
        </View>
    )
}