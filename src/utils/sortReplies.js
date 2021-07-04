const sortReplies = (sortBy, replies, acceptedReply) => {
  if (sortBy === 'OLDEST') {
    return [...replies].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortBy === 'NEWEST') {
    return [...replies].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else {
    const accepted = replies.find((a) => a.id === acceptedReply);
    const restSorted = replies
      .filter((a) => a.id !== acceptedReply)
      .sort((a, b) => b.points - a.points);

    if (accepted) {
      return [accepted, ...restSorted];
    } else {
      return restSorted;
    }
  }
};

export default sortReplies;
