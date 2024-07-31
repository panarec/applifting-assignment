import { Comment as DbComment } from '@prisma/client';
import { Comment as GqlComment } from 'src/graphql';

interface SavedComment extends DbComment {
  _count: {
    votes: number;
  };
}

export const parseCommentResponse = (comment: SavedComment): GqlComment => {
  const { id, createdAt, updatedAt, userId } = comment;
  return {
    authorId: userId,
    content: comment.content,
    createdAt: createdAt.toString(),
    id,
    postId: comment.postId,
    updatedAt: updatedAt.toString(),
    votes: comment._count.votes,
  };
};
