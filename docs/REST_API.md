# Protobi REST API Documentation

> **Auto-generated from OpenAPI specification**
> Last updated: 2025-12-14

This documentation covers the public REST API endpoints for Protobi. All endpoints require authentication via API key.

## Authentication

All requests must include your API key either as:
- Query parameter: `?apiKey=YOUR_API_KEY`
- HTTP header: `x-api-key: YOUR_API_KEY`

Get your API key from: https://app.protobi.com/account

## Base URL

```
Production: https://app.protobi.com
```

## Endpoints by Category

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

### POST /api/v3/connection

`POST /api/v3/connection`

Handler: api_v3.post_connection_new

**Example Request:**

```bash
curl -X POST "/api/v3/connection?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/connection/:connectionId

`PUT /api/v3/connection/{connectionId}`

Handler: api_v3.put_connection

**Path Parameters:**

- `connectionId` (string, **required**) - Connection Id

**Example Request:**

```bash
curl -X PUT "/api/v3/connection/<connectionId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/connection/:connectionId

`DELETE /api/v3/connection/{connectionId}`

Handler: api_v3.delete_connection

**Path Parameters:**

- `connectionId` (string, **required**) - Connection Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/connection/<connectionId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Connections

### POST /api/v3/connections/new

`POST /api/v3/connections/new`

