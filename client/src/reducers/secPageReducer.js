import subService from '../services/subs';
import postService from '../services/posts';

const secPageReducer = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_SEC':
      return action.payload;
    case 'LOAD_SEC_POSTS':
      return {
        ...state,
        posts: {
          ...action.payload.posts,
          results: [...state.posts.results, ...action.payload.posts.results],
        },
      };
    case 'TOGGLE_SECPAGE_VOTE':
      return {
        ...state,
        posts: {
          ...state.posts,
          results: state.posts.results.map((p) =>
            p.id !== action.payload.id ? p : { ...p, ...action.payload.data }
          ),
        },
      };
    case 'SUBSCRIBE_SEC':
      return {
        ...state,
        secDetails: { ...state.secDetails, ...action.payload },
      };
    case 'EDIT_DESCRIPTION':
      return {
        ...state,
        secDetails: { ...state.secDetails, description: action.payload },
      };
    default:
      return state;
  }
};

export const fetchSec = (sectionName, sortBy) => {
  return async (dispatch) => {
    const sec = await subService.getSection(sectionName, sortBy, 10, 1);

    dispatch({
      type: 'FETCH_SEC',
      payload: sec,
    });
  };
};

export const loadSecPosts = (sectionName, sortBy, page) => {
  return async (dispatch) => {
    const sec = await subService.getSection(sectionName, sortBy, 10, page);

    dispatch({
      type: 'LOAD_SEC_POSTS',
      payload: sec,
    });
  };
};

export const toggleUpvote = (id, upvotedBy, downvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_SECPAGE_VOTE',
      payload: { id, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.upvotePost(id);
  };
};

export const toggleDownvote = (id, downvotedBy, upvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_SECPAGE_VOTE',
      payload: { id, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.downvotePost(id);
  };
};

export const toggleSubscribe = (id, subscribedBy) => {
  return async (dispatch) => {
    const subscriberCount = subscribedBy.length;

    dispatch({
      type: 'SUBSCRIBE_SEC',
      payload: { subscribedBy, subscriberCount },
    });

    await subService.subscribeSec(id);
  };
};

export const editDescription = (id, description) => {
  return async (dispatch) => {
    await subService.updateDescription(id, { description });

    dispatch({
      type: 'EDIT_DESCRIPTION',
      payload: description,
    });
  };
};

export default secPageReducer;