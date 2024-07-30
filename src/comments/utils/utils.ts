import { Comment as DbComment } from '@prisma/client';
import { Comment as GqlComment } from 'src/graphql';

export const parseCommentResponse = (comment: DbComment): GqlComment => {
  const { id, createdAt, updatedAt, votes, userId } = comment;
  return {
    authorId: userId,
    content: comment.content,
    createdAt: createdAt.toString(),
    id,
    postId: comment.postId,
    updatedAt: updatedAt.toString(),
    votes,
  };
};
