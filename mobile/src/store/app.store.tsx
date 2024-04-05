import { createStore } from '../core/redux-context';

// type RawClipCollection = { [key: string]: DBCollection.RawClip }
// type PlaylistCollection = { [key: string]: DBCollection.Playlist }
// type OnboardingDataStatus = 0 | 1 | 2 | 3 | 4  // 0: just onboarding; 1: done step1; 2: done step 2; 3: waiting uploading; 4: done
// type OnboardingDataStage = 'record_tut_1' | 'recording_1' | 'record_tut_2' | 'recording_2' | 'uploading' // 0: just onboarding; 1: done step1; 2: done step 2; 3: waiting uploading; 4: done

// interface OnboardingDataSource {
//   progess?: number
//   localPath: string,
// }

interface State {
  firstTime: boolean;
}

const state: State = {
  firstTime: true,
  // onboarding: {
  //   stage: 'record_tut_1',
  //   sources: [],
  //   relationshipId: 0,
  //   locationId: 0,
  // }
};

export const { useAppStore, AppStoreProvider, appStore } = createStore({
  name: 'app',
  state,
  onMounted: async (state, dispatch) => {},
  actions: {
    firsLoaded() {
      this.state.firstTime = false;
    },
  },
});
