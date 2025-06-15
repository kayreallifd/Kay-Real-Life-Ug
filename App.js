import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Button
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

const mockContent = [
  { id: 1, title: 'Afrobeat Vibes', artist: 'Kay UG', type: 'Music', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Real Talk Episode 1', artist: 'Kay UG', type: 'Music', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);

  const filtered = [...mockContent, ...uploadedItems].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.artist.toLowerCase().includes(query.toLowerCase())
  );

  const handlePlay = async (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    if (item.type === 'Music') {
      const { sound } = await Audio.Sound.createAsync({ uri: item.url });
      await sound.playAsync();
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter email and password');
    }
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled) {
      const file = result.assets[0];
      const newItem = {
        id: uploadedItems.length + 100,
        title: file.name,
        artist: 'Uploaded by You',
        type: 'Music',
        url: file.uri,
      };
      setUploadedItems([...uploadedItems, newItem]);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Login to KAY REAL LIFE UG</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, borderRadius: 6 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, borderRadius: 6 }}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>KAY REAL LIFE UG</Text>
      <Button title="Upload Audio" onPress={handleUpload} />
      <TextInput
        placeholder="Search music, videos, artists..."
        value={query}
        onChangeText={setQuery}
        style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginVertical: 20 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{item.artist}</Text>
            <Text style={{ fontSize: 14, marginTop: 4 }}>Type: {item.type}</Text>
            <TouchableOpacity
              style={{ marginTop: 10, backgroundColor: '#000', padding: 10, borderRadius: 6 }}
              onPress={() => handlePlay(item)}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Play / View</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedItem?.title}</Text>
            <Text style={{ marginTop: 10 }}>{selectedItem?.artist}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
