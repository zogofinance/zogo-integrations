# Zogo Integration Implementation Documentation

Zogo Integration utilizes an iframe to display a tailored version of the Zogo learning flow.

This integration features robust customizations controlled both by your implementations and our backend — we’ll cover the difference between these two here shortly.

## Also check out this [Video Walkthrough](https://www.loom.com/share/0df597b8c9c849b4ab6e1a8fff12e708) that goes through a basic integration!

## Table of contents

- [Integration Overview](#integration-overview)
- [Iframe URL](#iframe-url)
- [Widget Type](#widget-type)
- [Module IDs](#module-ids)
- [API Reference](#api-reference)
- [Customizations](#customizations)
- [PostMessage Events](#postmessage-events)
- [Demo Integration Template](#demo-integration-template)
- [Moving to Production](#moving-to-production)

# Integration Overview

1. Retrieve a User Access Token from the Zogo API using the `POST /integration/token` route (see [API Reference](#api-reference))
2. Choose the Widget Type for the type of integration you intend to use. (see [Widget Type](#widget-type))
3. If you are using the Embedded Module (Deep Link) Widget Type, you will need to choose the Module ID of the content you wish to embed. (see [Module IDs](#module-ids))
4. Choose your customizations by generating your Customization Object (see [Customizations](#customizations))
5. Build your iframe URL to embed by combining the Iframe Base URL, User Access Token, Widget Type, Module ID (if applicable), and Customization Object (see [Iframe URL](#iframe-url))
6. Embed the iframe URL and listen for the appropriate postMessage events (See [Demo Integration Template](#demo-integration-template) and [PostMessage Events](#postmessage-events)).

> ❗Also check out this [Video Walkthrough](https://www.loom.com/share/0df597b8c9c849b4ab6e1a8fff12e708) that goes through a basic integration!

# Iframe URL

### Base URL

The base URL determines whether the visual client you are using is the production version or the testing/development version. Also, when using the testing base URL, test users will be created instead of production users. These test users will not be included in any analytics provided by Zogo and also will not show up in default in the responses to the Zogo API routes.

**Production:** https://integration.zogo.com

**Testing/Development:** https://dev-integration.zogo.com

### URL Parameters

`{BASE_URL}?widget_type={WIDGET_TYPE}&token={USER_ACCESS_TOKEN}&module_id={MODULE_ID}&integration_customizations={CUSTOMIZATION_OBJECT}`

- **widget_type ('deep_link', 'skill_select'):** indicates which type of integration you indicate to use (see [Widget Type](#widget-type))
- **token (string):** single-use token retrieved from the Zogo API using the `POST /integration/token` route (see [API Reference](#api-reference))
- **module_id (number):** the ID of the content you wish to embed. (see [Module IDs](#module-ids))
- **integration_customizations (object):** URL-encoded configuration object for the customizations you want to use (see [Customizations](#customizations))

# Widget Type

There are currently two different widget types supported with Zogo Integration. Choose the type most appropriate for your use case.

- **Embedded Module (deep_link):** You can embed a single learning module. When using this widget type, you will need to specify the module ID of the particular piece of content you want to embed.
- **Skill Select (skill_select):** You can embed an entire curriculum of learning content. When using this widget type, the user can explore and complete multiple skills (which are a collection of multiple related modules). This widget type also includes other feature such as search and streaks. You will be able to customize what learning content is shown using the Content Library within your Partner Portal.

Both widget types are supported when using the demo credentials. You will need to confirm with your CX Representative which options your contract supports when using your production credentials.

# Module IDs

> ❗ Specifying a module ID is only relevant for the deep_link widget type

The content that will be displayed in the iframe is determined by the module_id you include in the iframe URL. Each education module (i.e. lesson) has a unique ID. When using the testing/development credentials included in [API Reference](#api-reference) you will only have access to the following ten demo modules. Once you retrieve your production credentials from Zogo you will have access to hundreds of more educational modules. You will be able to find the module_id for these modules in the Content Library within your Partner Portal.

### Demo Modules

- Skill: Start Investing
  - Why Invest? - id: 2922
  - Investment Channels - id: 2904
  - Securities - id: 2909
  - Stocks - id: 4521
  - Bonds - id: 4526
- Skill: Get Insured
  - Personal Risks - id: 44
  - Managing Risk - id: 29
  - Insurance - id: 41
  - Type of Insurance - id: 995216
  - Warranties - id: 9

# API Reference

## General

### API Base URL

All API routes should be appended to the following base URL: `https://api.zogofinance.com/production/v1`

### Basic Authorization

All API routes require a basic auth token.

To generate the Basic token, you will take the client_id and client_secret in “client_id:client_secret” format and encode it using base64 encoding. For testing you can also use the Basic Auth with your credentials in apps like Postman.

> 💡 This encoding can be done automatically with [this tool](https://www.debugbear.com/basic-auth-header-generator)

For testing/development you can use the following basic token: “Basic MzQzNDM0Om15c2VjcmV0”

- client_id “343434” and client_secret “mysecret”

For production, please reach out to Zogo for production credentials.

### Testing flag for `/users` routes

By default, all /users routes only return data for production users.

To retrieve an API response with data for testing/development users append the `is_testing=true` URL parameter to the API request.

For example: `/integration/users/points/all?is_testing=true`

## API Routes

### POST `/integration/token`

<details>
<summary>Details:</summary>

**Description:**

Use this route to generate a User Access Token

User Access Tokens need to be generated and passed to the iframe to authenticate the user.

**Request Body:**

```json
{
  "scope": "webcomponent_user",
  "user_id": "<desired user id as a string>",
  "grant_type": "client_credentials"
}
```

Notes on user_id

- Your backend service provides this user_id - Zogo uses this user_id to save individual user progress
  - **IMPORTANT:** You will not be able to reuse the same user_id for testing/development and production users. All user_ids must be unique irregardless of user type.
- The user_id provided must be unique and URL safe
- The user_id can be a string or integer

**Example 200 Response:**

```json
{
  "token_type": "bearer",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXV0aG9yaXphdGlvbi1zZXJ2ZXIuY29tXC8iLCJleHAiOjE2MzczNDQ1NzIsImF1ZCI6ImFwaTpcL1wvZGVmYXVsdCIsInN1YiI6MTAwMCwiY2xpZW50X2lkIjoiaHR0cHM6XC9cL2V4YW1wbGUtYXBwLmNvbSIsImlhdCI6MTYzNzMzNzM3MiwianRpIjoiMTYzNzMzNzM3Mi4yMDUxLjYyMGY1YTNkYzBlYmFhMDk3MzEyIiwic2NvcGUiOiJyZWFkIHdyaXRlIn0.SKDO_Gu96WeHkR_Tv0d8gFQN1SEdpN8S_h0IJQyl_5syvpIRA5wno0VDFi34k5jbnaY5WHn6Y912IOmg6tMO91KlYOU1MNdVhHUoPoNUzYtl_nNab7Ywe29kxgrekm-67ZInDI8RHbSkL7Z_N9eZz_J8c3EolcsoIf-Dd5n9y_Y",
  "expires_in": 86400
}
```

**Examples/Reference:**

The fastest way to get a token for testing purposes is by utilizing CURL.

- **CURL Example**
  ```jsx
  curl --location --request POST 'https://api.zogofinance.com/production/v1/integration/token' --header 'Authorization: Basic MzQzNDM0Om15c2VjcmV0' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'scope=webcomponent_user' --data-urlencode 'user_id=283411111' --data-urlencode 'grant_type=client_credentials'
  ```
- **Swift (iOS) Example:**

  ```swift
  import Foundation

  func sendAPIRequest() {
      let url = URL(string: "https://api.zogofinance.com/production/v1/integration/token")!

      var request = URLRequest(url: url)
      request.httpMethod = "POST"

      let credentials = "MzQzNDM0Om15c2VjcmV0"
      let scope = "webcomponent_user"
      let userId = "283411111"
      let grantType = "client_credentials"

      let authValue = "Basic " + (credentials.data(using: .utf8)?.base64EncodedString() ?? "")

      request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
      request.setValue(authValue, forHTTPHeaderField: "Authorization")

      let data = "scope=\(scope)&user_id=\(userId)&grant_type=\(grantType)".data(using: .utf8)
      request.httpBody = data

      let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
          guard let responseData = data,
                let responseString = String(data: responseData, encoding: .utf8) else {
              if let error = error {
                  print("Error: \(error)")
              }
              return
          }

          print(responseString)
      }

      task.resume()
  }

  sendAPIRequest()
  ```

- **Kotlin (Android) Example:**

  ```kotlin
  import kotlinx.coroutines.Dispatchers
  import kotlinx.coroutines.runBlocking
  import kotlinx.coroutines.withContext
  import com.github.kittinunf.fuel.Fuel
  import com.github.kittinunf.fuel.core.Headers
  import com.github.kittinunf.fuel.coroutines.awaitStringResponseResult

  fun main() {
      val url = "https://api.zogofinance.com/production/v1/integration/token"
      val headers = Headers().apply {
          append("Content-Type", "application/x-www-form-urlencoded")
          append("Authorization", "Basic MzQzNDM0Om15c2VjcmV0")
      }
      val body = listOf(
          "scope" to "webcomponent_user",
          "user_id" to "283411111",
          "grant_type" to "client_credentials"
      ).formUrlEncode()

      runBlocking {
          val (request, response, result) = withContext(Dispatchers.IO) {
              Fuel.post(url)
                  .headers(headers)
                  .body(body)
                  .awaitStringResponseResult()
          }

          val responseData = result.fold(
              { data -> data },
              { error -> "Error: ${error.message}" }
          )

          println(responseData)
      }
  }
  ```

- **Dart** (**Flutter):**

  ```swift
  import 'package:http/http.dart' as http;

  void sendAPIRequest() async {
    final url = Uri.parse('https://api.zogofinance.com/production/v1/integration/token');

    final headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic MzQzNDM0Om15c2VjcmV0',
    };

    final body = {
      'scope': 'webcomponent_user',
      'user_id': '283411111',
      'grant_type': 'client_credentials',
    };

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      print(response.body); // Process the response data
    } else {
      print('Error: ${response.statusCode}');
    }
  }

  void main() {
    sendAPIRequest();
  }
  ```

- **JavaScript Example:**

  ```jsx
  fetch('https://api.zogofinance.com/production/v1/integration/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
    },
    body: new URLSearchParams({
      scope: 'webcomponent_user',
      user_id: '283411111',
      grant_type: 'client_credentials',
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Process the response data
    })
    .catch(error => {
      console.error('Error:', error);
    });
  ```

  or using AXIOS:

  ```jsx
  const axios = require('axios');

  axios
    .post(
      'https://api.zogofinance.com/production/v1/integration/token',
      {
        scope: 'webcomponent_user',
        user_id: '283411111',
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
        },
      }
    )
    .then(response => {
      console.log(response.data); // Process the response data
    })
    .catch(error => {
      console.error('Error:', error);
    });
  ```

  </details>

### GET `/integration/users/{userId}/points`

<details>
<summary>Details:</summary>

**Description:**

Use this route to get points for a specified user

**parameters:**

`userId`: string (path)

**Example 200 Response:**

```json
[
  {
    "primary_points": 1234
  }
]
```

**Examples/Reference:**

```
const axios = require('axios');

const userId = 1234;

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
};

axios.get(`${BASE_URL}/integration/users/${userId}/points`, headers)
    .then((res) => {
        console.log(`primary_points: ${res.primary_points}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
  ### PATCH `/integration/users/{userId}/points`

<details>
<summary>Details:</summary>

**Description:**

Use this route to adjust points for a specified user

**parameters:**

`userId`: string (path)

`primary_points_change_amount`: number (body) - This should be the amount of points you want added or subtracted (determined by value of `primary_points_change_type`)

`primary_points_change_type`: enum [”subtract”, “add”] (body) - determine whether the points should be added or subtracted to the user’s current value

**Example Request Body**

```json
{
  "primary_points_change_amount": 200,
  "primary_points_change_type": "subtract"
}
```

**Example 200 Response:**

```json
[
  {
    "primary_points": 400 // if the user had 600 points before the request
  }
]
```

**Examples/Reference:**

```
const axios = require('axios');

const userId = 1234;

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0'
};

const body = {
	primary_points: 200,
};

axios.patch(`${BASE_URL}/integration/users/${userId}/points`, body, headers)
    .then((res) => {
        console.log(`primary_points: ${res.primary_points}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
 ### GET `/integration/users/points/all`

<details>
<summary>Details:</summary>

**Description:**

Use this route to get points for all users

**parameters:**

`is_testing`: boolean (query) (optional): returns test users instead of production users if set to true

**Example 200 Response:**

```json
[
  {
      "user_id": "123",
      "first_name": null, // this will always be null
      "last_name": null, // this will always be null
      "primary_points": 100,
  },
  ...
]
```

**Examples/Reference:**

```
const axios = require('axios');

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
};

axios.get(`${BASE_URL}/integration/users/points/all`, headers)
    .then((res) => {
        console.log(`Users: ${res}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
  </details>
 
 
### GET `/integration/users/{userId}/modules-history`

<details>
<summary>Details:</summary>

**Description:**

Use this route to get the started and completed modules for a specified user. There is no data here if a user has not first started a module.

**parameters:**

`userId`: string (path)

**Example 200 Response:**

```json
{
  "module_history": [
    {
      "module_id": 123,
      "module_name": "string",
      "progress": 50,
      "percent_accuracy": 77,
      "date_started": "string",
      "date_completed": "string",
      "module_status": "active", // active | inactive
    },
    ...
  ]
}
```

**Examples/Reference:**

```
const axios = require('axios');

const userId = 1234;

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0'
};

axios.get(`${BASE_URL}/integration/users/${userId}/modules-history`, headers)
    .then((res) => {
        console.log(`module_history: ${res.module_history}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
 ### GET `/integration/users/modules-history/all`

<details>

<summary>Details:</summary>

**Description:**

Use this route to get module history for all users

**parameters:**

`is_testing`: boolean (query) (optional): returns test users instead of production users if set to true

**Example 200 Response:**

```json
[
  {
    "user_id": "123",
    "module_history": [
      {
        "module_id": 123,
        "module_name": "string",
        "progress": 50,
        "percent_accuracy": 77,
        "date_started": "string",
        "date_completed": "string",
        "module_status": "active", // active | inactive
      },
      ...
    ]
  },
  ...
]
```

**Examples/Reference:**

```
const axios = require('axios');

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
};

axios.get(`${BASE_URL}/integration/users/modules-history/all`, headers)
    .then((res) => {
        console.log(`Users: ${res}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
 ### GET `/integration/users/{userId}/skills/progress`

<details>
<summary>Details:</summary>

**Description:**

Use this route to get the skill history for a particular user. This response only includes active skills where the user has completed at least one module.

**parameters:**

`userId`: string (path)

**Example 200 Response:**

```json
[
  {
    "skill_name": "string",
    "skill_id": 3,
    "skill_accuracy": 85, // an average accuracy for the completed modules
    "category_name": "string",
    "category_id": 123,
    "modules_completed_count": 4,
    "modules_total_count": 29,
	},
	...
]
```

**Examples/Reference:**

```
const axios = require('axios');

const userId = 1234;

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0'
};

axios.get(`${BASE_URL}/integration/users/${userId}/skills/progress`, headers)
    .then((res) => {
        console.log(`skills progress: ${res}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
  ### GET `/integration/users/skills/progress/all`

<details>

<summary>Details:</summary>

**Description:**

Use this route to get the skill history for all users. This response only includes active skills where the user has completed at least one module.

**parameters:**

`is_testing`: boolean (query) (optional): returns test users instead of production users if set to true

**Example 200 Response:**

```json
[
  {
    "user_id": "123",
    "skill_history": [
      {
        "skill_name": "string",
        "skill_id": 3,
        "skill_accuracy": 85, // an average accuracy for the completed modules
        "category_name": "string",
        "category_id": 123,
        "modules_completed_count": 4,
        "modules_total_count": 29,
      },
      ...
    ]
  },
  ...
]
```

**Examples/Reference:**

```
const axios = require('axios');

const headers = {
	Authorization: 'Basic MzQzNDM0Om15c2VjcmV0',
};

axios.get(`${BASE_URL}/integration/users/skills/progress/all`, headers)
    .then((res) => {
        console.log(`Users: ${res}`);
    }).catch((err) => {
        console.error(err);
    });
```

 </details>
 
# Customizations

Zogo Integration has two types of customizations, ones that are controlled by Zogo's backend and ones that are controlled by configuration object passed into the iframe.

## Client-Controlled Customizations:

These customizations are passed to the client via an encoded URL parameter. this parameter is called `integration_customizations`.

The `integration_customizations` object should be in the following format:

```json
{
  "colors": {
    "primary": "<ANY HEX COLOR>", // default: #0050AA
    "header": "<ANY HEX COLOR>", // default: #484848
    "sub_header": "<ANY HEX COLOR>", // default: #6F6F6F
    "button": "<ANY HEX COLOR>", // default: #FFFFFF
    "background": "<ANY HEX COLOR>", // default: #FFFFFF
    "highlight": "<ANY HEX COLOR>" // default: #DCDCDC
  },
  "font": "gotham", // gotham | notosans | raleway | merriweather
  "button": {
    "text_style": "uppercase", // uppercase | lowercase | capitalize
    "border_radius": 8 // measured in pixels, max 30
  },
  "language": "en-US", // en-US | es-US
  "end_of_module": {
    "cta_text": "Great Job! You finished!",
    "cta_button_text": "continue",
    "cta_post_message": "user clicked the cta button",
    "banner_image": "image_url",
    "banner_post_message": "user clicked the banner image"
  },
  "icon_pack": "classic" // classic | playful | clean
}
```

Be advised that if any of these are left blank or null, there is fallback behavior to ensure that these elements still have an assigned property. However, it is best practice to simply fill out the entire object as seen above.

## Customizations details

**Colors:**

The color object defines the color palette of the application. The color properties are as follows:

- primary
  - This is the overall theme color of the app, when non-text color is being applied somewhere it will usually be using this color or a derivative of this color.
- header
  - This color applies to primary text throughout the iFrame.
- sub-header
  - This color applies to secondary/sub header text throughout the iFrame.
- button
  - This color applies to the text of buttons. NOTE: Buttons take on the primary color.
- background
  - This is the overall background color of the app.
- highlight

  - This the border color of the app, it affects items like the snippet card borders and the border of question answers.

Below are screenshots of the app using the default colors:

![Screenshot 2023-07-17 at 12.53.13 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard1.png)

![Screenshot 2023-07-17 at 12.53.28 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard2.png)

![Screenshot 2023-07-17 at 12.53.38 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard3.png)

![Screenshot 2023-07-17 at 12.54.50 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard4.png)

Below are screenshots of the app using the customized colors:

```json
	"colors": {
		"primary": "#3ecff6",
		"header": "#ffffff",
		"sub_header": "#a4a8ba",
		"button": "#ffffff",
		"background": "#232234",
		"highlight": "#47475c"
	},
```

![Screenshot 2023-07-17 at 12.45.10 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/custom1.png)

![Screenshot 2023-07-17 at 12.44.55 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/custom2.png)

![Screenshot 2023-07-17 at 12.44.44 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/custom3.png)

![Screenshot 2023-07-17 at 12.45.29 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/custom4.png)

**Fonts:**

```json
	"font": "gotham", // gotham | notosans | raleway | merriweather
```

**Language:**

Zogo supports Spanish for some modules. Use this property to specify which language you want to deliver to the user. You will be able to view a complete list of modules that support Spanish in the Content Library within your Partner Portal.

```json
"language": "en-US", // en-US (English) | es-US (Spanish)
```

**Buttons:**

![Screenshot 2023-07-18 at 10.26.54 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.26.54_AM.png)

![Screenshot 2023-07-18 at 10.27.38 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.38_AM.png)

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.58_AM.png)

In addition to control of the primary color and the button text color, you also have access to control the border radius of the button and the style of the text.

```json
	"button": {
		"text_style": "uppercase", // uppercase | lowercase | capitalize
		"border_radius": 8 // measured in pixels, max 30
	}
```

The border radius of buttons can be customized up to 30 pixels, and the text style can be uppercase, lowercase or capitalized.

**End of Module:**

> ❗ This customization only applies to the deep_link widget type!

The end of module (eom) behavior and messaging is controlled by you. When a user reaches this page there is an optional banner ad space for your utilization which emits a postMessage to the parent app (your app). The call to action button on the page (in this example it says “DONE”, and the banner ad both emit unique postMessages you specify and any behavior from these two items is controlled by the parent app.

```json
"end_of_module": {
		"cta_text": "Custom CTA Message!",
		"cta_button_text":  "CTA button text",
		"cta_post_message": "user clicked the cta button",
		"banner_image": "IMAGE_URL",
		"banner_post_message": "user clicked the banner image"
	}
```

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot+2023-07-27+at+9.08.07+AM.png)

**Icon Pack:**

> ❗ This customization only applies to the skill_select widget type!

Each skill has a unique skill icon from one of three icon packs. You can specify which icon pack you wish to use.

```json
"icon_pack": "classic" // classic | playful | clean
```

Classic:

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot+2023-10-10+at+3.44.55+PM.png)

Playful:

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot+2023-10-10+at+3.45.22+PM.png)

Clean:

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot+2023-10-10+at+3.45.41+PM.png)

## Backend Controlled Customizations:

These are changes that must be communicated to your CX representative.

### Points

Does the user accumulate/earn points for correct answers?

- Enabled by default

What do points visually look like?

- By default a simple XP icon is used, however you can customize that icon to be any image.

### Powered by Zogo

![Screenshot 2023-07-17 at 11.46.07 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.46.07_AM.png)

This emblem shows up on several pages and can be removed for an added fee. Examples of this emblem in context are seen below.

![Screenshot 2023-07-17 at 11.53.17 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard2.png)

![Screenshot 2023-07-17 at 11.53.33 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard3.png)

![Screenshot 2023-07-17 at 11.53.10 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/standard4.png)

# PostMessage Events

Zogo Integration utilizes [postMessage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to communicate important events from inside the iframe to the parent app (your app). These events include when the iframe has loaded and is ready and various user actions.

You will need to setup listeners for these events. Examples of listeners can be found in the [Demo Integration Template](#demo-integration-template)

### Events:

- "zogo ready"
  - This message will fire when the iframe has loaded
- "openURL:{url clicked}"
  - If a user clicks a link in a snippet or affiliate link this message will fire and include the URL for the link that was clicked
- "module complete"
  - This message will fire when the user clicks the call to action button on the end of module screen.
  - the value of this message can be customized.
- "banner clicked"
  - This message will fire when the user clicks the banner ad on the end of module screen.
  - the value of this message can be customized.

# Demo Integration Template

We have provided a [template](https://github.com/zogofinance/zogo-integrations/tree/main/integration-v2-template) for a simple integration of Zogo Integration. It is a great reference while you are building out your integration.

# Moving To Production

To move your integration to production, you will need to reach out to your CX Representative to access your production credentials. These production credentials include a client_id and client_secret
