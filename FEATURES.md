# NEST Boilerplate Template

## Features

- [x] Keystone6 as Core Framework
- [x] Husky Pre-Commit, Commit
- [x] Auto generated typescript config file for .env
- [x] VS Config
- [x] Helmet for Basic Secure HTTP
- [x] ExpressJS Extension with zod type-checker for query, params and body
- [x] Custom Page and Components
- [x] Graphql-typed Documents

## To upload files outside of AdminUI, you can install this package

[Apollo Upload Client](https://github.com/jaydenseric/apollo-upload-client)

1. Install the client first

```bash
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
```

2. Link the upload client to apollo

```javascript
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: "http://localhost:3000/api/graphql",
  }),
});
```

3. Upload Files

```js
import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      success
    }
  }
`;

function UploadFile() {
  const [mutate] = useMutation(MUTATION);

  return (
    <input
      type="file"
      required
      onChange={({
        target: {
          validity,
          files: [file],
        },
      }) => {
        if (validity.valid)
          mutate({
            variables: {
              file,
            },
          });
      }}
    />
  );
}
```
