// import { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth';
// import firestore, {
//   FirebaseFirestoreTypes,
// } from '@react-native-firebase/firestore';
// import { DBCollection } from './models/db.model';

// interface DBSchema {
//   UserModel: DBCollection.UserModel;
// }

// export type FieldTypes<T> = {
//   [K in keyof T]: T[K];
// };

// const dbCollection = <T extends keyof DBSchema>(collectionName: T) => {
//   return firestore().collection<FieldTypes<DBSchema[T]>>(collectionName);
// };

// const currentUser = new Proxy({} as FirebaseAuthTypes.User, {
//   get(target, prop: never) {
//     const user = firebase.auth().currentUser;
//     if (user) return user?.[prop];
//     // RNRestart.Restart()
//   },
// });

// const DB = {
//   ...firestore(),
//   collection: dbCollection,
//   currentUser,
// };

// export default DB;
