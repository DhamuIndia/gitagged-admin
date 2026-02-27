import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCL1RTCy_AHz__dkorIQwr-FO9i3R-da1Y",
    authDomain: "gitagged-a4689.firebaseapp.com",
    projectId: "gitagged-a4689",
    appId: "1:361921809315:web:77a0dbb7b1fc7fc9456816"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);