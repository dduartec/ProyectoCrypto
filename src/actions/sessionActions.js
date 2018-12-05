import { sessionService } from 'redux-react-session';
import * as sessionApi from '../api/sessionApi';
import axios from 'axios';
//email: "assian4@gmail.com",password: "123456789"
export const login = (user, history) => {
  return () => {
    axios.post(`https://knowledge-community-back-end.herokuapp.com/sessions`, { email: user.email, password: user.password })
      .then(response => {
        const { token } = response.data.data.user.authentication_token;
        sessionService.saveSession({ token })
          .then(() => {
            sessionService.saveUser(response.data.data.user)
              .then(() => {
                history.push('/');
              }).catch(err => console.error(err));
          }).catch(err => console.error(err));
      }).catch(err => console.error(err));
  };
};
export function Welcome(user,history) {
  axios.post(`https://knowledge-community-back-end.herokuapp.com/sessions`, { email: user.email, password: user.password })
  .then(response => {
    const { token } = response.data.data.user.authentication_token;
    sessionService.saveSession({ token })
      .then(() => {
        sessionService.saveUser(response.data.data.user)
          .then(() => {
            history.push('/');
          }).catch(err => console.error(err));
      }).catch(err => console.error(err));
  }).catch(err => console.error(err));
}

export const signup = (user, history) => {
  return () => {
    axios.post(`https://knowledge-community-back-end.herokuapp.com/users`, { user })
      .then(response => {
        const { token } = response.data.authentication_token;
        sessionService.saveSession({ token })
          .then(() => {
            sessionService.saveUser(response.data)
              .then(() => {
                history.push('/');
              }).catch(err => console.error(err));
          }).catch(err => console.error(err));
      });
  };
};


export const logout = (history) => {
  return () => {
    return sessionApi.logout().then(() => {
      sessionService.deleteSession();
      sessionService.deleteUser();
      localStorage.clear();
      history.push('/welcome');
    }).catch(err => {
      throw (err);
    });
  };
};
