import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

export type AuthenticatedItem = User;

export type ClientItemAuthenticationWithPasswordFailure = {
  __typename?: "ClientItemAuthenticationWithPasswordFailure";
  message: Scalars["String"]["output"];
};

export type ClientItemAuthenticationWithPasswordResult =
  | ClientItemAuthenticationWithPasswordFailure
  | ClientItemAuthenticationWithPasswordSuccess;

export type ClientItemAuthenticationWithPasswordSuccess = {
  __typename?: "ClientItemAuthenticationWithPasswordSuccess";
  item: User;
  sessionToken: Scalars["String"]["output"];
};

export type CreateInitialUserInput = {
  adminPassword?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<DateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type Group = {
  __typename?: "Group";
  id: Scalars["ID"]["output"];
  members?: Maybe<Array<User>>;
  membersCount?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type GroupMembersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: UserWhereInput;
};

export type GroupMembersCountArgs = {
  where?: UserWhereInput;
};

export type GroupCreateInput = {
  members?: InputMaybe<UserRelateToManyForCreateInput>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupManyRelationFilter = {
  every?: InputMaybe<GroupWhereInput>;
  none?: InputMaybe<GroupWhereInput>;
  some?: InputMaybe<GroupWhereInput>;
};

export type GroupOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type GroupRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<GroupWhereUniqueInput>>;
  create?: InputMaybe<Array<GroupCreateInput>>;
};

export type GroupRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<GroupWhereUniqueInput>>;
  create?: InputMaybe<Array<GroupCreateInput>>;
  disconnect?: InputMaybe<Array<GroupWhereUniqueInput>>;
  set?: InputMaybe<Array<GroupWhereUniqueInput>>;
};

export type GroupUpdateArgs = {
  data: GroupUpdateInput;
  where: GroupWhereUniqueInput;
};

