# Integration V2 Implementation Documentation

Integration V2 utilizes an iFrame to display a reduced version of the Zogo learning flow.

This integration features robust customizations controlled both by your implementations and our backend we’ll cover this difference between these two here shortly.

# Access Tokens

# User Access Tokens

User tokens are used by the integration to give your users access to the Zogo API. User tokens are safe to obtain and use in a browser.

Your backend should create access tokens by using the Zogo API.

# API Reference

---

For testing/development, we recommend using “https://api.zogofinance.com/development/v1”

For production, please reach out to Zogo for your production URL

## Token

### POST `/integration/token`

**Basic** **Authorization:**

For testing/development, “Basic MzQzNDM0Om15c2VjcmV0”

- username “343434” and password is “mysecret”

For production, please reach out to Zogo for production credentials.

To generate the Basic token, you will take the client_id and client_secret in “client_id:client_secret” format and encode it using base64 encoding. For testing you can also use the Basic Auth with your credentials in apps like Postman.

<aside>
💡 This can be done automatically with [this tool](https://www.debugbear.com/basic-auth-header-generator)

</aside>

**Request Body:**

```json
{
	scope="webcomponent_user"
	user_id="abc-283411111"
	grant_type="client_credentials"
}
```

Notes on user_id

- Your backend service provides this user_id - Zogo uses this user_id to save individual user progress
- The user_id provided must be unique and URL safe
- The user_id can be a string or integer

**Responses:**

Code: 200

## Examples/ Reference:

The fastest way to get a token for testing purposes is by utilizing CURL.

- **CURL Example**
  ```jsx
  curl --location --request POST 'https://api.zogofinance.com/development/v1/integration/token' --header 'Authorization: Basic MzQzNDM0Om15c2VjcmV0' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'scope=webcomponent_user' --data-urlencode 'user_id=283411111' --data-urlencode 'grant_type=client_credentials'
  ```
  **Example 200 Response**
  ```json
  {
    "token_type": "bearer",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXV0aG9yaXphdGlvbi1zZXJ2ZXIuY29tXC8iLCJleHAiOjE2MzczNDQ1NzIsImF1ZCI6ImFwaTpcL1wvZGVmYXVsdCIsInN1YiI6MTAwMCwiY2xpZW50X2lkIjoiaHR0cHM6XC9cL2V4YW1wbGUtYXBwLmNvbSIsImlhdCI6MTYzNzMzNzM3MiwianRpIjoiMTYzNzMzNzM3Mi4yMDUxLjYyMGY1YTNkYzBlYmFhMDk3MzEyIiwic2NvcGUiOiJyZWFkIHdyaXRlIn0.SKDO_Gu96WeHkR_Tv0d8gFQN1SEdpN8S_h0IJQyl_5syvpIRA5wno0VDFi34k5jbnaY5WHn6Y912IOmg6tMO91KlYOU1MNdVhHUoPoNUzYtl_nNab7Ywe29kxgrekm-67ZInDI8RHbSkL7Z_N9eZz_J8c3EolcsoIf-Dd5n9y_Y",
    "expires_in": 86400
  }
  ```
- **Swift (iOS) Example:**

  ```swift
  import Foundation

  func sendAPIRequest() {
      let url = URL(string: "https://api.zogofinance.com/development/v1/integration/token")!

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
      val url = "https://api.zogofinance.com/development/v1/integration/token"
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
    final url = Uri.parse('https://api.zogofinance.com/development/v1/integration/token');

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
  fetch('https://api.zogofinance.com/development/v1/integration/token', {
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
      'https://api.zogofinance.com/development/v1/integration/token',
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

# Customizations

![Screenshot 2023-07-17 at 12.53.13 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.53.13_PM.png)

![Screenshot 2023-07-17 at 12.53.28 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.53.28_PM.png)

![Screenshot 2023-07-17 at 12.53.38 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.53.38_PM.png)

![Screenshot 2023-07-17 at 12.54.50 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.54.50_PM.png)

The Zogo Integration has two types of customizations, ones that are controlled by our backend and ones that are controlled by the data you feed to the iFrame.

## Client Controlled Customizations:

These customizations are passed to the client via a encoded URL parameter. this parameter is called `integration_customizations` These customizations are all purly visual in nature and do not require any input from our backend making tweaking visuals in this integration as simple as possible for implementing a custom solution that fits both your needs and aesthetic.

The `integration_customizations` object should be in the following format:

```json
{
  "colors": {
    "primary": "<ANY HEX COLOR>",
    "header": "<ANY HEX COLOR>",
    "sub_header": "<ANY HEX COLOR>",
    "button": "<ANY HEX COLOR>",
    "background": "<ANY HEX COLOR>",
    "highlight": "<ANY HEX COLOR>"
  },
  "font": "gotham", // notosans | raleway | merriweather
  "button": {
    "text_style": "uppercase", // lowercase | capitalize
    "border_radius": 8 // measured in pixels, max 30
  },
  "language": "en-US", // es-US
  "end_of_module": {
    "cta_text": "Great Job! You finished!",
    "cta_button_text": "continue",
    "cta_post_message": "user clicked the cta button",
    "banner_image": "image_url",
    "banner_post_message": "user clicked the banner image"
  }
}
```

Be advised that if any of these are left blank or null there is fallback behavior to ensure that these elements still have a assigned property, however it is best practice to simply fill out the entire object as seen above.

### Customizations effects

**Colors:**

The color object defines the color pallet of the application. The color properties are as follows:

- primary
  - This is the overall theme color of the app, when non-text color is being applied somewhere it will usually be using this color or a derivative of this color.
- header
  - This color applies to primary text throughout the iFrame.
- sub_header
  - This color applies to secondary/sub header text throughout the iFrame.
- button
  - This color applies to the text of buttons. NOTE: Buttons take on the primary color.
- background
  - This is the overall background color of the app.
- highlight
  - This the border color of the app, it effects items like the snippet card boarders and the border of question answers.

Below is an extreme and unrealistic example of a color customization pattern to demonstrate what the individual colors control.

```json
	"colors": {
		"primary": "#219f15",
		"header": "#e72ce7",
		"sub_header": "#cfda1c",
		"button": "#ff000f",
		"background": "#ccc9c9",
		"highlight": "#ffe5e5"
	},
```

![Screenshot 2023-07-17 at 12.45.29 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.45.29_PM.png)

![Screenshot 2023-07-17 at 12.44.44 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.44.44_PM.png)

![Screenshot 2023-07-17 at 12.44.55 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.44.55_PM.png)

![Screenshot 2023-07-17 at 12.45.10 PM.png](Customizations%20f12d188be12a43cda08c512868ff7e8b/Screenshot_2023-07-17_at_12.45.10_PM.png)

**Fonts:**

```json
	"font": "gotham", // notosans | raleway | merriweather
```

**Language:**

Zogo supports both English and Spanish for SOME modules. To request that the content be served up in Spanish the language property can be set to the US Spanish language code:

```swift
"language": "en-US", // es-US
```

**Buttons:**

![Screenshot 2023-07-18 at 10.26.54 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.26.54_AM.png)

![Screenshot 2023-07-18 at 10.27.38 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.38_AM.png)

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.58_AM.png)

In addition to control of the primary color and the button text color, you also have access to control the border radius of the button and the style of the text.

```json
	"button": {
		"text_style": "uppercase", // lowercase | capitalize
		"border_radius": 8 // measured in pixels, max 30
	}
```

The border radius of buttons can be customized up to 30 pixels, and the text style can be uppercase, lowercase or capitalized.

**End of Module:**

The end of module or eom behavior and messaging is controlled by you. When a user reaches this page there is an optional banner ad space for your utilization which emits a POST message to the parent app (your app). The button on the page (in this example it says “DONE”, and the banner add both emit unique messages you specify and any behavior from these two items is controlled by your parent app.

```json
"end_of_module": {
		"cta_text": "Great Job! You finished!",
		"cta_button_text":  "continue",
		"cta_post_message": "user clicked the cta button",
		"banner_image": "image_url",
		"banner_post_message": "user clicked the banner image"
	}
```

## Backend Controlled Customizations:

These are changes that must be communicated to your CX representative.

### Points

Does the user accumulate/earn points for correct answers? What do points visually look like?

- Enabled by default
- By default a simple XP icon is used, however you can customize that icon to be any image.

### Powered by Zogo

![Screenshot 2023-07-17 at 11.46.07 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.46.07_AM.png)

This emblem shows up on several pages and can be removed for an added fee. Examples of this emblem in context are seen below.

![Screenshot 2023-07-17 at 11.53.17 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.17_AM.png)

![Screenshot 2023-07-17 at 11.53.33 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.33_AM.png)

![Screenshot 2023-07-17 at 11.53.10 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.10_AM.png)

# Customizations

![Screenshot 2023-07-17 at 12.53.13 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.53.13_PM.png)

![Screenshot 2023-07-17 at 12.53.28 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.53.28_PM.png)

![Screenshot 2023-07-17 at 12.53.38 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.53.38_PM.png)

![Screenshot 2023-07-17 at 12.54.50 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.54.50_PM.png)

The Zogo Integration has two types of customizations, ones that are controlled by our backend and ones that are controlled by the data you feed to the iFrame.

## Client Controlled Customizations:

These customizations are passed to the client via a encoded URL parameter. this parameter is called `integration_customizations` These customizations are all purly visual in nature and do not require any input from our backend making tweaking visuals in this integration as simple as possible for implementing a custom solution that fits both your needs and aesthetic.

The `integration_customizations` object should be in the following format:

```json
{
  "colors": {
    "primary": "<ANY HEX COLOR>",
    "header": "<ANY HEX COLOR>",
    "sub_header": "<ANY HEX COLOR>",
    "button": "<ANY HEX COLOR>",
    "background": "<ANY HEX COLOR>",
    "highlight": "<ANY HEX COLOR>"
  },
  "font": "gotham", // notosans | raleway | merriweather
  "button": {
    "text_style": "uppercase", // lowercase | capitalize
    "border_radius": 8 // measured in pixels, max 30
  },
  "language": "en-US", // es-US
  "end_of_module": {
    "cta_text": "Great Job! You finished!",
    "cta_button_text": "continue",
    "cta_post_message": "user clicked the cta button",
    "banner_image": "image_url",
    "banner_post_message": "user clicked the banner image"
  }
}
```

Be advised that if any of these are left blank or null there is fallback behavior to ensure that these elements still have a assigned property, however it is best practice to simply fill out the entire object as seen above.

### Customizations effects

**Colors:**

The color object defines the color pallet of the application. The color properties are as follows:

- primary
  - This is the overall theme color of the app, when non-text color is being applied somewhere it will usually be using this color or a derivative of this color.
- header
  - This color applies to primary text throughout the iFrame.
- sub_header
  - This color applies to secondary/sub header text throughout the iFrame.
- button
  - This color applies to the text of buttons. NOTE: Buttons take on the primary color.
- background
  - This is the overall background color of the app.
- highlight
  - This the border color of the app, it effects items like the snippet card boarders and the border of question answers.

Below is an extreme and unrealistic example of a color customization pattern to demonstrate what the individual colors control.

```json
	"colors": {
		"primary": "#219f15",
		"header": "#e72ce7",
		"sub_header": "#cfda1c",
		"button": "#ff000f",
		"background": "#ccc9c9",
		"highlight": "#ffe5e5"
	},
```

![Screenshot 2023-07-17 at 12.45.29 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.45.29_PM.png)

![Screenshot 2023-07-17 at 12.44.44 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.44.44_PM.png)

![Screenshot 2023-07-17 at 12.44.55 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.44.55_PM.png)

![Screenshot 2023-07-17 at 12.45.10 PM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_12.45.10_PM.png)

**Fonts:**

```json
	"font": "gotham", // notosans | raleway | merriweather
```

**Language:**

Zogo supports both English and Spanish for SOME modules. To request that the content be served up in Spanish the language property can be set to the US Spanish language code:

```swift
"language": "en-US", // es-US
```

**Buttons:**

![Screenshot 2023-07-18 at 10.26.54 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.26.54_AM.png)

![Screenshot 2023-07-18 at 10.27.38 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.38_AM.png)

![Screenshot 2023-07-18 at 10.27.58 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-18_at_10.27.58_AM.png)

In addition to control of the primary color and the button text color, you also have access to control the border radius of the button and the style of the text.

```json
	"button": {
		"text_style": "uppercase", // lowercase | capitalize
		"border_radius": 8 // measured in pixels, max 30
	}
```

The border radius of buttons can be customized up to 30 pixels, and the text style can be uppercase, lowercase or capitalized.

**End of Module:**

The end of module or eom behavior and messaging is controlled by you. When a user reaches this page there is an optional banner ad space for your utilization which emits a POST message to the parent app (your app). The button on the page (in this example it says “DONE”, and the banner add both emit unique messages you specify and any behavior from these two items is controlled by your parent app.

```json
"end_of_module": {
		"cta_text": "Great Job! You finished!",
		"cta_button_text":  "continue",
		"cta_post_message": "user clicked the cta button",
		"banner_image": "image_url",
		"banner_post_message": "user clicked the banner image"
	}
```

## Backend Controlled Customizations:

These are changes that must be communicated to your CX representative.

### Points

Does the user accumulate/earn points for correct answers? What do points visually look like?

- Enabled by default
- By default a simple XP icon is used, however you can customize that icon to be any image.

### Powered by Zogo

![Screenshot 2023-07-17 at 11.46.07 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.46.07_AM.png)

This emblem shows up on several pages and can be removed for an added fee. Examples of this emblem in context are seen below.

![Screenshot 2023-07-17 at 11.53.17 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.17_AM.png)

![Screenshot 2023-07-17 at 11.53.33 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.33_AM.png)

![Screenshot 2023-07-17 at 11.53.10 AM.png](https://zogo-files.s3.amazonaws.com/zogo-integrations-resources/Screenshot_2023-07-17_at_11.53.10_AM.png)

- Going live and getting your real token - TODO
