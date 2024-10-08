// import { useState } from "react"
// import { PanGestureHandler, State } from 'react-native-gesture-handler';

// interface UseGestureProps {
//     swipe: {
//         left: () => void
//         right: () => void
//         top: () => void
//         bottom: () => void
//     }
// }

// const useGesture = ({
//     swipe
// }: UseGestureProps) => {
//     const [state, setState] = useState(false)

//     const handleGestureEvent = (event) => {
//         if (event.nativeEvent.translationX < -50 && event.nativeEvent.state === State.END) {
//             // Swipe left detected, you can perform your actions here
//             console.log('Swiped left!');
//         }
//     };

//     return  <PanGestureHandler onGestureEvent={handleGestureEvent}>
//       <View style={styles.content}>
//         {/* Your app content */}
//       </View>
//     </PanGestureHandler>
//     return {
//         refresh: () => setState(state => !state)
//     }
// }

// export default useGesture