export type GroupUpdateInput = {
  members?: InputMaybe<UserRelateToManyForUpdateInput>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupWhereInput = {
  AND?: InputMaybe<Array<GroupWhereInput>>;
  NOT?: InputMaybe<Array<GroupWhereInput>>;
  OR?: InputMaybe<Array<GroupWhereInput>>;
  id?: InputMaybe<IdFilter>;
  members?: InputMaybe<UserManyRelationFilter>;
  name?: InputMaybe<StringFilter>;
};

export type GroupWhereUniqueInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars["ID"]["input"]>;
  gt?: InputMaybe<Scalars["ID"]["input"]>;
  gte?: InputMaybe<Scalars["ID"]["input"]>;
  in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lt?: InputMaybe<Scalars["ID"]["input"]>;
  lte?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export enum ImageExtension {
  Gif = "gif",
  Jpg = "jpg",
  Png = "png",
  Webp = "webp",
}

export type ImageFieldInput = {
  upload: Scalars["Upload"]["input"];
};

export type ImageFieldOutput = {
  __typename?: "ImageFieldOutput";
  extension: ImageExtension;
  filesize: Scalars["Int"]["output"];
  height: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  url: Scalars["String"]["output"];
  width: Scalars["Int"]["output"];
};

export type KeystoneAdminMeta = {
  __typename?: "KeystoneAdminMeta";
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};

export type KeystoneAdminMetaListArgs = {
  key: Scalars["String"]["input"];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: "KeystoneAdminUIFieldGroupMeta";
  description?: Maybe<Scalars["String"]["output"]>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars["String"]["output"];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: "KeystoneAdminUIFieldMeta";
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars["Int"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  fieldMeta?: Maybe<Scalars["JSON"]["output"]>;
  isFilterable: Scalars["Boolean"]["output"];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars["Boolean"]["output"];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars["String"]["output"];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars["String"]["output"];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars["Int"]["output"];
};

export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
  __typename?: "KeystoneAdminUIFieldMetaCreateView";
  fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
  Edit = "edit",
  Hidden = "hidden",
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
  Create = "create",
  Read = "read",
  Update = "update",
}

export type KeystoneAdminUiFieldMetaItemView = {
  __typename?: "KeystoneAdminUIFieldMetaItemView";
  fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
  fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
  Edit = "edit",
  Hidden = "hidden",
  Read = "read",
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
  Form = "form",
  Sidebar = "sidebar",
}

export type KeystoneAdminUiFieldMetaListView = {
  __typename?: "KeystoneAdminUIFieldMetaListView";
  fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
  Hidden = "hidden",
  Read = "read",
}

export type KeystoneAdminUiListMeta = {
  __typename?: "KeystoneAdminUIListMeta";
  description?: Maybe<Scalars["String"]["output"]>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars["Boolean"]["output"];
  hideDelete: Scalars["Boolean"]["output"];
  initialColumns: Array<Scalars["String"]["output"]>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars["Boolean"]["output"];
  isSingleton: Scalars["Boolean"]["output"];
  itemQueryName: Scalars["String"]["output"];
  key: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
  labelField: Scalars["String"]["output"];
  listQueryName: Scalars["String"]["output"];
  pageSize: Scalars["Int"]["output"];
  path: Scalars["String"]["output"];
  plural: Scalars["String"]["output"];
  singular: Scalars["String"]["output"];
};

export type KeystoneAdminUiSort = {
  __typename?: "KeystoneAdminUISort";
  direction: KeystoneAdminUiSortDirection;
  field: Scalars["String"]["output"];
};

export enum KeystoneAdminUiSortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type KeystoneMeta = {
  __typename?: "KeystoneMeta";
  adminMeta: KeystoneAdminMeta;
};

export type Mutation = {
  __typename?: "Mutation";
  TestMethodMutation?: Maybe<TestMethodMutationOutput>;
  authclient_changePassword?: Maybe<Scalars["Boolean"]["output"]>;
  authclient_login?: Maybe<ClientItemAuthenticationWithPasswordResult>;
  authclient_newAccountPasswordReset?: Maybe<Scalars["Boolean"]["output"]>;
  authclient_register?: Maybe<Scalars["Boolean"]["output"]>;
  authclient_requestPasswordReset?: Maybe<Scalars["Boolean"]["output"]>;
  authclient_resetPassword?: Maybe<Scalars["Boolean"]["output"]>;
  authenticateUserWithPassword?: Maybe<UserAuthenticationWithPasswordResult>;
  createGroup?: Maybe<Group>;
  createGroups?: Maybe<Array<Maybe<Group>>>;
  createInitialUser: UserAuthenticationWithPasswordSuccess;
  createPost?: Maybe<Post>;
  createPostTag?: Maybe<PostTag>;
  createPostTags?: Maybe<Array<Maybe<PostTag>>>;
  createPosts?: Maybe<Array<Maybe<Post>>>;
  createUser?: Maybe<User>;
  createUsers?: Maybe<Array<Maybe<User>>>;
  deleteGroup?: Maybe<Group>;
  deleteGroups?: Maybe<Array<Maybe<Group>>>;
  deletePost?: Maybe<Post>;
  deletePostTag?: Maybe<PostTag>;
  deletePostTags?: Maybe<Array<Maybe<PostTag>>>;
  deletePosts?: Maybe<Array<Maybe<Post>>>;
  deleteUser?: Maybe<User>;
  deleteUsers?: Maybe<Array<Maybe<User>>>;
  endSession: Scalars["Boolean"]["output"];
  updateGroup?: Maybe<Group>;
  updateGroups?: Maybe<Array<Maybe<Group>>>;
  updatePost?: Maybe<Post>;
  updatePostTag?: Maybe<PostTag>;
  updatePostTags?: Maybe<Array<Maybe<PostTag>>>;
  updatePosts?: Maybe<Array<Maybe<Post>>>;
  updateUser?: Maybe<User>;
  updateUsers?: Maybe<Array<Maybe<User>>>;
};

export type MutationAuthclient_ChangePasswordArgs = {
  newPassword: Scalars["String"]["input"];
  oldPassword: Scalars["String"]["input"];
};

export type MutationAuthclient_LoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationAuthclient_NewAccountPasswordResetArgs = {
  email: Scalars["String"]["input"];
};

export type MutationAuthclient_RegisterArgs = {
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  password: Scalars["String"]["input"];
};

export type MutationAuthclient_RequestPasswordResetArgs = {
  email: Scalars["String"]["input"];
};

export type MutationAuthclient_ResetPasswordArgs = {
  password: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationAuthenticateUserWithPasswordArgs = {
  adminPassword: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
};

export type MutationCreateGroupArgs = {
  data: GroupCreateInput;
};

export type MutationCreateGroupsArgs = {
  data: Array<GroupCreateInput>;
};

export type MutationCreateInitialUserArgs = {
  data: CreateInitialUserInput;
};

export type MutationCreatePostArgs = {
  data: PostCreateInput;
};

export type MutationCreatePostTagArgs = {
  data: PostTagCreateInput;
};

export type MutationCreatePostTagsArgs = {
  data: Array<PostTagCreateInput>;
};

export type MutationCreatePostsArgs = {
  data: Array<PostCreateInput>;
};

export type MutationCreateUserArgs = {
  data: UserCreateInput;
};

export type MutationCreateUsersArgs = {
  data: Array<UserCreateInput>;
};

export type MutationDeleteGroupArgs = {
  where: GroupWhereUniqueInput;
};

export type MutationDeleteGroupsArgs = {
  where: Array<GroupWhereUniqueInput>;
};

export type MutationDeletePostArgs = {
  where: PostWhereUniqueInput;
};

export type MutationDeletePostTagArgs = {
  where: PostTagWhereUniqueInput;
};

export type MutationDeletePostTagsArgs = {
  where: Array<PostTagWhereUniqueInput>;
};

export type MutationDeletePostsArgs = {
  where: Array<PostWhereUniqueInput>;
};

export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};

export type MutationDeleteUsersArgs = {
  where: Array<UserWhereUniqueInput>;
};

export type MutationUpdateGroupArgs = {
  data: GroupUpdateInput;
  where: GroupWhereUniqueInput;
};

export type MutationUpdateGroupsArgs = {
  data: Array<GroupUpdateArgs>;
};

export type MutationUpdatePostArgs = {
  data: PostUpdateInput;
  where: PostWhereUniqueInput;
};

export type MutationUpdatePostTagArgs = {
  data: PostTagUpdateInput;
  where: PostTagWhereUniqueInput;
};

export type MutationUpdatePostTagsArgs = {
  data: Array<PostTagUpdateArgs>;
};

export type MutationUpdatePostsArgs = {
  data: Array<PostUpdateArgs>;
};

export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type MutationUpdateUsersArgs = {
  data: Array<UserUpdateArgs>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type PasswordFilter = {
  isSet: Scalars["Boolean"]["input"];
};

export type PasswordState = {
  __typename?: "PasswordState";
  isSet: Scalars["Boolean"]["output"];
};

export type Post = {
  __typename?: "Post";
  author?: Maybe<User>;
  content?: Maybe<Scalars["String"]["output"]>;
  coverImage?: Maybe<ImageFieldOutput>;
  id: Scalars["ID"]["output"];
  tags?: Maybe<Array<PostTag>>;
  tagsCount?: Maybe<Scalars["Int"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
};

export type PostTagsArgs = {
  cursor?: InputMaybe<PostTagWhereUniqueInput>;
  orderBy?: Array<PostTagOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: PostTagWhereInput;
};

export type PostTagsCountArgs = {
  where?: PostTagWhereInput;
};

export type PostCreateInput = {
  author?: InputMaybe<UserRelateToOneForCreateInput>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  coverImage?: InputMaybe<ImageFieldInput>;
  tags?: InputMaybe<PostTagRelateToManyForCreateInput>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PostManyRelationFilter = {
  every?: InputMaybe<PostWhereInput>;
  none?: InputMaybe<PostWhereInput>;
  some?: InputMaybe<PostWhereInput>;
};

export type PostOrderByInput = {
  content?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  title?: InputMaybe<OrderDirection>;
};

export type PostRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PostWhereUniqueInput>>;
  create?: InputMaybe<Array<PostCreateInput>>;
};

export type PostRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PostWhereUniqueInput>>;
  create?: InputMaybe<Array<PostCreateInput>>;
  disconnect?: InputMaybe<Array<PostWhereUniqueInput>>;
  set?: InputMaybe<Array<PostWhereUniqueInput>>;
};

export type PostTag = {
  __typename?: "PostTag";
  id: Scalars["ID"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  posts?: Maybe<Array<Post>>;
  postsCount?: Maybe<Scalars["Int"]["output"]>;
};

export type PostTagPostsArgs = {
  cursor?: InputMaybe<PostWhereUniqueInput>;
  orderBy?: Array<PostOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: PostWhereInput;
};

export type PostTagPostsCountArgs = {
  where?: PostWhereInput;
};

export type PostTagCreateInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  posts?: InputMaybe<PostRelateToManyForCreateInput>;
};

export type PostTagManyRelationFilter = {
  every?: InputMaybe<PostTagWhereInput>;
  none?: InputMaybe<PostTagWhereInput>;
  some?: InputMaybe<PostTagWhereInput>;
};

export type PostTagOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type PostTagRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PostTagWhereUniqueInput>>;
  create?: InputMaybe<Array<PostTagCreateInput>>;
};

export type PostTagRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PostTagWhereUniqueInput>>;
  create?: InputMaybe<Array<PostTagCreateInput>>;
  disconnect?: InputMaybe<Array<PostTagWhereUniqueInput>>;
  set?: InputMaybe<Array<PostTagWhereUniqueInput>>;
};

