import { useSQLiteContext } from "expo-sqlite";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";

import { Image } from "expo-image";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
export default function TabTwoScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [title, setTitle] = useState("");
  const [notesView, setNotesView] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const db = useSQLiteContext();

  interface Note {
    id: number;
    title: string;
    content: string;
    date: string;
    time: string;
    createdAt: string;
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getNotes = async (query = "") => {
    try {
      let notes;
      if (query) {
        // Поиск по названию или дате
        notes = await db.getAllAsync<Note>(
          `SELECT * FROM notes 
         WHERE title LIKE ? OR date LIKE ?
         ORDER BY createdAt DESC`,
          [`%${query}%`, `%${query}%`]
        );
      }
      // } else {
      //   // Получить все заметки если запрос пустой
      //   notes = await db.getAllAsync<Note>(
      //     "SELECT * FROM notes ORDER BY createdAt DESC"
      //   );
      // }
      setNotesView(notes || []);
      console.log(notesView)
    } catch (error) {
      console.error("Ошибка при загрузке заметок:", error);
      setNotesView([]);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Image
            style={styles.findLogo}
            source={require("../../assets/images/vzglyad-lupa-lyudi-paren-glaz.jpg")}
          />

          <Text style={styles.title}>Найди свои заметки</Text>
          <Text style={styles.modalText}>Введите слово или дату</Text>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              getNotes(text); // Вызываем поиск при каждом изменении текста
            }}
            placeholder="Поиск по названию или дате (ГГГГ-ММ-ДД)"
            placeholderTextColor="#999" // Добавляем цвет плейсхолдера
            keyboardType="default"
            autoCorrect={true}
            autoCapitalize="none"
            returnKeyType="search"
            blurOnSubmit={true}
            onSubmitEditing={() => getNotes(searchQuery)}
          />
          {searchQuery ? (
  <TouchableOpacity 
    style={styles.clearButton}
    onPress={() => {
      setSearchQuery('');
      getNotes();
    }}
  >
    <Text>Очистить</Text>
  </TouchableOpacity>
) : null}

  {/* Отображение результатов поиска */}
        <View style={styles.resultsContainer}>
          {notesView.length > 0 ? (
            <FlatList
              data={notesView}
              scrollEnabled={false} // Отключаем скролл, так как он уже есть в ScrollView
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteContent}>{item.content}</Text>
                  <View style={styles.noteFooter}>
                    <Text style={styles.noteDate}>{item.date}</Text>
                    <Text style={styles.noteTime}>{item.time}</Text>
                  </View>
                </View>
              )}
            />
          ) : searchQuery ? (
            <Text style={styles.noResultsText}>Ничего не найдено</Text>
          ) : null}
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
  flex: 1,
  backgroundColor: '#fff',
},
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  findLogo: {
    width: "100%",
    height: 200,
  },
  input: {
    width: "100%",
    height: 40,
      color: 'black', 
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginVertical: 10,
  },
  modalText: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: "left",
    fontWeight: "bold",
  },

  clearButton: {
    position: 'absolute',
    right: 25,
    top: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    marginTop: 16,
  },

  clearButtonText: {
    color: '#888',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteDate: {
    fontSize: 14,
    color: '#888',
  },
  noteTime: {
    fontSize: 14,
    color: '#888',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#888',
  },
  // scrollView: {
  //   flex: 1,
  //   backgroundColor: 'pink',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});
