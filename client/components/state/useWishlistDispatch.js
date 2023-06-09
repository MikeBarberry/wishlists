import { useContext } from 'react';
import { WishlistDispatchContext } from '..';
import jwtDecode from 'jwt-decode';
import { postReq } from '../../utils';

export default function useWishlistDispatch() {
  const dispatch = useContext(WishlistDispatchContext);

  const setUser = (token) => {
    localStorage.setItem('jwt', token);
    const decoded = jwtDecode(token);
    dispatch({
      type: 'set_user',
      user: decoded.username,
    });
  };

  const logoutUser = () => {
    localStorage.clear();
    dispatch({
      type: 'set_user',
      user: '',
    });
  };

  const getUserContent = async (token) => {
    togglePageLoading(true);
    try {
      const res = await postReq('/getcontent', { token });
      const json = await res.json();
      dispatch({
        type: 'set_cards',
        cards: json,
      });
    } catch (err) {
      updatePageMessage('A server error occurred', 'error');
      console.error(`Get content error: ${err}`);
    }
    togglePageLoading(false);
  };

  const addContent = async (body) => {
    const { token, ...rest } = body;
    toggleAddFormLoading(true);
    try {
      const res = await postReq('/addcontent', body);
      const json = await res.json();
      dispatch({
        type: 'add_card',
        card: { ...rest, id: json.id },
      });
      resetAddForm();
      updatePageMessage('Card Added!');
    } catch (err) {
      updatePageMessage('A server error occurred', 'error');
      console.error(`Add content error: ${err}`);
    }
    toggleAddFormLoading(false);
  };

  const deleteContent = async (body) => {
    await postReq('/deletecontent', body);
    dispatch({
      type: 'remove_card',
      id: body.id,
    });
  };

  const validateAddedContent = (a, b, c) => {
    if (!a || !b || !c) {
      updatePageMessage('A field is missing.', 'error');
      return false;
    }
    return true;
  };

  const updateAddForm = (target) => {
    dispatch({
      type: 'update_add_form',
      target: target.name,
      value: target.value,
    });
  };

  const togglePageLoading = (loading) => {
    dispatch({ type: 'toggle_loading', location: 'page', loading });
  };

  const toggleAddFormLoading = (loading) => {
    dispatch({ type: 'toggle_loading', location: 'add', loading });
  };

  const resetAddForm = () => {
    dispatch({ type: 'reset_add_form' });
  };

  const updatePageMessage = (text, severity) => {
    dispatch({
      type: 'update_page_message',
      text,
      severity: severity || 'success',
    });
  };

  const increaseCardCount = () => {
    dispatch({ type: 'increase_card_count' });
  };

  const updateSearchQuery = (query) => {
    dispatch({ type: 'update_search_query', query });
  };

  return {
    setUser,
    logoutUser,
    getUserContent,
    addContent,
    deleteContent,
    updateAddForm,
    validateAddedContent,
    resetAddForm,
    updatePageMessage,
    increaseCardCount,
    updateSearchQuery,
  };
}