export type PostTagUpdateArgs = {
  data: PostTagUpdateInput;
  where: PostTagWhereUniqueInput;
};

export type PostTagUpdateInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  posts?: InputMaybe<PostRelateToManyForUpdateInput>;
};

export type PostTagWhereInput = {
  AND?: InputMaybe<Array<PostTagWhereInput>>;
  NOT?: InputMaybe<Array<PostTagWhereInput>>;
  OR?: InputMaybe<Array<PostTagWhereInput>>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  posts?: InputMaybe<PostManyRelationFilter>;
};

export type PostTagWhereUniqueInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type PostUpdateArgs = {
  data: PostUpdateInput;
  where: PostWhereUniqueInput;
};

export type PostUpdateInput = {
  author?: InputMaybe<UserRelateToOneForUpdateInput>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  coverImage?: InputMaybe<ImageFieldInput>;
  tags?: InputMaybe<PostTagRelateToManyForUpdateInput>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PostWhereInput = {
  AND?: InputMaybe<Array<PostWhereInput>>;
  NOT?: InputMaybe<Array<PostWhereInput>>;
  OR?: InputMaybe<Array<PostWhereInput>>;
  author?: InputMaybe<UserWhereInput>;
  content?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  tags?: InputMaybe<PostTagManyRelationFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PostWhereUniqueInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  TestMethod?: Maybe<TestMethodOutput>;
  authenticatedItem?: Maybe<AuthenticatedItem>;
  group?: Maybe<Group>;
  groups?: Maybe<Array<Group>>;
  groupsCount?: Maybe<Scalars["Int"]["output"]>;
  keystone: KeystoneMeta;
  post?: Maybe<Post>;
  postTag?: Maybe<PostTag>;
  postTags?: Maybe<Array<PostTag>>;
  postTagsCount?: Maybe<Scalars["Int"]["output"]>;
  posts?: Maybe<Array<Post>>;
  postsCount?: Maybe<Scalars["Int"]["output"]>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars["Int"]["output"]>;
};

export type QueryTestMethodArgs = {
  input: TestMethodInput;
};

export type QueryGroupArgs = {
  where: GroupWhereUniqueInput;
};

export type QueryGroupsArgs = {
  cursor?: InputMaybe<GroupWhereUniqueInput>;
  orderBy?: Array<GroupOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: GroupWhereInput;
};

export type QueryGroupsCountArgs = {
  where?: GroupWhereInput;
};

export type QueryPostArgs = {
  where: PostWhereUniqueInput;
};

export type QueryPostTagArgs = {
  where: PostTagWhereUniqueInput;
};

export type QueryPostTagsArgs = {
  cursor?: InputMaybe<PostTagWhereUniqueInput>;
  orderBy?: Array<PostTagOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: PostTagWhereInput;
};

export type QueryPostTagsCountArgs = {
  where?: PostTagWhereInput;
};

export type QueryPostsArgs = {
  cursor?: InputMaybe<PostWhereUniqueInput>;
  orderBy?: Array<PostOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: PostWhereInput;
};

export type QueryPostsCountArgs = {
  where?: PostWhereInput;
};

export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};

