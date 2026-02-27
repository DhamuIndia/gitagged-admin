import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBiidCuiJO9FEZ7v33HtE0QLafyDBmyeP8",
    authDomain: "gitagged-a4689.firebaseapp.com",
    projectId: "gitagged-a4689",
    appId: "1:361921809315:web:77a0dbb7b1fc7fc9456816"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);