import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const DeviceIdScreen = () => {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Device ID:</Text>
      {deviceId ? (
        <Text selectable style={styles.deviceId}>{deviceId}</Text>
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
  label: {
    fontSize: 18, marginBottom: 8, color: '#333'
  },
  deviceId: {
    fontSize: 16, color: 'blue', paddingHorizontal: 20
  },
});

export default DeviceIdScreen;