export type QueryUsersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: UserWhereInput;
};

export type QueryUsersCountArgs = {
  where?: UserWhereInput;
};

export enum QueryMode {
  Default = "default",
  Insensitive = "insensitive",
}

export type StringFilter = {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type TestMethodInput = {
  input?: InputMaybe<Scalars["String"]["input"]>;
  x?: InputMaybe<Scalars["Float"]["input"]>;
};

export type TestMethodMutationOutput = {
  __typename?: "TestMethodMutationOutput";
  details: TestMethodMutationOutputDetails;
  post: Scalars["String"]["output"];
};

export type TestMethodMutationOutputDetails = {
  __typename?: "TestMethodMutationOutputDetails";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type TestMethodOutput = {
  __typename?: "TestMethodOutput";
  args?: Maybe<TestMethodOutput_Args>;
  output?: Maybe<Scalars["String"]["output"]>;
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type TestMethodOutput_Args = {
  __typename?: "TestMethodOutput_Args";
  input: Scalars["String"]["output"];
  x: Scalars["Float"]["output"];
};

export type User = {
  __typename?: "User";
  adminPassword?: Maybe<PasswordState>;
  avatar?: Maybe<ImageFieldOutput>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  groups?: Maybe<Array<Group>>;
  groupsCount?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["ID"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  posts?: Maybe<Array<Post>>;
  postsCount?: Maybe<Scalars["Int"]["output"]>;
  role?: Maybe<UserRoleType>;
};

export type UserGroupsArgs = {
  cursor?: InputMaybe<GroupWhereUniqueInput>;
  orderBy?: Array<GroupOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: GroupWhereInput;
};

export type UserGroupsCountArgs = {
  where?: GroupWhereInput;
};

export type UserPostsArgs = {
  cursor?: InputMaybe<PostWhereUniqueInput>;
  orderBy?: Array<PostOrderByInput>;
  skip?: Scalars["Int"]["input"];
  take?: InputMaybe<Scalars["Int"]["input"]>;
  where?: PostWhereInput;
};

export type UserPostsCountArgs = {
  where?: PostWhereInput;
};

export type UserAuthenticationWithPasswordFailure = {
  __typename?: "UserAuthenticationWithPasswordFailure";
  message: Scalars["String"]["output"];
};

export type UserAuthenticationWithPasswordResult =
  | UserAuthenticationWithPasswordFailure
  | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
  __typename?: "UserAuthenticationWithPasswordSuccess";
  item: User;
  sessionToken: Scalars["String"]["output"];
};

export type UserCreateInput = {
  adminPassword?: InputMaybe<Scalars["String"]["input"]>;
  avatar?: InputMaybe<ImageFieldInput>;
  createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  groups?: InputMaybe<GroupRelateToManyForCreateInput>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  posts?: InputMaybe<PostRelateToManyForCreateInput>;
  role?: InputMaybe<UserRoleType>;
};

export type UserLocalAuthWhereInput = {
  AND?: InputMaybe<Array<UserLocalAuthWhereInput>>;
  NOT?: InputMaybe<Array<UserLocalAuthWhereInput>>;
  OR?: InputMaybe<Array<UserLocalAuthWhereInput>>;
  id?: InputMaybe<IdFilter>;
};

export type UserManyRelationFilter = {
  every?: InputMaybe<UserWhereInput>;
  none?: InputMaybe<UserWhereInput>;
  some?: InputMaybe<UserWhereInput>;
};

export type UserOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  email?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  lastName?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  role?: InputMaybe<OrderDirection>;
};

export type UserRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<UserWhereUniqueInput>>;
  create?: InputMaybe<Array<UserCreateInput>>;
};

export type UserRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<UserWhereUniqueInput>>;
  create?: InputMaybe<Array<UserCreateInput>>;
  disconnect?: InputMaybe<Array<UserWhereUniqueInput>>;
  set?: InputMaybe<Array<UserWhereUniqueInput>>;
};

