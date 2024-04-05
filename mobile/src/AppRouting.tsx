import React from 'react';


import { ScrollView, View } from 'react-native';

import LoginLayout from './layouts/LoginLayout';
import HomeLayout from './layouts/HomeLayout';
import { RouterStoreConsumer, RouterStoreProvider } from './store/router.store';
import SplashLayout from './layouts/SplashLayout';
import FaceInput from './layouts/FaceInput';
import VerifyFace from './layouts/VerifyFace';
import VoiceInput from './layouts/VoiceInput';
import Schedule from './layouts/Schedule';
import Onboarding from './layouts/OnBoardingLayout';
import VerifyVoice from './layouts/VerifyVoice';
import Dashboard from './layouts/adminLayout/DashBoard';
import RoomLayout from './layouts/adminLayout/RoomLayout';
import UserLayout from './layouts/adminLayout/UserLayout';
import SubjectLayout from './layouts/adminLayout/SubjectLayout';

function AppRouting(): JSX.Element {
  return (
    <RouterStoreProvider>
      <RouterStoreConsumer
        routes={[
         
          // {
          //   path: '/onboarding',
          //   name:'onboarding',
          //   element: <Onboarding />,
          // },
          // {
          //   path: '',
          //   name:'splash',
          //   element: <SplashLayout />,
          // },
           {
            path: '',
            name:'dashboard',
            element: <Dashboard />,
          },
          {
            path: '/room',
            name:'room',
            element: <RoomLayout />,
          },
          {
            path: '/admin/user',
            name:'admin-user',
            element: <UserLayout />,
          },
          {
            path: '/admin/subject',
            name:'admin-subject',
            element: <SubjectLayout />,
          },
          // {
          //   path: '',
          //   name: 'login',
          //   element: <LoginLayout />,
          // },
          //  {
          //   path: '/verify-face',
          //   name: 'verify',
          //   element: <VerifyFace />,
          // },
          // {
          //   path: '/verify-voice',
          //   name: 'verify-voice',
          //   element: <VerifyVoice />,
          // },
          // {
          //   path: '/home',
          //   name: 'home',
          //   element: <HomeLayout />,
          // },
          // {
          //   path: '/face-input',
          //   name: 'faceinput',
          //   element: <FaceInput />,
          // },
          // {
          //   path: '',
          //   name: 'voiceinput',
          //   element: <VoiceInput />,
          // },
          // {
          //   path: '/schedule',
          //   name: 'schedule',
          //   element: <Schedule />,
          // },
        ]}
      />
    </RouterStoreProvider>
  );
}

function MainRouting(): JSX.Element {
  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <RouterStoreConsumer
            routes={[
              // {
              //   path: '/mode/listen/playlist/new',
              //   name: 'create_playlist',
              //   element: <PlaylistLayout />,
              // },
              // {
              //   path: '/mode/listen/:categoryId/playlist/:playlistId',
              //   name: 'playlist',
              //   element: <PlaylistLayout />,
              // },
            
              // {
              //   path: '/mode/play/1',
              //   name: 'flash_card',
              //   element: <FlashCardModeLayout />,
              // },
            ]}
          />
        </ScrollView>
      </View>
    </>
  );
}

export default AppRouting;
