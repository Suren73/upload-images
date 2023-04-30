import { upload } from './upload.js';

import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBYJ2Um4iwp2KaKRo2cppux5eLBarKWLg4',
  authDomain: 'fe-upload-833e6.firebaseapp.com',
  projectId: 'fe-upload-833e6',
  storageBucket: 'fe-upload-833e6.appspot.com',
  messagingSenderId: '594318094094',
  appId: '1:594318094094:web:e5d7a351cf66d71c53315f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const metadata = {
  contentType: 'image/jpeg',
};

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `image/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + '%';
          console.log('Upload is ' + percentage + '% done');
          const block = blocks[index].querySelector('.preview-info-progress');
          block.textContent = percentage;
          block.style.width = percentage;
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              // console.log(preview);
              // preview.innerHTML = '';
              // upload.style.display = 'inline';
              console.log('Download URL:', downloadURL);
            })
            .then(
              setTimeout(() => {
                document.querySelector('.primary').style.display = 'none';
                document.querySelector('.preview').innerHTML = '';
              }, 3000)
            );
        }
      );
    });
  },
});
