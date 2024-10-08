import { createStore } from '../core/redux-context';
// import DB from '../db';
import { DBCollection } from '../models/db.model';
// import { loadingStore } from './loading.store'
import { appStore } from './app.store';
import { sample, uniq } from 'lodash';
import { Alert } from 'react-native';

interface UserModel extends DBCollection.UserModel {
  id: string;
}
type RecordingDataStage =
  | 'fail'
  | ' done'
  // 0: just recording; 1: done step1; 2: done step 2; 3: waiting uploading; 4: done

interface RecordingDataSource {
  localPath: string;
}

interface RecordingData {
  stage?: RecordingDataStage;
  sources: RecordingDataSource[];
  model?: UserModel;
}

interface State {
  models: UserModel[];
  recordingData: RecordingData;
}

const state: State = {
  models: [],
  recordingData: {
    stage: 'fail',
    sources: [],
  },
};


export const { useModelStore, ModelStoreProvider, modelStore } = createStore({
  name: 'model',
  state,
  // persist: false,
  onMounted: async (state, dispatch) => {
    // dispatch(s => {
    //   s.recordingData = {
    //     stage: 'record_tut_1',
    //     sources: [],
    //     model: undefined
    //   }
    // })
    // DB.collection('UserModel')
    //   .where('userId', '==', DB.currentUser.uid)
    //   .onSnapshot(snapshot => {
    //     if (!snapshot) return;
    //     dispatch(state => {
    //       const data = snapshot.docs;
    //       if (!data) return;
    //       state.models = data.map(d => ({
    //         ...d.data(),
    //         id: d.id,
    //       }));

    //       if (!state.recordingData.model) {
    //         state.recordingData.model = state.models.find(m => !m.status);
    //       }

    //       // if(state.recordingData.sources[1]?.progess === 100){
    //       //   state.recordingData.stage = 'uploading'
    //       // }
    //       // else if(state.recordingData.sources[0]?.progess === 100){
    //       //   state.recordingData.stage = 'record_tut_2'
    //       // }
    //     });
    //   });
  },
  onStorageLoaded: async (state, dispatch) => {
    state.recordingData.stage
  },
  getters: {
   
  },
  actions: {
    setRecordingStage(stage: RecordingDataStage) {
      this.state.recordingData = {
        ...this.state.recordingData,
        stage,
      };
    },
    setRecordingSource(){
      // save db to fire base
    }
  },
});
