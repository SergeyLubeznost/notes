import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSQLiteContext } from "expo-sqlite";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  time: string;
  createdAt: string;
}

const DisplayNotes = () => {
  const db = useSQLiteContext();
  const [notesView, setNotesView] = useState<Note[]>([]); // Инициализируем пустым массивом

  const getNotes = async () => {
    try {
      const notes = await db.getAllAsync<Note>(
        "SELECT * FROM notes ORDER BY createdAt DESC"
      );
      console.log("Все записи в БД:", notes);
      setNotesView(notes || []); // На случай если notes будет undefined
    } catch (error) {
      console.error("Ошибка при загрузке заметок:", error);
      setNotesView([]); // При ошибке тоже устанавливаем пустой массив
    }
  };

  useEffect(() => {
    getNotes();
  }, []); // Добавляем зависимость

  return (
    
    <View style={{ padding: 10 }}>
      {notesView.length > 0 ? (
        <FlatList
          data={notesView}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, marginBottom: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.content}</Text>
              <Text style={{ color: 'gray' }}>
                {new Date(item.createdAt).toLocaleDateString()} - {item.time}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>Нет заметок</Text>
      )}
    </View>
  );
};

export default DisplayNotes;