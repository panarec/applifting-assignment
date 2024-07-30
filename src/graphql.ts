
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCommentInput {
    content: string;
    postId: number;
}

export interface DeleteCommentInput {
    commentId: number;
}

export interface UpdateCommentInput {
    commentId: number;
    content: string;
}

export interface Comment {
    authorId: number;
    content: string;
    createdAt: string;
    id: number;
    postId: number;
    updatedAt: string;
    votes: number;
}

export interface IMutation {
    createComment(createCommentInput?: Nullable<CreateCommentInput>): Nullable<Comment> | Promise<Nullable<Comment>>;
    deleteComment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;
    updateComment(updateCommentInput?: Nullable<UpdateCommentInput>): Nullable<Comment> | Promise<Nullable<Comment>>;
}

export interface IQuery {
    comment(id: number): Comment | Promise<Comment>;
    comments(): Comment[] | Promise<Comment[]>;
}

type Nullable<T> = T | null;
