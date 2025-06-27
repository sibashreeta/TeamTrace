// src/services/chatService.ts
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,//
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

export const generateChatId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join("_");
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  const chatRef = doc(db, "chats", chatId);
  const exists = await getDoc(chatRef);

  if (!exists.exists()) {
    await setDoc(chatRef, {
      participants: chatId.split("_"),
      createdAt: serverTimestamp(),
      lastMessage: text,
      lastTimestamp: serverTimestamp(),
    });
  } else {
    await setDoc(chatRef, {
      lastMessage: text,
      lastTimestamp: serverTimestamp(),
    }, { merge: true });
  }

  await addDoc(collection(chatRef, "messages"), {
    senderId,
    text,
    timestamp: serverTimestamp(),
    visibleTo: chatId.split("_"),
  });
};

export const subscribeToMessages = (
  chatId: string,
  onUpdate: (messages: DocumentData[]) => void
) => {
  const uid = getAuth().currentUser?.uid;
  if (!uid) return () => {};

  const msgRef = collection(db, "chats", chatId, "messages");
  const q = query(msgRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((msg) => msg.visibleTo?.includes(uid));

    onUpdate(msgs);
  });
};
