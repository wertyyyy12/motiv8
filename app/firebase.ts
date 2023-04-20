import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryConstraint,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI0pdNScooOr1zG1HpQ_EFsEZOcynq8LE",
  authDomain: "motiv8-9a647.firebaseapp.com",
  projectId: "motiv8-9a647",
  storageBucket: "motiv8-9a647.appspot.com",
  messagingSenderId: "621039869296",
  appId: "1:621039869296:web:f286b99432801c619543b5",
  measurementId: "G-0QMMZSKPG5",
};

export interface Task {
  id: string;
  taskName: string;
  creatorId: string;
  deadline: string;
  proof: string | null; //image?
  timestamp: string | null;
  evaluations: { evaluatorId: string; approved: boolean }[];
}

export interface User {
  id: string;
  googleId: string;
  name: string;
  groupIds: string[];
  email: string;
  picture: string;
}

export interface Group {
  id: string;
  code: string;
  name: string;
  activeTaskIds: string[];
  inactiveTaskIds: string[];
  currentStreak: number;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollection = collection(db, "tasks-test");
const groupsCollection = collection(db, "groups");
const usersCollection = collection(db, "users");
const storage = getStorage();
// Initialize Firebase Authentication and get a reference to the service

async function Find(
  collection: CollectionReference<DocumentData>,
  queryConstraint: QueryConstraint
) {
  const q = query(collection, queryConstraint);
  if (!q || !q[0]) {
    console.log("no q[");
    return null;
  }

  try {
    console.log(q[0]);

    const querySnapshot = await getDoc(q[0]);
    return querySnapshot;
  } catch (err) {
    console.log(err);
  }
}
export async function uploadImage(dataURL: string, taskId: string) {
  const r = doc(db, "tasks-test", taskId);
  const storageRef = ref(storage, taskId);
  const snapshot = await uploadString(storageRef, dataURL, "data_url");
  const imgSrc = await getDownloadURL(ref(storage, taskId));
  await updateDoc(r, {
    proof: imgSrc,
    timestamp: Date.now(),
  });
}

export async function evaluateProof(
  taskId: string,
  userId: string,
  approved: boolean
) {
  const newEval = {
    evaluator: userId,
    approved,
  };
  await updateDoc(doc(db, "tasks-test", taskId), {
    evaluations: arrayUnion(newEval),
  });
}

export async function getTaskData(groupId: string) {
  // const groupSnap = await getDocs(query(groupsCollection, where("id", "==", "groupId")));
  const groupSnap = doc(groupsCollection, groupId);
  const data = (await getDoc(groupSnap)).data();
  const activeTasks = [];
  for (const taskId of data.activeTaskIds) {
    activeTasks.push((await addIdToDoc(doc(tasksCollection, taskId))) as Task);
  }
  return activeTasks;
  // groupSnap.forEach((doc) => {
  //     const data = doc.data();
  //     for (const taskId of data.activeTaskIds) {
  //         getDoc(doc(db, tasksCollection, taskId));
  //     }
  // })

  // for (const taskId of group.activeTaskIds) {

  // }

  //userId controls whether they can approve or not
  // const querySnapshot = await getDocs(tasksCollection);
  // const tableData: Task[] = [];
  // querySnapshot.forEach((doc) => {
  //   const data = doc.data() as Task;
  //   tableData.push({
  //     ...doc.data(),
  //     id: doc.id,
  //     proof: data.proof ?? null,
  //     timestamp: data.timestamp ?? null,
  //     evaluations: data.evaluations ?? null,
  //   } as Task);
  // });
  // console.log("refreshing task data to", ps(tableData));
}

export async function addTask(
  taskData: Omit<Task, "proof" | "timestamp" | "evaluations" | "id">
) {
  await addDoc(tasksCollection, {
    ...taskData,
    timestamp: null,
    evaluations: [],
  });
}

export async function maybeAddUser(userData: Omit<User, "groupIds" | "id">) {
  const existingUser = (
    await Find(usersCollection, where("googleId", "==", userData.googleId))
  )?.data();
  console.log("existingUser = ", existingUser);

  if (existingUser) {
    console.log("user exists already");
    return existingUser as User;
  }
  const createdUserRef = await addDoc(usersCollection, {
    ...userData,
    groupIds: [],
  });
  const createdUser = (await addIdToDoc(createdUserRef)) as User;
  return createdUser;
}

export async function getUser(userId: string) {
  return (await addIdToDoc(doc(usersCollection, userId))) as User;
}

export async function addIdToDoc(documentRef: DocumentReference<unknown>) {
  const existing = (await getDoc(documentRef)).data() as any;
  return {
    ...existing,
    id: documentRef.id,
  };
}

export async function getUserIdFromGoogleId(googleId: string) {
  return (await Find(usersCollection, where("googleId", "==", googleId))).id;
}

export async function addGroup(groupName: string) {
  const code = Math.floor(100000 + Math.random() * 900000); //TODO: avoid random code collisions
  const data = {
    code,
    name: groupName,
    activeTaskIds: [],
    inactiveTaskIds: [],
    currentStreak: 0,
  };
  const ref = await addDoc(groupsCollection, data);
  return {
    ...data,
    id: ref.id,
  };
}

export async function getGroupIdFromCode(groupCode: string) {
  const q = query(groupsCollection, where("code", "==", groupCode));
  if (!q) return;
  const querySnapshot = await getDoc(q[0]);
  return querySnapshot.id;
}
