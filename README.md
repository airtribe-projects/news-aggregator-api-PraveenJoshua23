## NewAggregatorApi

This API powers a news aggregator application that allows users to personalize their news feed based on their preferences.

### Features

  * **User Registration and Login:**

      * `POST /register`: Create a new user account.
      * `POST /login`:  Authenticate a user and obtain an authentication token.

  * **User Preferences and API Authentication:**

      * `GET /preferences`: Retrieve the logged-in user's preferences.
      * `PUT /preferences`: Update the logged-in user's news preferences (e.g., categories, languages).
      * All endpoints (except `/register` and `/login`) require authentication.  You can include an authentication token in the `Authorization` header of your requests.

  * **Fetching News:**

      * `GET /news`: Fetch news articles tailored to the logged-in user's preferences.

  * **Other Features:**

      * `POST /news/:id/read`: Mark a news article as read.
      * `POST /news/:id/favorite`: Mark a news article as a favorite.
      * `GET /news/read`: Retrieve all read news articles for the logged-in user.
      * `GET /news/favorites`: Retrieve all favorite news articles for the logged-in user.

### Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/NewAggregatorApi.git
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # Or yarn install, depending on your package manager
    ```

3.  **Configure the API:**

      * Set up database connection (e.g., MongoDB).
      * Configure API keys for any third-party news sources.

4.  **Start the server:**

    ```bash
    npm start 
    ```

### API Endpoints

**User Registration and Login**

  * **`POST /register`**

      * Request body:
        ```json
        {
          "email": "your_email",
          "password": "your_password",
          // ... other user details
        }
        ```
      * Response:
          * `201 Created`: User successfully registered.
          * `400 Bad Request`: Invalid request data or username already exists.

  * **`POST /login`**

      * Request body:
        ```json
        {
          "email": "your_email",
          "password": "your_password" 
        }
        ```
      * Response:
          * `200 OK`: Login successful, returns an authentication token.
          * `401 Unauthorized`: Invalid credentials.

**User Preferences**

  * **`GET /preferences`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: Returns user preferences.
          * `401 Unauthorized`: Missing or invalid authentication token.

  * **`PUT /preferences`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Request body:
        ```json
        {
          "categories": ["technology", "business", "sports"],
          "languages": ["en", "fr"],
          // ... other preferences
        }
        ```
      * Response:
          * `200 OK`: Preferences updated successfully.
          * `400 Bad Request`: Invalid request data.
          * `401 Unauthorized`: Missing or invalid authentication token.

**News Articles**

  * **`GET /news`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: Returns a list of news articles based on user preferences.
          * `401 Unauthorized`: Missing or invalid authentication token.

  * **`POST /news/:id/read`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: News article marked as read.
          * `401 Unauthorized`: Missing or invalid authentication token.
          * `404 Not Found`: News article not found.

  * **`POST /news/:id/favorite`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: News article marked as favorite.
          * `401 Unauthorized`: Missing or invalid authentication token.
          * `404 Not Found`: News article not found.

  * **`GET /news/read`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: Returns a list of read news articles.
          * `401 Unauthorized`: Missing or invalid authentication token.

  * **`GET /news/favorites`**

      * Headers:
          * `Authorization: Bearer <your_auth_token>`
      * Response:
          * `200 OK`: Returns a list of favorite news articles.
          * `401 Unauthorized`: Missing or invalid authentication token.

### Technologies Used

  * **Node.js:** Server-side runtime environment.
  * **Express.js:** Web framework for Node.js.
  * **MongoDB (or your preferred database):**  For data persistence.
  * **(Optional) Third-party news APIs:**  To fetch news articles from various sources.


### License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/url?sa=E&source=gmail&q=LICENSE) file for details.