Handler: auth.ensure_role('admin'

**Example Request:**

```bash
curl -X POST "/api/v3/connections/new?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Data Tables

### GET /api/v3/dataset/:datasetId/data/raw

`GET /api/v3/dataset/{datasetId}/data/raw`

Handler: api_v3.get_data_raw

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/raw?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/csv

`GET /api/v3/dataset/{datasetId}/data/csv`

Handler: api_v3.get_data_csv

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/csv?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/syntax

`GET /api/v3/dataset/{datasetId}/data/syntax`

Handler: spss.get_dataset_syntax_raw

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/syntax?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/raw

`GET /api/v3/dataset/{datasetId}/data/{key}/raw`

Handler: api_v3.get_data_direct

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/raw?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/csv

`GET /api/v3/dataset/{datasetId}/data/{key}/csv`

Handler: api_v3.get_data_csv

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/csv?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/sav

`GET /api/v3/dataset/{datasetId}/data/{key}/sav`

Handler: spss.get_dataset_admin_sav

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/sav?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/syntax

`GET /api/v3/dataset/{datasetId}/data/{key}/syntax`

Handler: spss.get_dataset_syntax_raw

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/syntax?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/xlsx

`GET /api/v3/dataset/{datasetId}/data/{key}/xlsx`

Handler: api_v3.get_data_xlsx

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/xlsx?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/layout

`GET /api/v3/dataset/{datasetId}/data/{key}/layout`

Handler: api_v3.get_data_layout

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/layout?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/data/:key/run

`PUT /api/v3/dataset/{datasetId}/data/{key}/run`

Handler: api_v3.run_data_process

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/data/<key>/run?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/data/:key

`PUT /api/v3/dataset/{datasetId}/data/{key}`

Handler: api_v3.put_datafile

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/data/<key>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PATCH /api/v3/dataset/:datasetId/data/:key

`PATCH /api/v3/dataset/{datasetId}/data/{key}`

Handler: api_v3.patch_datafile

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PATCH "/api/v3/dataset/<datasetId>/data/<key>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/data/:key

`DELETE /api/v3/dataset/{datasetId}/data/{key}`

Handler: api_v3.delete_datafile

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/data/<key>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key

`GET /api/v3/dataset/{datasetId}/data/{key}`

Handler: api_v3.get_datafile

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/data/:key/primary

`POST /api/v3/dataset/{datasetId}/data/{key}/primary`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/data/<key>/primary?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/properties

`GET /api/v3/dataset/{datasetId}/data/{key}/properties`

Handler: api_v3.get_dataset_table_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/data/:key/properties

`PUT /api/v3/dataset/{datasetId}/data/{key}/properties`

Handler: api_v3.put_dataset_table_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/data/<key>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/data/:key/powerpoint/json

`GET /api/v3/dataset/{datasetId}/data/{key}/powerpoint/json`

Handler: exports.get_powerpoint_json

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/data/<key>/powerpoint/json?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Dataset Administration

### GET /api/v3/dataset/:datasetId/admin/ai/file-statuses

`GET /api/v3/dataset/{datasetId}/admin/ai/file-statuses`

Handler: api_v3.get_dataset_admin_ai_file_statuses

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/admin/ai/file-statuses?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/admin/data/:key/properties

`POST /api/v3/dataset/{datasetId}/admin/data/{key}/properties`

Handler: api_v3.post_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/admin/data/<key>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/admin/data/:key/properties

`PUT /api/v3/dataset/{datasetId}/admin/data/{key}/properties`

Handler: api_v3.post_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/admin/data/<key>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/admin/data/:key/properties

`GET /api/v3/dataset/{datasetId}/admin/data/{key}/properties`

Handler: api_v3.get_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/admin/data/<key>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx

`POST /api/v3/dataset/{datasetId}/admin/data/{key}/properties/pptx`

Handler: api_v3.post_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/admin/data/<key>/properties/pptx?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx

`PUT /api/v3/dataset/{datasetId}/admin/data/{key}/properties/pptx`

Handler: api_v3.post_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/admin/data/<key>/properties/pptx?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/admin/data/:key/properties/pptx

`GET /api/v3/dataset/{datasetId}/admin/data/{key}/properties/pptx`

Handler: api_v3.get_dataset_admin_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/admin/data/<key>/properties/pptx?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### refreshes data only, for existing project (GET)

`GET /api/v3/dataset/{datasetId}/admin/sermo/update`

refreshes data only, for existing project (GET)

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/admin/sermo/update?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### refreshes data only, for existing project (POST)

`POST /api/v3/dataset/{datasetId}/admin/sermo/update`

refreshes data only, for existing project (POST)

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/admin/sermo/update?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Datasets

### POST /api/v3/dataset/:datasetId/clone

`POST /api/v3/dataset/{datasetId}/clone`

Handler: api_v3.clone_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/clone?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/questions

`POST /api/v3/dataset/{datasetId}/questions`

Handler: account.post_question

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/questions?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset

`GET /api/v3/dataset`

Handler: auth.ensure_role('admin'

**Example Request:**

```bash
curl -X GET "/api/v3/dataset?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset

`POST /api/v3/dataset`

Handler: auth.ensure_role('edit|admin'

**Example Request:**

```bash
curl -X POST "/api/v3/dataset?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId

`GET /api/v3/dataset/{datasetId}`

Handler: api_v3.get_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId

`PUT /api/v3/dataset/{datasetId}`

Handler: api_v3.put_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId

`DELETE /api/v3/dataset/{datasetId}`

Handler: api_v3.delete_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/datasets/:datasetId

`GET /api/v3/datasets/{datasetId}`

Handler: api_v3.get_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/datasets/<datasetId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/properties

`GET /api/v3/dataset/{datasetId}/properties`

Handler: api_v3.get_project_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/properties

`PUT /api/v3/dataset/{datasetId}/properties`

Handler: api_v3.put_project_properties

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/properties?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/datasets/:datasetId/element

`GET /api/v3/datasets/{datasetId}/element`

Handler: api_v3.get_elements

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/datasets/<datasetId>/element?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/datasets/:datasetId/element

`POST /api/v3/datasets/{datasetId}/element`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/datasets/<datasetId>/element?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/formats

`GET /api/v3/dataset/{datasetId}/formats`

Handler: api_v3.get_element_formats

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/formats?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/titles

`GET /api/v3/dataset/{datasetId}/titles`

Handler: api_v3.get_element_titles

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/titles?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/layout/:key

`POST /api/v3/dataset/{datasetId}/layout/{key}`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/layout/<key>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/tables

`GET /api/v3/dataset/{datasetId}/tables`

Handler: api_v3.get_dataset_tables

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/tables?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/surveyengine/info

`GET /api/v3/dataset/{datasetId}/surveyengine/info`

Handler: surveyengine.get_info

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/surveyengine/info?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/surveyengine/data/

`GET /api/v3/dataset/{datasetId}/surveyengine/data/`

Handler: surveyengine.get_data

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/surveyengine/data/?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/surveyengine/data/refresh

`POST /api/v3/dataset/{datasetId}/surveyengine/data/refresh`

Handler: surveyengine.refresh_data

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/surveyengine/data/refresh?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/surveyengine/elements/reset

`POST /api/v3/dataset/{datasetId}/surveyengine/elements/reset`

Handler: surveyengine.reset_elements

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/surveyengine/elements/reset?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/surveyengine/details

`POST /api/v3/dataset/{datasetId}/surveyengine/details`

Handler: surveyengine.post_details

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/surveyengine/details?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/tasks

`GET /api/v3/dataset/{datasetId}/tasks`

Handler: api_v3.get_tasks

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/tasks?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/metadata

`GET /api/v3/dataset/{datasetId}/metadata`

Handler: api_v3.get_metadata

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/metadata?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/permission/

`POST /api/v3/dataset/{datasetId}/permission/`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/permission/?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/permission

`GET /api/v3/dataset/{datasetId}/permission`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/permission?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/user/:userId/permission/:role

`PUT /api/v3/dataset/{datasetId}/user/{userId}/permission/{role}`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `userId` (string, **required**) - User Id
- `role` (string, **required**) - Role

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/user/<userId>/permission/<role>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/user/:userId/permission/:role

`POST /api/v3/dataset/{datasetId}/user/{userId}/permission/{role}`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `userId` (string, **required**) - User Id
- `role` (string, **required**) - Role

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/user/<userId>/permission/<role>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/user/:userId/permission

`DELETE /api/v3/dataset/{datasetId}/user/{userId}/permission`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `userId` (string, **required**) - User Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/user/<userId>/permission?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/pin

`GET /api/v3/dataset/{datasetId}/pin`

Handler: api_v3.pin_user_to_dataset

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/pin?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/translate

`POST /api/v3/dataset/{datasetId}/translate`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/translate?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/translate

`GET /api/v3/dataset/{datasetId}/translate`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/translate?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/load

`POST /api/v3/dataset/{datasetId}/ai/load`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/load?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/load

`GET /api/v3/dataset/{datasetId}/ai/load`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/load?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/help

`POST /api/v3/dataset/{datasetId}/ai/help`

Handler: aiChat.askQuestion

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/help?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/help

`GET /api/v3/dataset/{datasetId}/ai/help`

Handler: aiChat.askQuestion

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/help?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/unload

`POST /api/v3/dataset/{datasetId}/ai/unload`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/unload?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/unload

`GET /api/v3/dataset/{datasetId}/ai/unload`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/unload?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/history

`GET /api/v3/dataset/{datasetId}/ai/history`

Handler: aiChat.getHistory

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/history?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/files

`GET /api/v3/dataset/{datasetId}/ai/files`

Handler: aiChat.getFiles

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/files?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/vectorstore/files

`GET /api/v3/dataset/{datasetId}/ai/vectorstore/files`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/vectorstore/files?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/cleanup

`POST /api/v3/dataset/{datasetId}/ai/cleanup`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/cleanup?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/thread/reset

`POST /api/v3/dataset/{datasetId}/ai/thread/reset`

Handler: aiChat.resetThread

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/thread/reset?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/start

`GET /api/v3/dataset/{datasetId}/ai/start`

Handler: aiChat.initialize

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/start?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/ai/threads/:threadId

`DELETE /api/v3/dataset/{datasetId}/ai/threads/{threadId}`

Handler: aiChat.deleteThread

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `threadId` (string, **required**) - Thread Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/ai/threads/<threadId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/ephemeral

`POST /api/v3/dataset/{datasetId}/ai/ephemeral`

Handler: secureUpload.single('file'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/ephemeral?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/persistent

`POST /api/v3/dataset/{datasetId}/ai/persistent`

Handler: secureUpload.single('file'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/persistent?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/survey/text

`POST /api/v3/dataset/{datasetId}/ai/survey/text`

Handler: aiAutocode.getSurveyText

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/survey/text?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/ai/survey/text

`GET /api/v3/dataset/{datasetId}/ai/survey/text`

Handler: aiAutocode.getSurveyText

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/ai/survey/text?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/survey/sections

`POST /api/v3/dataset/{datasetId}/ai/survey/sections`

Handler: aiAutocode.getSurveySections

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/survey/sections?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/ai/survey/sections_keys

`POST /api/v3/dataset/{datasetId}/ai/survey/sections_keys`

Handler: aiAutocode.getSectionKeys

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/ai/survey/sections_keys?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/sentiment

`POST /api/v3/dataset/{datasetId}/sentiment`

Handler: sentiment.sentiment

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/sentiment?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/autocode

`POST /api/v3/dataset/{datasetId}/autocode`

Handler: sentiment.autocode

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/autocode?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/autocode

`GET /api/v3/dataset/{datasetId}/autocode`

Handler: sentiment.autocode

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/autocode?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/todo

`GET /api/v3/dataset/{datasetId}/todo`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/todo?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/todo/:todoId

`GET /api/v3/dataset/{datasetId}/todo/{todoId}`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `todoId` (string, **required**) - Todo Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/todo/<todoId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/todo/:todoId

`DELETE /api/v3/dataset/{datasetId}/todo/{todoId}`

Handler: api_v3.delete_todo

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `todoId` (string, **required**) - Todo Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/todo/<todoId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/gist

`GET /api/v3/dataset/{datasetId}/gist`

Handler: api_v3.get_gists

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/gist?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/gist

`PUT /api/v3/dataset/{datasetId}/gist`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/gist?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/gist/:gistId

`GET /api/v3/dataset/{datasetId}/gist/{gistId}`

Handler: api_v3.get_gist

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `gistId` (string, **required**) - Gist Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/gist/<gistId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/gist/:gistId

`DELETE /api/v3/dataset/{datasetId}/gist/{gistId}`

Handler: api_v3.delete_gist

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `gistId` (string, **required**) - Gist Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/gist/<gistId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/gist/:gistId

`PUT /api/v3/dataset/{datasetId}/gist/{gistId}`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `gistId` (string, **required**) - Gist Id

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/gist/<gistId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/experimental/googlesheet

`POST /api/v3/dataset/{datasetId}/experimental/googlesheet`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/experimental/googlesheet?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/template/:key/shapes

`GET /api/v3/dataset/{datasetId}/template/{key}/shapes`

Handler: exports.get_powerpoint_json

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/template/<key>/shapes?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/gsg/recodes

`GET /api/v3/dataset/{datasetId}/gsg/recodes`

Handler: globalstrategygroup.get_recodes

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/gsg/recodes?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/notes

`GET /api/v3/dataset/{datasetId}/notes`

Handler: notes.get_dataset_notes

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/notes?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### PUT /api/v3/dataset/:datasetId/note/:noteId

`PUT /api/v3/dataset/{datasetId}/note/{noteId}`

Handler: notes.put_note

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `noteId` (string, **required**) - Note Id

**Example Request:**

```bash
curl -X PUT "/api/v3/dataset/<datasetId>/note/<noteId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### DELETE /api/v3/dataset/:datasetId/note/:noteId

`DELETE /api/v3/dataset/{datasetId}/note/{noteId}`

Handler: notes.delete_note

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `noteId` (string, **required**) - Note Id

**Example Request:**

```bash
curl -X DELETE "/api/v3/dataset/<datasetId>/note/<noteId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Elements

### GET /api/v3/dataset/:datasetId/element

`GET /api/v3/dataset/{datasetId}/element`

Handler: api_v3.get_elements

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/element

`POST /api/v3/dataset/{datasetId}/element`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/element?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/:key/verbatim

`GET /api/v3/dataset/{datasetId}/element/{key}/verbatim`

Handler: api_v3.get_element_verbatim_csv

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/<key>/verbatim?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/history

`GET /api/v3/dataset/{datasetId}/element/history`

Handler: api_v3.show_history

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/history?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/history/:historyId

`GET /api/v3/dataset/{datasetId}/element/history/{historyId}`

Handler: api_v3.get_history

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `historyId` (string, **required**) - History Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/history/<historyId>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/history/:historyId/elements

`GET /api/v3/dataset/{datasetId}/element/history/{historyId}/elements`

Handler: api_v3.get_history_elements

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `historyId` (string, **required**) - History Id

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/history/<historyId>/elements?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/element/history/:historyId/restore

`POST /api/v3/dataset/{datasetId}/element/history/{historyId}/restore`

Handler: auth.ensure_role('admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `historyId` (string, **required**) - History Id

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/element/history/<historyId>/restore?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/element/:key/summary

`POST /api/v3/dataset/{datasetId}/element/{key}/summary`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/element/<key>/summary?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/:key/summary

`GET /api/v3/dataset/{datasetId}/element/{key}/summary`

Handler: auth.ensure_role('edit|admin'

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/<key>/summary?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/dataset/:datasetId/element/:key/notes

`GET /api/v3/dataset/{datasetId}/element/{key}/notes`

Handler: notes.get_element_notes

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X GET "/api/v3/dataset/<datasetId>/element/<key>/notes?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### POST /api/v3/dataset/:datasetId/element/:key/note

`POST /api/v3/dataset/{datasetId}/element/{key}/note`

Handler: notes.post_element_note

**Path Parameters:**

- `datasetId` (string, **required**) - Dataset Id
- `key` (string, **required**) - Key

**Example Request:**

```bash
curl -X POST "/api/v3/dataset/<datasetId>/element/<key>/note?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Log

### GET /api/v3/log/:id

`GET /api/v3/log/{id}`

Handler: 'global'

**Path Parameters:**

- `id` (string, **required**) - Id

**Example Request:**

```bash
curl -X GET "/api/v3/log/<id>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Logout

### GET /api/v3/logout

`GET /api/v3/logout`

Handler: auth.logout

**Example Request:**

```bash
curl -X GET "/api/v3/logout?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Questions

### POST /api/v3/questions

`POST /api/v3/questions`

Handler: account.post_question

**Example Request:**

```bash
curl -X POST "/api/v3/questions?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

## Tasks

### GET /api/v3/tasks/:id

`GET /api/v3/tasks/{id}`

Handler: next

**Path Parameters:**

- `id` (string, **required**) - Id

**Example Request:**

```bash
curl -X GET "/api/v3/tasks/<id>?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/tasks/:id/check

`GET /api/v3/tasks/{id}/check`

Handler: next

**Path Parameters:**

- `id` (string, **required**) - Id

**Example Request:**

```bash
curl -X GET "/api/v3/tasks/<id>/check?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

### GET /api/v3/tasks/:id/result

`GET /api/v3/tasks/{id}/result`

Handler: next

**Path Parameters:**

- `id` (string, **required**) - Id

**Example Request:**

```bash
curl -X GET "/api/v3/tasks/<id>/result?apiKey=<YOUR_API_KEY>" \
  -H "x-api-key: <YOUR_API_KEY>"
```

**Example Response:**

```json
{
  "success": true
}
```

---

