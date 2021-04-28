import { SET_USER_CONTENT } from './types';
import { DELETE_USER_CONTENT } from './types';

export const getUserContent = jwt => (dispatch) => {
    fetch('/index', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(jwt)
    })
    .then(res => res.json())
    .then(json => {
        dispatch({
            type: SET_USER_CONTENT,
            payload: json
        })
    });
};

export const deleteContent = contentId => (dispatch) => {
    fetch('/delete', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(contentId)
      })
    .then(res => res.json())
    .then(json => {
        /* dispatch({
            type: DELETE_USER_CONTENT,
            payload: json.id
        }) */
        console.log(json.id)
    })
}