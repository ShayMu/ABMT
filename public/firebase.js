const storage = firebase.app().storage('gs://abmt-7c76e.appspot.com').ref();
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const server = 'https://us-central1-abmt-7c76e.cloudfunctions.net/';
let userEmail = '';

ui.start('#firebaseui-auth-container', {
    callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            validSignIn(authResult);
            return false;
        }
    },
    signInSuccessUrl: 'index.html',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ]
});

async function getImage(path) {
    return storage.child(path).getDownloadURL();
}

function validSignIn(authResult) {
    userEmail = authResult.user.email;

    document.getElementsByClassName('main')[0].style.display = '';
    document.getElementById('firebaseui-auth-container').style.display = 'none';
}

function sendSessionInfo(info) {
    const Http = new XMLHttpRequest();
    const url = server + 'saveSessionInfo';
    Http.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    Http.send({
        session: info,
        email: userEmail,
        date: new Date().toLocaleDateString('en-GB')
    });

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
    }
}