import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, 
  TouchableOpacity, StyleSheet, Alert, RefreshControl, SafeAreaView 
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  // API'den verileri çekme
  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://randomuser.me/api/?results=20');
      const data = await response.json();
      setUsers(data.results);
    } catch (error) {
      Alert.alert("Hata", "Veriler yüklenemedi.");
    } finally {
      setRefreshing(false);
    }
  };

  // Kullanıcı Silme
  const deleteUser = (email) => {
    Alert.alert("Onay", "Kullanıcıyı silmek istediğinize emin misiniz?", [
      { text: "Vazgeç" },
      { text: "Sil", style: 'destructive', onPress: () => setUsers(users.filter(u => u.email !== email)) }
    ]);
  };

  // Filtreleme ve Sıralama Mantığı
  const filteredUsers = users
    .filter(u => {
      const nameMatch = (u.name.first + " " + u.name.last).toLowerCase().includes(search.toLowerCase());
      const genderMatch = genderFilter === 'all' || u.gender === genderFilter;
      return nameMatch && genderMatch;
    })
    .sort((a, b) => isSorted ? a.name.first.localeCompare(b.name.first) : 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık ve Ekle/Sırala Butonları */}
      <View style={styles.header}>
        <Text style={styles.counter}>Yönetim Paneli</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('Edit', { isNew: true, setUsers, users })}
          >
            <Text style={styles.addButtonText}>+ Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setIsSorted(!isSorted)}>
            <Text style={styles.sortBtnText}>{isSorted ? "Sıralamayı Kaldır" : "A-Z"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Arama Çubuğu */}
      <TextInput 
        style={styles.searchBox} 
        placeholder="Kullanıcı ara..." 
        placeholderTextColor="#999"
        value={search} 
        onChangeText={setSearch} 
      />

      {/* Cinsiyet Filtreleme Butonları */}
      <View style={styles.filterRow}>
        {['all', 'male', 'female'].map((filter) => (
          <TouchableOpacity 
            key={filter}
            style={[styles.filterBtn, genderFilter === filter && styles.activeBtn]} 
            onPress={() => setGenderFilter(filter)}
          >
            <Text style={[styles.filterText, genderFilter === filter && styles.activeText]}>
              {filter === 'all' ? 'Hepsi' : filter === 'male' ? 'Erkek' : 'Kadın'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kullanıcı Listesi */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.email}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} color="#6C63FF" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Edit', { user: item, setUsers, users, isNew: false })}
          >
            <Image source={{ uri: item.picture?.large || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name.first} {item.name.last}</Text>
              <Text style={styles.subInfo}>{item.email}</Text>
              <Text style={[styles.genderTag, { color: item.gender === 'male' ? '#6C63FF' : '#FF6B6B' }]}>
                ● {item.gender === 'male' ? 'Erkek' : 'Kadın'}
              </Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteUser(item.email)}>
               <Text style={styles.deleteText}>Sil</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      
      {/* Çıkış Butonu */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Güvenli Çıkış</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  counter: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addButton: { backgroundColor: '#6C63FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  sortBtn: { backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  sortBtnText: { color: '#4B5563', fontWeight: '600' },
  searchBox: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, fontSize: 16, marginBottom: 15, elevation: 2 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  filterBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 4, borderRadius: 10, elevation: 1 },
  activeBtn: { backgroundColor: '#6C63FF' },
  filterText: { color: '#6B7280', fontWeight: '600' },
  activeText: { color: '#FFF' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', marginBottom: 15, borderRadius: 20, alignItems: 'center', elevation: 3 },
  avatar: { width: 60, height: 60, borderRadius: 15 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 17, fontWeight: '700', color: '#111827' },
  subInfo: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  genderTag: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  deleteBtn: { padding: 10, backgroundColor: '#FEF2F2', borderRadius: 10 },
  deleteText: { color: '#EF4444', fontWeight: 'bold', fontSize: 12 },
  logoutButton: { backgroundColor: '#111827', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#FFF', fontWeight: 'bold' }
});

export default HomeScreen;