export type UserRelateToOneForCreateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
};

export type UserRelateToOneForUpdateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
  disconnect?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export enum UserRoleType {
  Admin = "admin",
  Dev = "dev",
  User = "user",
}

export type UserRoleTypeNullableFilter = {
  equals?: InputMaybe<UserRoleType>;
  in?: InputMaybe<Array<UserRoleType>>;
  not?: InputMaybe<UserRoleTypeNullableFilter>;
  notIn?: InputMaybe<Array<UserRoleType>>;
};

export type UserUpdateArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
  adminPassword?: InputMaybe<Scalars["String"]["input"]>;
  avatar?: InputMaybe<ImageFieldInput>;
  createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  groups?: InputMaybe<GroupRelateToManyForUpdateInput>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  posts?: InputMaybe<PostRelateToManyForUpdateInput>;
  role?: InputMaybe<UserRoleType>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  adminPassword?: InputMaybe<PasswordFilter>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  email?: InputMaybe<StringFilter>;
  groups?: InputMaybe<GroupManyRelationFilter>;
  id?: InputMaybe<IdFilter>;
  lastName?: InputMaybe<StringFilter>;
  localAuth?: InputMaybe<UserLocalAuthWhereInput>;
  name?: InputMaybe<StringFilter>;
  posts?: InputMaybe<PostManyRelationFilter>;
  role?: InputMaybe<UserRoleTypeNullableFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  authenticateUserWithPassword?:
    | { __typename: "UserAuthenticationWithPasswordFailure" }
    | {
        __typename: "UserAuthenticationWithPasswordSuccess";
        sessionToken: string;
      }
    | null;
};

export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "authenticateUserWithPassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "adminPassword" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "password" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: {
                      kind: "Name",
                      value: "UserAuthenticationWithPasswordSuccess",
                    },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sessionToken" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
