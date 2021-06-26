import subService from '../services/subs';

const secReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_ALL_SECS_LIST':
      return { ...state, allSecs: action.payload };
    case 'SET_TOP_SECS_LIST':
      return { ...state, topSecs: action.payload };
    case 'SUBSCRIBE_SEC_FROM_LIST':
      return {
        ...state,
        topSecs: state.topSecs.map((t) =>
          t.id !== action.payload.id ? t : { ...t, ...action.payload.data }
        ),
      };
    case 'ADD_NEW_SEC':
      return {
        ...state,
        allSecs: [...state.allSecs, action.payload],
      };
    default:
      return state;
  }
};

export const setSecList = () => {
  return async (dispatch) => {
    const sec = await subService.getAllSections();

    dispatch({
      type: 'SET_ALL_SECS_LIST',
      payload: sec,
    });
  };
};

export const setTopSecList = () => {
  return async (dispatch) => {
    const top10Sec = await subService.getTopSections();

    dispatch({
      type: 'SET_TOP_SECS_LIST',
      payload: top10Sec,
    });
  };
};

export const toggleSubscribe = (id, subscribedBy) => {
  return async (dispatch) => {
    const subscriberCount = subscribedBy.length;

    dispatch({
      type: 'SUBSCRIBE_SEC_FROM_LIST',
      payload: { id, data: { subscribedBy, subscriberCount } },
    });

    await subService.subscribeSec(id);
  };
};

export const addNewSec = (sectionObj) => {
  return async (dispatch) => {
    const createdSec = await subService.createSection(sectionObj);

    dispatch({
      type: 'ADD_NEW_SEC',
      payload: {
        sectionName: createdSec.sectionName,
        id: createdSec.id,
      },
    });
  };
};

export default secReducer;