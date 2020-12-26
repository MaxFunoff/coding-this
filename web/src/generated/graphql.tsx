import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: Array<Post>;
  post?: Maybe<Post>;
  comments: Array<Comment>;
  commentsByPost: Array<Comment>;
  commentsByUser: Array<Comment>;
  comment: Array<Comment>;
  checkMe?: Maybe<User>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};


export type QueryCommentsByPostArgs = {
  postId: Scalars['Float'];
};


export type QueryCommentsByUserArgs = {
  userId: Scalars['Float'];
};


export type QueryCommentArgs = {
  id: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  userId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Float'];
  postId: Scalars['Float'];
  userId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  content: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  email: Scalars['String'];
  displayname: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  createComment: Comment;
  updateComment: Comment;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
  description: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  title: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationCreateCommentArgs = {
  content: Scalars['String'];
  postId: Scalars['Float'];
  userId: Scalars['Float'];
};


export type MutationUpdateCommentArgs = {
  content: Scalars['String'];
  userId: Scalars['Float'];
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: EmailDisplaynamePasswordInput;
};


export type MutationLoginArgs = {
  options: EmailPasswordInput;
};


export type MutationChangePasswordArgs = {
  options: NewPasswordOldPasswordInput;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type EmailDisplaynamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  displayname: Scalars['String'];
};

export type EmailPasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type NewPasswordOldPasswordInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'displayname'>
);

export type UserErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type LoginMutationVariables = Exact<{
  options: EmailPasswordInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & UserErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: EmailDisplaynamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & UserErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type CheckMeQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckMeQuery = (
  { __typename?: 'Query' }
  & { checkMe?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'description'>
  )> }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  displayname
}
    `;
export const UserErrorFragmentDoc = gql`
    fragment UserError on FieldError {
  field
  message
}
    `;
export const LoginDocument = gql`
    mutation Login($options: EmailPasswordInput!) {
  login(options: $options) {
    errors {
      ...UserError
    }
    user {
      ...RegularUser
    }
  }
}
    ${UserErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: EmailDisplaynamePasswordInput!) {
  register(options: $options) {
    errors {
      ...UserError
    }
    user {
      ...RegularUser
    }
  }
}
    ${UserErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const CheckMeDocument = gql`
    query checkMe {
  checkMe {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useCheckMeQuery(options: Omit<Urql.UseQueryArgs<CheckMeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CheckMeQuery>({ query: CheckMeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
    description
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};