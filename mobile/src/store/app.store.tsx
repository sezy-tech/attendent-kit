import axios from 'axios';
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
  apiUrl?: string;
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
  onMounted: async (state, dispatch) => {
    try {
      const config = await axios.get('https://gist.githubusercontent.com/hoangly94/8057e9a3c588dae597a9703e06b340b7/raw/f569d4d5161c775485d2dd04d88c3d761d88b2e9/config.json') as any
      if (!config) return
      const apiUrl = config.data.API_URL
      if (!apiUrl) return
      console.log("==========---------------------")
      dispatch(state => {
        state.apiUrl = apiUrl
        return {
          ...state
        }
      });
    } catch (e) {
      console.log(e)
    }
  },
  actions: {
    firsLoaded() {
      this.state.firstTime = false;
    },
  },
});
