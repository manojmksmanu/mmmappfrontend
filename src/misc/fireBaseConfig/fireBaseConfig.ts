import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBeKiBHLu0Py4MX57KiVtf4d5MvJuZwrQo",
  authDomain: "mmmapp-7f726.firebaseapp.com",
  projectId: "mmmapp-7f726",
  storageBucket: "mmmapp-7f726.appspot.com",
  messagingSenderId: "753986425375",
  appId: "1:753986425375:web:5ca967d0d3904d6d5cbb2a",
  measurementId: "G-WP8JDP714Y",
  databaseURL: "https://mmmapp-7f726-default-rtdb.firebaseio.com/", // Add this line
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAybI_dJ1ZTy6XmJodG8qZ_9fQ-cWAVjnM",
//   authDomain: "reactnative-a9cd0.firebaseapp.com",
//   projectId: "reactnative-a9cd0",
//   storageBucket: "reactnative-a9cd0.appspot.com",
//   messagingSenderId: "1077116040460",
//   appId: "1:1077116040460:web:cc36eccf776193c0848529",
//   measurementId: "G-4C5V3PD6Q4",
//   databaseURL: "https://reactnative-a9cd0.firebaseio.com",
// };

// Initialize Firebase app if it hasn't been initialized already
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
