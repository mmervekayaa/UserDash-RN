import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'admin@test.com' && password === '123456') {
      navigation.replace('Home');
    } else {
      Alert.alert("Hata", "Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
        <Text style={styles.subText}>Devam etmek için giriş yapın</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF', justifyContent: 'center' },
  circle: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.1)', top: -50, right: -50 },
  headerContainer: { paddingHorizontal: 30, marginBottom: 40 },
  welcomeText: { fontSize: 34, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  formContainer: { backgroundColor: '#fff', marginHorizontal: 25, padding: 25, borderRadius: 20, elevation: 10 },
  input: { backgroundColor: '#f1f3f6', padding: 15, borderRadius: 12, marginBottom: 15, color: '#333' },
  loginButton: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default LoginScreen;