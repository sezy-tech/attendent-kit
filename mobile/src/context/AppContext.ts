import React, { createContext } from 'react';

// Define the type for the context value
interface AppContextType {
    courseId: string | null;
    setCourseId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with an initial default value
const AppContext = createContext<AppContextType | undefined>(undefined);
export default AppContext;
