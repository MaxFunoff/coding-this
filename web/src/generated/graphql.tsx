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
  comments?: Maybe<Array<UserComment>>;
  commentsByPost?: Maybe<Array<UserComment>>;
  commentsByUser: Array<UserComment>;
  comment: UserComment;
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  checkMe?: Maybe<User>;
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


export type QueryPostsArgs = {
  cursorlike?: Maybe<Scalars['Int']>;
  orderby?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  cursor?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};

export type UserComment = {
  __typename?: 'UserComment';
  id: Scalars['Float'];
  content: Scalars['String'];
  creatorId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  title: Scalars['String'];
  description: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
  creatorId: Scalars['Float'];
  creator: User;
  likes: Scalars['Float'];
  voteStatus: Scalars['Int'];
  starStatus: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  descriptionSnippet: DescriptionSnippet;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  email: Scalars['String'];
  displayname: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type DescriptionSnippet = {
  __typename?: 'descriptionSnippet';
  snippet: Scalars['String'];
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: UserComment;
  updateComment: UserComment;
  createPost: PostResponse;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  upvote: Scalars['Boolean'];
  star: Scalars['Boolean'];
  changePassword: UserResponse;
  changePasswordAsUser: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreateCommentArgs = {
  content: Scalars['String'];
  postId: Scalars['Float'];
};


export type MutationUpdateCommentArgs = {
  content: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationUpdatePostArgs = {
  title: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationUpvoteArgs = {
  postId: Scalars['Int'];
};


export type MutationStarArgs = {
  postId: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangePasswordAsUserArgs = {
  options: NewPasswordOldPasswordInput;
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

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  description: Scalars['String'];
  title: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type NewPasswordOldPasswordInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
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

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'createdAt' | 'updatedAt' | 'likes' | 'voteStatus' | 'starStatus' | 'tags'>
  & { descriptionSnippet: (
    { __typename?: 'descriptionSnippet' }
    & Pick<DescriptionSnippet, 'snippet' | 'hasMore'>
  ), creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'displayname'>
  ) }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'displayname'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'description' | 'creatorId' | 'likes' | 'createdAt' | 'updatedAt'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: EmailPasswordInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
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
    & RegularUserResponseFragment
  ) }
);

export type StarMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type StarMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'star'>
);

export type UpvoteMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type UpvoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'upvote'>
);

export type CheckMeQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckMeQuery = (
  { __typename?: 'Query' }
  & { checkMe?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'createdAt' | 'updatedAt' | 'likes' | 'voteStatus' | 'starStatus' | 'tags' | 'description'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'displayname'>
    ) }
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['Int']>;
  cursorlike?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['String']>;
  orderby?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type ReadMoreQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ReadMoreQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'description'>
  )> }
);

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  title
  createdAt
  updatedAt
  likes
  voteStatus
  starStatus
  tags
  descriptionSnippet {
    snippet
    hasMore
  }
  creator {
    id
    displayname
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  displayname
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $password: String!) {
  changePassword(token: $token, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    post {
      id
      title
      description
      creatorId
      likes
      createdAt
      updatedAt
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularErrorFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($options: EmailPasswordInput!) {
  login(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

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
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const StarDocument = gql`
    mutation Star($postId: Int!) {
  star(postId: $postId)
}
    `;

export function useStarMutation() {
  return Urql.useMutation<StarMutation, StarMutationVariables>(StarDocument);
};
export const UpvoteDocument = gql`
    mutation Upvote($postId: Int!) {
  upvote(postId: $postId)
}
    `;

export function useUpvoteMutation() {
  return Urql.useMutation<UpvoteMutation, UpvoteMutationVariables>(UpvoteDocument);
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
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    title
    createdAt
    updatedAt
    likes
    voteStatus
    starStatus
    tags
    description
    creator {
      id
      displayname
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: Int, $cursorlike: Int, $page: String, $orderby: String) {
  posts(
    cursor: $cursor
    limit: $limit
    page: $page
    orderby: $orderby
    cursorlike: $cursorlike
  ) {
    posts {
      ...PostSnippet
    }
    hasMore
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ReadMoreDocument = gql`
    query ReadMore($id: Int!) {
  post(id: $id) {
    description
  }
}
    `;

export function useReadMoreQuery(options: Omit<Urql.UseQueryArgs<ReadMoreQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ReadMoreQuery>({ query: ReadMoreDocument, ...options });
};