// function authenticateUser() {
//   let endpoint = 'http://localhost:22742/api/TokenAuth/Authenticate';
//   endpoint = endpoint.replace(/[?&]$/, '');

//   const headers = new Headers({
//     'Content-Type': 'application/json',
//   });

//   const body = JSON.stringify({
//     userNameOrEmailAddress: 'admin',
//     password: '123qwe',
//   });

//   const requestOptions = {
//     method: 'POST',
//     headers: headers,
//     body: body,
//   };

//   return fetch(endpoint, requestOptions)
//     .then((response) => response.json())
//     .catch((error) => console.error('Error:', error));
// }

// // Usage
// authenticateUser().then((data) => console.log(data));

chrome.runtime.onInstalled.addListener(() => {
  console.log("Styled Hyperlinks Plug-in Installed");
});
