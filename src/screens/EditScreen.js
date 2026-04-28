import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';

const EditScreen = ({ route, navigation }) => {
  const { user, setUsers, users, isNew } = route.params;

  const [firstName, setFirstName] = useState(isNew ? '' : user.name.first);
  const [lastName, setLastName] = useState(isNew ? '' : user.name.last);
  const [email, setEmail] = useState(isNew ? '' : user.email);
  const [phone, setPhone] = useState(isNew ? '' : user.phone);
  // Yeni eklenen cinsiyet state'i
  const [gender, setGender] = useState(isNew ? 'male' : user.gender);

  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    if (isNew) {
      const newUser = {
        name: { first: firstName, last: lastName },
        email: email,
        phone: phone,
        gender: gender, // Seçilen cinsiyet buraya ekleniyor
        picture: { large: 'https://via.placeholder.com/150' },
      };
      setUsers([newUser, ...users]);
      Alert.alert("Başarılı", "Yeni kullanıcı listeye eklendi.");
    } else {
      const updatedUsers = users.map(u => 
        u.email === user.email ? { ...u, name: { first: firstName, last: lastName }, email, phone, gender } : u
      );
      setUsers(updatedUsers);
      Alert.alert("Başarılı", "Güncelleme tamamlandı.");
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isNew ? "Yeni Profil Oluştur" : "Profili Düzenle"}</Text>
      
      <Text style={styles.label}>Ad</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Ad" />

      <Text style={styles.label}>Soyad</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Soyad" />

      {/* Cinsiyet Seçim Alanı */}
      <Text style={styles.label}>Cinsiyet</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity 
          style={[styles.genderOption, gender === 'male' && styles.selectedMale]} 
          onPress={() => setGender('male')}
        >
          <Text style={[styles.genderText, gender === 'male' && styles.selectedText]}>Erkek</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.genderOption, gender === 'female' && styles.selectedFemale]} 
          onPress={() => setGender('female')}
        >
          <Text style={[styles.genderText, gender === 'female' && styles.selectedText]}>Kadın</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>E-posta</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        editable={isNew} 
      />

      <Text style={styles.label}>Telefon</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{isNew ? "Kullanıcıyı Kaydet" : "Değişiklikleri Uygula"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 25, color: '#111', marginTop: 10 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16, color: '#333' },
  
  genderContainer: { flexDirection: 'row', marginBottom: 25, justifyContent: 'space-between' },
  genderOption: { flex: 0.48, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', backgroundColor: '#F9FAFB' },
  genderText: { fontWeight: '600', color: '#6B7280' },
  
  selectedMale: { backgroundColor: '#EEF2FF', borderColor: '#6C63FF' },
  selectedFemale: { backgroundColor: '#FFF1F2', borderColor: '#FF6B6B' },
  selectedText: { color: '#111', fontWeight: 'bold' },

  saveBtn: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default EditScreen;