# Protobi JavaScript API Documentation

> **Auto-generated from OpenAPI specification**
> Last updated: 2025-12-14

This documentation covers the JavaScript/Node.js library for the Protobi API.

## Installation

```bash
npm install protobi-javascript-api
```

## Setup

```javascript
const ProtobiAPI = require('protobi-javascript-api');

const api = new ProtobiAPI(
  'https://app.protobi.com',  // Base URL
  'YOUR_API_KEY'               // API key from https://app.protobi.com/account
);
```

## Promise and Callback Support

All methods support both callback and Promise interfaces:

```javascript
// Callback style
api.methodName(param1, param2, function(err, result) {
  if (err) return console.error(err);
  console.log(result);
});

// Promise style
try {
  const result = await api.methodName(param1, param2);
  console.log(result);
} catch (err) {
  console.error(err);
}
```

## Methods by Category

- [Connection](#connection)
- [Connections](#connections)
- [Data Tables](#data-tables)
- [Dataset Administration](#dataset-administration)
- [Datasets](#datasets)
- [Elements](#elements)
- [Log](#log)
- [Logout](#logout)
- [Questions](#questions)
- [Tasks](#tasks)

---

## Connection

### `api_v3_post_connection_new(callback)`

**POST /api/v3/connection**

Handler: api_v3.post_connection_new

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_post_connection_new(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_post_connection_new(
);
console.log('Success:', result);
```

---

### `api_v3_put_connection(connectionId, callback)`

**PUT /api/v3/connection/:connectionId**

Handler: api_v3.put_connection

**Parameters:**

- `connectionId` (string) - Connection Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_put_connection(
  'connectionId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_put_connection(
  'connectionId'
);
console.log('Success:', result);
```

---

### `api_v3_delete_connection(connectionId, callback)`

**DELETE /api/v3/connection/:connectionId**

Handler: api_v3.delete_connection

**Parameters:**

- `connectionId` (string) - Connection Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_delete_connection(
  'connectionId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_delete_connection(
  'connectionId'
);
console.log('Success:', result);
```

---

## Connections

### `auth_ensure_role__admin_(callback)`

**POST /api/v3/connections/new**

Handler: auth.ensure_role('admin'

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
);
console.log('Success:', result);
```

---

## Data Tables

### `api_v3_get_data_raw(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/data/raw**

Handler: api_v3.get_data_raw

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_raw(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_raw(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_data_csv(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/data/csv**

Handler: api_v3.get_data_csv

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_csv(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_csv(
  'datasetId'
);
console.log('Success:', result);
```

---

### `spss_get_dataset_syntax_raw(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/data/syntax**

Handler: spss.get_dataset_syntax_raw

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.spss_get_dataset_syntax_raw(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.spss_get_dataset_syntax_raw(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_data_direct(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/raw**

Handler: api_v3.get_data_direct

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_direct(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_direct(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_data_csv(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/csv**

Handler: api_v3.get_data_csv

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_csv(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_csv(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `spss_get_dataset_admin_sav(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/sav**

Handler: spss.get_dataset_admin_sav

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.spss_get_dataset_admin_sav(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.spss_get_dataset_admin_sav(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `spss_get_dataset_syntax_raw(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/syntax**

Handler: spss.get_dataset_syntax_raw

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.spss_get_dataset_syntax_raw(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.spss_get_dataset_syntax_raw(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_data_xlsx(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/xlsx**

Handler: api_v3.get_data_xlsx

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_xlsx(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_xlsx(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_data_layout(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/layout**

Handler: api_v3.get_data_layout

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_data_layout(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_data_layout(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_run_data_process(datasetId, key, callback)`

**PUT /api/v3/dataset/:datasetId/data/:key/run**

Handler: api_v3.run_data_process

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_run_data_process(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_run_data_process(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_put_datafile(datasetId, key, callback)`

**PUT /api/v3/dataset/:datasetId/data/:key**

Handler: api_v3.put_datafile

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_put_datafile(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_put_datafile(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_patch_datafile(datasetId, key, callback)`

**PATCH /api/v3/dataset/:datasetId/data/:key**

Handler: api_v3.patch_datafile

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_patch_datafile(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_patch_datafile(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_delete_datafile(datasetId, key, callback)`

**DELETE /api/v3/dataset/:datasetId/data/:key**

Handler: api_v3.delete_datafile

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_delete_datafile(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_delete_datafile(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_datafile(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key**

Handler: api_v3.get_datafile

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_datafile(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_datafile(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/data/:key/primary**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset_table_properties(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/properties**

Handler: api_v3.get_dataset_table_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset_table_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset_table_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_put_dataset_table_properties(datasetId, key, callback)`

**PUT /api/v3/dataset/:datasetId/data/:key/properties**

Handler: api_v3.put_dataset_table_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_put_dataset_table_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_put_dataset_table_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `exports_get_powerpoint_json(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/data/:key/powerpoint/json**

Handler: exports.get_powerpoint_json

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.exports_get_powerpoint_json(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.exports_get_powerpoint_json(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

## Dataset Administration

### `api_v3_get_dataset_admin_ai_file_statuses(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/admin/ai/file-statuses**

Handler: api_v3.get_dataset_admin_ai_file_statuses

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset_admin_ai_file_statuses(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset_admin_ai_file_statuses(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_post_dataset_admin_properties(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/admin/data/:key/properties**

Handler: api_v3.post_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_post_dataset_admin_properties(datasetId, key, callback)`

**PUT /api/v3/dataset/:datasetId/admin/data/:key/properties**

Handler: api_v3.post_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset_admin_properties(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/admin/data/:key/properties**

Handler: api_v3.get_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_post_dataset_admin_properties(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx**

Handler: api_v3.post_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_post_dataset_admin_properties(datasetId, key, callback)`

**PUT /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx**

Handler: api_v3.post_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_post_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset_admin_properties(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx**

Handler: api_v3.get_dataset_admin_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset_admin_properties(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset_admin_properties(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `medlive_update_sermo(datasetId, callback)`

**refreshes data only, for existing project (GET)**

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.medlive_update_sermo(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.medlive_update_sermo(
  'datasetId'
);
console.log('Success:', result);
```

---

### `medlive_update_sermo(datasetId, callback)`

**refreshes data only, for existing project (POST)**

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.medlive_update_sermo(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.medlive_update_sermo(
  'datasetId'
);
console.log('Success:', result);
```

---

## Datasets

### `api_v3_clone_dataset(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/clone**

Handler: api_v3.clone_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_clone_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_clone_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `account_post_question(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/questions**

Handler: account.post_question

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.account_post_question(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.account_post_question(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(callback)`

**GET /api/v3/dataset**

Handler: auth.ensure_role('admin'

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(callback)`

**POST /api/v3/dataset**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset(datasetId, callback)`

**GET /api/v3/dataset/:datasetId**

Handler: api_v3.get_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_put_dataset(datasetId, callback)`

**PUT /api/v3/dataset/:datasetId**

Handler: api_v3.put_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_put_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_put_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_delete_dataset(datasetId, callback)`

**DELETE /api/v3/dataset/:datasetId**

Handler: api_v3.delete_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_delete_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_delete_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset(datasetId, callback)`

**GET /api/v3/datasets/:datasetId**

Handler: api_v3.get_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_project_properties(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/properties**

Handler: api_v3.get_project_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_project_properties(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_project_properties(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_put_project_properties(datasetId, callback)`

**PUT /api/v3/dataset/:datasetId/properties**

Handler: api_v3.put_project_properties

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_put_project_properties(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_put_project_properties(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_elements(datasetId, callback)`

**GET /api/v3/datasets/:datasetId/element**

Handler: api_v3.get_elements

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_elements(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_elements(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**POST /api/v3/datasets/:datasetId/element**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_element_formats(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/formats**

Handler: api_v3.get_element_formats

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_element_formats(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_element_formats(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_element_titles(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/titles**

Handler: api_v3.get_element_titles

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_element_titles(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_element_titles(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/layout/:key**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_get_dataset_tables(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/tables**

Handler: api_v3.get_dataset_tables

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_dataset_tables(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_dataset_tables(
  'datasetId'
);
console.log('Success:', result);
```

---

### `surveyengine_get_info(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/surveyengine/info**

Handler: surveyengine.get_info

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.surveyengine_get_info(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.surveyengine_get_info(
  'datasetId'
);
console.log('Success:', result);
```

---

### `surveyengine_get_data(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/surveyengine/data/**

Handler: surveyengine.get_data

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.surveyengine_get_data(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.surveyengine_get_data(
  'datasetId'
);
console.log('Success:', result);
```

---

### `surveyengine_refresh_data(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/surveyengine/data/refresh**

Handler: surveyengine.refresh_data

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.surveyengine_refresh_data(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.surveyengine_refresh_data(
  'datasetId'
);
console.log('Success:', result);
```

---

### `surveyengine_reset_elements(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/surveyengine/elements/reset**

Handler: surveyengine.reset_elements

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.surveyengine_reset_elements(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.surveyengine_reset_elements(
  'datasetId'
);
console.log('Success:', result);
```

---

### `surveyengine_post_details(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/surveyengine/details**

Handler: surveyengine.post_details

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.surveyengine_post_details(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.surveyengine_post_details(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_tasks(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/tasks**

Handler: api_v3.get_tasks

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_tasks(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_tasks(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_metadata(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/metadata**

Handler: api_v3.get_metadata

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_metadata(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_metadata(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/permission/**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/permission**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, userId, role, callback)`

**PUT /api/v3/dataset/:datasetId/user/:userId/permission/:role**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `userId` (string) - User Id
- `role` (string) - Role
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  'userId',
  'role',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId',
  'userId',
  'role'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, userId, role, callback)`

**POST /api/v3/dataset/:datasetId/user/:userId/permission/:role**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `userId` (string) - User Id
- `role` (string) - Role
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  'userId',
  'role',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId',
  'userId',
  'role'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, userId, callback)`

**DELETE /api/v3/dataset/:datasetId/user/:userId/permission**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `userId` (string) - User Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  'userId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId',
  'userId'
);
console.log('Success:', result);
```

---

### `api_v3_pin_user_to_dataset(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/pin**

Handler: api_v3.pin_user_to_dataset

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_pin_user_to_dataset(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_pin_user_to_dataset(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/translate**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/translate**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/load**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/load**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_askQuestion(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/help**

Handler: aiChat.askQuestion

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_askQuestion(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_askQuestion(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_askQuestion(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/help**

Handler: aiChat.askQuestion

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_askQuestion(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_askQuestion(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/unload**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/unload**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_getHistory(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/history**

Handler: aiChat.getHistory

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_getHistory(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_getHistory(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_getFiles(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/files**

Handler: aiChat.getFiles

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_getFiles(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_getFiles(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/vectorstore/files**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/cleanup**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_resetThread(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/thread/reset**

Handler: aiChat.resetThread

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_resetThread(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_resetThread(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_initialize(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/start**

Handler: aiChat.initialize

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_initialize(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_initialize(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiChat_deleteThread(datasetId, threadId, callback)`

**DELETE /api/v3/dataset/:datasetId/ai/threads/:threadId**

Handler: aiChat.deleteThread

**Parameters:**

- `datasetId` (string) - Dataset Id
- `threadId` (string) - Thread Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiChat_deleteThread(
  'datasetId',
  'threadId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiChat_deleteThread(
  'datasetId',
  'threadId'
);
console.log('Success:', result);
```

---

### `secureUpload_single__file_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/ephemeral**

Handler: secureUpload.single('file'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.secureUpload_single__file_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.secureUpload_single__file_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `secureUpload_single__file_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/persistent**

Handler: secureUpload.single('file'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.secureUpload_single__file_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.secureUpload_single__file_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiAutocode_getSurveyText(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/survey/text**

Handler: aiAutocode.getSurveyText

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiAutocode_getSurveyText(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiAutocode_getSurveyText(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiAutocode_getSurveyText(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/ai/survey/text**

Handler: aiAutocode.getSurveyText

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiAutocode_getSurveyText(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiAutocode_getSurveyText(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiAutocode_getSurveySections(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/survey/sections**

Handler: aiAutocode.getSurveySections

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiAutocode_getSurveySections(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiAutocode_getSurveySections(
  'datasetId'
);
console.log('Success:', result);
```

---

### `aiAutocode_getSectionKeys(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/ai/survey/sections_keys**

Handler: aiAutocode.getSectionKeys

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.aiAutocode_getSectionKeys(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.aiAutocode_getSectionKeys(
  'datasetId'
);
console.log('Success:', result);
```

---

### `sentiment_sentiment(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/sentiment**

Handler: sentiment.sentiment

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.sentiment_sentiment(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.sentiment_sentiment(
  'datasetId'
);
console.log('Success:', result);
```

---

### `sentiment_autocode(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/autocode**

Handler: sentiment.autocode

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.sentiment_autocode(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.sentiment_autocode(
  'datasetId'
);
console.log('Success:', result);
```

---

### `sentiment_autocode(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/autocode**

Handler: sentiment.autocode

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.sentiment_autocode(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.sentiment_autocode(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/todo**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, todoId, callback)`

**GET /api/v3/dataset/:datasetId/todo/:todoId**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `todoId` (string) - Todo Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  'todoId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId',
  'todoId'
);
console.log('Success:', result);
```

---

### `api_v3_delete_todo(datasetId, todoId, callback)`

**DELETE /api/v3/dataset/:datasetId/todo/:todoId**

Handler: api_v3.delete_todo

**Parameters:**

- `datasetId` (string) - Dataset Id
- `todoId` (string) - Todo Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_delete_todo(
  'datasetId',
  'todoId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_delete_todo(
  'datasetId',
  'todoId'
);
console.log('Success:', result);
```

---

### `api_v3_get_gists(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/gist**

Handler: api_v3.get_gists

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_gists(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_gists(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**PUT /api/v3/dataset/:datasetId/gist**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_gist(datasetId, gistId, callback)`

**GET /api/v3/dataset/:datasetId/gist/:gistId**

Handler: api_v3.get_gist

**Parameters:**

- `datasetId` (string) - Dataset Id
- `gistId` (string) - Gist Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_gist(
  'datasetId',
  'gistId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_gist(
  'datasetId',
  'gistId'
);
console.log('Success:', result);
```

---

### `api_v3_delete_gist(datasetId, gistId, callback)`

**DELETE /api/v3/dataset/:datasetId/gist/:gistId**

Handler: api_v3.delete_gist

**Parameters:**

- `datasetId` (string) - Dataset Id
- `gistId` (string) - Gist Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_delete_gist(
  'datasetId',
  'gistId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_delete_gist(
  'datasetId',
  'gistId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, gistId, callback)`

**PUT /api/v3/dataset/:datasetId/gist/:gistId**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `gistId` (string) - Gist Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  'gistId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId',
  'gistId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/experimental/googlesheet**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `exports_get_powerpoint_json(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/template/:key/shapes**

Handler: exports.get_powerpoint_json

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.exports_get_powerpoint_json(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.exports_get_powerpoint_json(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `globalstrategygroup_get_recodes(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/gsg/recodes**

Handler: globalstrategygroup.get_recodes

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.globalstrategygroup_get_recodes(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.globalstrategygroup_get_recodes(
  'datasetId'
);
console.log('Success:', result);
```

---

### `notes_get_dataset_notes(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/notes**

Handler: notes.get_dataset_notes

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.notes_get_dataset_notes(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.notes_get_dataset_notes(
  'datasetId'
);
console.log('Success:', result);
```

---

### `notes_put_note(datasetId, noteId, callback)`

**PUT /api/v3/dataset/:datasetId/note/:noteId**

Handler: notes.put_note

**Parameters:**

- `datasetId` (string) - Dataset Id
- `noteId` (string) - Note Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.notes_put_note(
  'datasetId',
  'noteId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.notes_put_note(
  'datasetId',
  'noteId'
);
console.log('Success:', result);
```

---

### `notes_delete_note(datasetId, noteId, callback)`

**DELETE /api/v3/dataset/:datasetId/note/:noteId**

Handler: notes.delete_note

**Parameters:**

- `datasetId` (string) - Dataset Id
- `noteId` (string) - Note Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.notes_delete_note(
  'datasetId',
  'noteId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.notes_delete_note(
  'datasetId',
  'noteId'
);
console.log('Success:', result);
```

---

## Elements

### `api_v3_get_elements(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/element**

Handler: api_v3.get_elements

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_elements(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_elements(
  'datasetId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, callback)`

**POST /api/v3/dataset/:datasetId/element**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_element_verbatim_csv(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/element/:key/verbatim**

Handler: api_v3.get_element_verbatim_csv

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_element_verbatim_csv(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_element_verbatim_csv(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `api_v3_show_history(datasetId, callback)`

**GET /api/v3/dataset/:datasetId/element/history**

Handler: api_v3.show_history

**Parameters:**

- `datasetId` (string) - Dataset Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_show_history(
  'datasetId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_show_history(
  'datasetId'
);
console.log('Success:', result);
```

---

### `api_v3_get_history(datasetId, historyId, callback)`

**GET /api/v3/dataset/:datasetId/element/history/:historyId**

Handler: api_v3.get_history

**Parameters:**

- `datasetId` (string) - Dataset Id
- `historyId` (string) - History Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_history(
  'datasetId',
  'historyId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_history(
  'datasetId',
  'historyId'
);
console.log('Success:', result);
```

---

### `api_v3_get_history_elements(datasetId, historyId, callback)`

**GET /api/v3/dataset/:datasetId/element/history/:historyId/elements**

Handler: api_v3.get_history_elements

**Parameters:**

- `datasetId` (string) - Dataset Id
- `historyId` (string) - History Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.api_v3_get_history_elements(
  'datasetId',
  'historyId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.api_v3_get_history_elements(
  'datasetId',
  'historyId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__admin_(datasetId, historyId, callback)`

**POST /api/v3/dataset/:datasetId/element/history/:historyId/restore**

Handler: auth.ensure_role('admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `historyId` (string) - History Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__admin_(
  'datasetId',
  'historyId',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__admin_(
  'datasetId',
  'historyId'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/element/:key/summary**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `auth_ensure_role__edit_admin_(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/element/:key/summary**

Handler: auth.ensure_role('edit|admin'

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_ensure_role__edit_admin_(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `notes_get_element_notes(datasetId, key, callback)`

**GET /api/v3/dataset/:datasetId/element/:key/notes**

Handler: notes.get_element_notes

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.notes_get_element_notes(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.notes_get_element_notes(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

### `notes_post_element_note(datasetId, key, callback)`

**POST /api/v3/dataset/:datasetId/element/:key/note**

Handler: notes.post_element_note

**Parameters:**

- `datasetId` (string) - Dataset Id
- `key` (string) - Key
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.notes_post_element_note(
  'datasetId',
  'key',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.notes_post_element_note(
  'datasetId',
  'key'
);
console.log('Success:', result);
```

---

## Log

### `_global_(id, callback)`

**GET /api/v3/log/:id**

Handler: 'global'

**Parameters:**

- `id` (string) - Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api._global_(
  'id',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api._global_(
  'id'
);
console.log('Success:', result);
```

---

## Logout

### `auth_logout(callback)`

**GET /api/v3/logout**

Handler: auth.logout

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.auth_logout(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.auth_logout(
);
console.log('Success:', result);
```

---

## Questions

### `account_post_question(callback)`

**POST /api/v3/questions**

Handler: account.post_question

**Parameters:**

- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.account_post_question(
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.account_post_question(
);
console.log('Success:', result);
```

---

## Tasks

### `next(id, callback)`

**GET /api/v3/tasks/:id**

Handler: next

**Parameters:**

- `id` (string) - Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.next(
  'id',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.next(
  'id'
);
console.log('Success:', result);
```

---

### `next(id, callback)`

**GET /api/v3/tasks/:id/check**

Handler: next

**Parameters:**

- `id` (string) - Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.next(
  'id',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.next(
  'id'
);
console.log('Success:', result);
```

---

### `next(id, callback)`

**GET /api/v3/tasks/:id/result**

Handler: next

**Parameters:**

- `id` (string) - Id
- `callback` (function, optional) - Callback function(err, result). If omitted, returns Promise.

**Returns:** Promise if no callback provided

**Example:**

```javascript
// Callback style
api.next(
  'id',
  function(err, result) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Success:', result);
  }
);

// Promise style
const result = await api.next(
  'id'
);
console.log('Success:', result);
```

---

