# Nodemaker

Proof of concept for n8n node generator.

Functionality:

- Generate main node files: `*.node.ts` and `GenericFunctions.ts`
- Generate extra node files: `*Description.ts`
- Generate node credentials file: `*.credentials.ts`
- Generate an updated `package.json`
- Generate icon candidates: `/icon-candidates`
- Generate docs for node → Coming soon!
- Place generated node files in the n8n repo
- Place generated docs in the n8n docs repo → Coming soon!

## Installation

1. Clone repo.
2. Install dependencies: `npm i`
3. Place a `.env` file with CSE credentials. See below.
4. Ensure nodemaker is alongside the n8n and n8n docs repos.

```bash
.
├── n8n
├── n8n-docs
└── nodemaker
```

## Operation

1. Enter node params in `parameters.js`. (This file is also a functional example.) More info on editing params below.

2. Run an operation.

```
$ npm run [script]
```

| Script    | Action                                                                                        |
| --------- | --------------------------------------------------------------------------------------------- |
| `nodegen` | Generate `*.node.ts` and `GenericFunctions.ts` (simple) and `*Description.ts` files (complex) |
| `packgen` | Generate an updated `package.json` with node and node credential insertions                   |
| `icongen` | Generate a five images as icon candidates in `/output/icon-candidates`                        |
| `empty`   | Clear the `/output` dir                                                                       |
| `place`   | Move node-related files in `/output` to their appropriate locations in the n8n repo           |

### Notes

- All output files are generated in the `/output` dir. Same-name files are overwritten.
- In "simple" node generation, the output node contains its resources in a single file. In "complex" node generation, the output node has its resources in separate `*Description.ts` files.
- When node files are placed in the n8n repo, `output/package.json` will overwrite `/packages/nodes-base/package.json`.
- The `package.json` used for file generation is retrieved at runtime from the official repo.
- No credential file will be generated if `metaParameters.auth` is an empty string.
- Some generated files contain `// TODO:` lines, for the developer to add in custom logic.
- Icon candidate generation uses Google's CSE, which [requires credentials](###icon-generation-credentials).

### Editing params

Node params are divided into:

- `metaParameters` (service-related)
- `mainParameters` (resource-related)

Types for both sets of parameters are defined in `globals.d.ts`. Wrong parameters trigger TypeScript error messages.

#### `metaParameters`

```js
const metaParameters = {
  serviceName: "Some Service", // casing and spacing as in original service
  auth: "OAuth2",
  nodeColor: "#ff6600",
  apiUrl: "http://api.service.com/",
};
```

#### `mainParameters`

`mainParameters` is a big object containing resource names as properties pointing to arrays of operations.

Operations all have the same five fields `name`, `description`, `endpoint`, `requestMethod` and `fields`. `endpoint` can contain a variable between double dollar signs, as in `endpoint: "items/$$articleId$$"`, to allow for the endpoint to be fully autogenerated.

The operation's `fields` property points to an array of objects, which may be:

- **Regular fields**, which contain the properties `name`, `description`, `type`, and `default`, or
- **Group fields**, which contain the properties `name`, `description`, `type: collection` or `type: multiOptions`, `default: {}`, and `options`.

Group fields with `name: "Additional Fields"` should be used for optional fields, i.e. those not needed for the request to succeed.

The `options` property points to an array of objects structured like a regular or group field. Two-level nesting is supported. When using `multiOptions`, `options` should point to an object containing only `name` and `description`.

```js
const mainParameters = {
  Entity1: [
    // first operation for Entity1 (some resource)
    {
      name: "Get",
      description: "Get some entity",
      endpoint: "entity/$$entityId$$",
      requestMethod: "GET",
      fields: [
        {
          name: "Entity ID",
          description: "The ID of entity to be returned",
          type: "string",
          default: "",
        },
        {
          name: "Additional Fields",
          type: "collection",
          default: {},
          options: [
            {
              name: "Keyword",
              description: "The keyword for filtering the results of the query",
              type: "string",
              default: "",
            },
          ],
        },
      ],
    },
    // second operation for Entity1 (same resource as above)
    {
      name: "Put",
      // etc.
    },
  ],
  Entity2: [
    // etc.
  ],
};
```

Field display restrictions are inferred from the object structure, but if you have an additional field display restriction, you can add it with `extraDisplayRestriction: { fieldName: boolean }`.

### Icon generation credentials

Icon candidate generation uses Google's Custom Search Engine, which requires credentials.

Please note that Google's Custom Search Engine is limited to 100 free requests a day.

Create a `.env` file in `/config`, containing:

```bash
GOOGLE_IMAGE_SEARCH_ENGINE_ID="01782..."
GOOGLE_PROJECT_API_KEY="AIzaS..."
```

Contact the author for a Search Engine ID and API Key, or generate your own as described below.

**Configuring Custom Search Engine and generating an engine ID**

1. Access the [Custom Search Engine dashboard](https://cse.google.com/cse/create/new).
2. Enter any site in `Sites to Search`, name the engine and `Create`.
3. Click on `Edit search engine` and then on `Setup`.
4. Under `Basics`, copy the string `Search engine ID` and use it for `GOOGLE_IMAGE_SEARCH_ENGINE_ID` in the `.env` file.
5. Under `Basics`, switch on `Image search`.
6. Under `Basics`, switch on `Search the entire web`.
7. Under `Basics`, in `Sites to search`, delete the site you added in step 2.

**Configuring a Google Cloud Platform project and generating an API key**

1. Access the [Google Cloud Platform dashboard](https://console.developers.google.com).
2. On the top-left corner, click on the project name and then on `New Project`.
3. Name the project and `Create`.
4. Select your new project on the top-left corner.
5. Click on `Enable APIs and Services`, search for `Custom Search API`, select it and enable it.
6. Click on `Create Credentials` on the top-right corner, then on `Credentials` on the left nav, then on the `API key` hyperlink, and finally on `Create`. Use the generated API key for `GOOGLE_PROJECT_API_KEY` in the `.env` file.
