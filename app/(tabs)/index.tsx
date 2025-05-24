// Кейс-задача № 4
// Необходимо разработать мобильное приложение с графическим пользовательским интерфейсом, которое будет поддерживать создание, редактирование, удаление и поиск заметок в рамках работы любой организации. Приложение должно обеспечивать удобство ведения записей во время различных мероприятий, таких как совещания, собрания, конференции и другие деловые встречи.
// Основные функции приложения:
// 1. Создание заметки – возможность создания новой записи с указанием заголовка, даты, времени и содержания.
// 2. Редактирование заметки – возможность изменения существующей записи.
// 3. Удаление заметки – возможность удаления ненужных записей.
// 4. Поиск заметки – функция поиска, по ключевым словам, дате, времени или другим параметрам.
// Варианты хранения данных:
// Приложение должно предусматривать два способа хранения заметок:
// - В базе данных SQLite (локальное хранение).
// - С использованием файловой системы устройства (например, сохранение заметок в виде файлов).
// Дополнительные требования:
// - Приложение должно иметь интуитивный интерфейс, который позволит пользователям легко ориентироваться и выполнять необходимые операции без длительного обучения.
// - Поддержка разных платформ (iOS, Android) приветствуется.
// - Возможность синхронизации данных между устройствами через облачные сервисы может быть рассмотрена как дополнительная функциональность.
// Ответом к решению кейс-задачи станет руководство с иллюстрациями о том, как правильно пользоваться приложением, а также описание его функциональных возможностей. Дополнительно предоставьте ссылку на приложение удобным для вас способом вместе с пояснением для научного руководителя практики о том, каким образом можно протестировать данное приложение.

import { Image } from "expo-image";
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
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePickerExample from "../../components/dateComponent/date";
import { useSQLiteContext } from "expo-sqlite";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  time: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [notesView, setNotesView] = useState<Note[]>([]);
  const db = useSQLiteContext();

  const getNotes = async () => {
    try {
      const notes = await db.getAllAsync<Note>(
        "SELECT * FROM notes ORDER BY createdAt DESC"
      );
      setNotesView(notes || []);
    } catch (error) {
      console.error("Ошибка при загрузке заметок:", error);
      setNotesView([]);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  async function addNote() {
    try {
      if (!title?.trim() || !discription?.trim()) {
        Alert.alert("Ошибка", "Заголовок и описание не могут быть пустыми");
        return;
      }

      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = date.toTimeString().split(" ")[0];

      await db.runAsync(
        `INSERT INTO notes (title, content, date, time) VALUES (?, ?, ?, ?)`,
        [title.trim(), discription.trim(), formattedDate, formattedTime]
      );

      // Обновляем список заметок после добавления
      await getNotes();

      setTitle("");
      setDiscription("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={notesView}
          ListHeaderComponent={
            <>
              <Image
                style={styles.tinyLogo}
                source={require("../../assets/images/vid-sverhu-krasocnyh-zametok-s-bulavkoi-na-temnoi-poverhnosti.jpg")}
              />
              <Text style={styles.title}>Добро пожаловать в заметки</Text>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>Добавить заметку</Text>
              </Pressable>
            </>
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
              <Text style={styles.noteDate}>
                {new Date(item.createdAt).toLocaleDateString()} - {item.time}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Нет заметок</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Введите заголовок</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Введите заголовок"
                keyboardType="default"
                autoCorrect={true}
                autoCapitalize="sentences"
              />

              <Text style={styles.modalText}>Введите содержание</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={discription}
                onChangeText={setDiscription}
                placeholder="Введите содержание"
                keyboardType="default"
                autoCorrect={true}
                autoCapitalize="sentences"
                multiline
              />

              <DateTimePickerExample date={date} onDateChange={setDate} />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={addNote}
              >
                <Text style={styles.textStyle}>Сохранить</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  notesContainer: {
    flex: 1,
    padding: 10,
  },
  noteItem: {
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginVertical: 10,
  },
  tinyLogo: {
    width: "100%",
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  listContent: {
    paddingBottom: 20, // Добавляем отступ снизу
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
