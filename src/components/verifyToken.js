import axios from 'axios';

export function verifyToken(session) {
    return new Promise((resolve, reject) => {
        resolve(
            axios.post('https://knowledge-community-back-end.herokuapp.com/users/1/token_verify', session),
            setTimeout(1000)

        );
    })
  }
/*export var verifyToken = (session) => {
    new Promise(function (resolve, reject) {
        // call resolve if the method succeeds
        resolve(axios.post('https://knowledge-community-back-end.herokuapp.com/users/1/token_verify', session));
    })
}*/


/*export const verifyToken = (session) => {
    axios.post('https://knowledge-community-back-end.herokuapp.com/users/1/token_verify', session)
            .then(response => {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            })
};*/