# Deals Scraper README

## Introduction

Deals Scraper is a web application that allows users to scrape deals from different online food stores and display them based on the user's locality and store outlet. This README provides an overview of the project, its features, and instructions for setting it up and running.

## Features

- Scrapes deals from various online food stores
- JWT Authentication middleware for protected routes
- Filters deals based on the user's locality and store outlet
- Supports client-server architecture
- Built with the MERN stack (MongoDB, Express.js, React.js, Node.js)

## Major Libraries used

- express.js
- puppeteer (For Scraping purpose)
- mongoose (To connect with mongoDB)
- body-parser (To parse req body and url)
- helmet (To add necessary security headers)
- jsonwebtoken (To sign and verify JWT tokens)

## Prerequisites

Before running the Deals Scraper application, make sure you have the following software installed:

- Node.js (v17 or above)
- MongoDB
- npm (Node Package Manager)
- Docker (for backend deployment)

## Installation

1. Clone the repository:
```
git clone https://github.com/SugarAssignment/backend
```

3. Build and run the Docker container for the backend:
```
docker build -t deals-scraper-backend .
docker run -p 5000:5000 -d deals-scraper-backend
```


## API Reference

1. ### Auth Route

* #### Register new user

```http
  POST /auth/register
```
Body
```JSON
{
    "username": "henish9045",
    "password": "12345678",
    "city": "Ahmedabad",
}
```
Response
```JSON
{
    "username": "henish9045",
    "city": "Ahmedabad",
    "createdAt": "2023-06-19T04:32:11.746Z",
    "updatedAt": "2023-06-19T04:32:11.746Z",
    "_id": "648fda91622fb2ffd62eaa7a",
    "__v": 0
}
```

* #### Login user

```http
  POST /auth/login
```
Body
```JSON
{
    "username": "henish9045",
    "password": "12345678",
}
```
Response
```JSON
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDhmZGE5MTYyMmZiMmZmZDYyZWFhN2EiLCJ1c2VybmFtZSI6ImhlbmlzaDkwNDUiLCJpc0FwcERhdGEiOmZhbHNlLCJjaXR5IjoiQWhtZWRhYmFkIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0xOVQwNDozMjoxMS43NDZaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0xOVQwNDozMjoxMS43NDZaIiwiX192IjowLCJpYXQiOjE2ODcxNDkzMzMsImV4cCI6MTY5NDkyNTMzM30.uGNc0wdzP02yCLzoO_OTHy4B8FdbmV9r7kvDtm5gs9I",
    "_id": "648fda91622fb2ffd62eaa7a",
    "username": "henish9045",
    "city": "Ahmedabad",
    "createdAt": "2023-06-19T04:32:11.746Z",
    "updatedAt": "2023-06-19T04:32:11.746Z",
    "__v": 0
}
```

* #### Update city and outlet of user

```http
  PATCH /auth/user
```
Headers
| Header             | Value                 |
| :----------------- | :-------------------- |
| Authorization      | Bearer YOUR_JWT_TOKEN |

Body
```JSON
{
    "city": "Mehsana",
    "outlet": "Radhanpur Road"
}
```
Response
```JSON
{
    "_id": "648fda91622fb2ffd62eaa7a",
    "username": "henish9045",
    "city": "Mehsana",
    "createdAt": "2023-06-19T04:32:11.746Z",
    "updatedAt": "2023-06-19T04:40:28.927Z",
    "__v": 0,
    "outlet": "Radhanpur Road"
}
```

2. ### Store Data

* #### Get all store data

```http
  GET /store
```

Response
```JSON
[
    {
        "_id": "648947348383e448ceb27dc8",
        "storeName": "La Pino'z Pizza",
        "image": "https://www.uengage.in/images/addo/logos/logo-5-1600769708.png",
        "totalCities": 190,
        "totalOutlets": 496
    }
]
```

* #### Get all offers of particular city and outlet

```http
  GET /store/offer?city=CITY_NAME&outlet=OUTLET_NAME
```

| Parameter     | Description                 | Example          |
| :------------ | :-------------------------- | :--------------- |
| CITY_NAME     | City name from database.    | Ayodhya          |
| OUTLET_NAME   | Outlet name from that city. | Pushraj Chauraha |

Example URL = https://api-sugarwallet.onrender.com/store/offers?city=Ayodhya&outlet=Pushraj Chauraha


Response
```JSON
[
    {
        "offer": "50% Off on orders above Rs.200 for New Users\nNot valid on BOGO, Classic Pizzas, Beverages, Slash Menu",
        "promo": "  LPNEW50",
        "url": "https://lapinozpizza.in/order/pushraj-chauraha-ayodhya"
    },
    {
        "offer": "Get Flat Discount of Rs.75 on Minimum Billing of Rs.399. Cannot be clubbed with any other offers. Not Valid on BOGO, Classic maniacs pizza , Beverages and Combos",
        "promo": "  LPN75",
        "url": "https://lapinozpizza.in/order/pushraj-chauraha-ayodhya"
    },
    {
        "offer": "Get Flat Discount of Rs.100 on Minimum Billing of Rs.599. Cannot be clubbed with any other offers. Not Valid on BOGO, Classic maniacs pizza , Beverages and Combos",
        "promo": "  LPN100",
        "url": "https://lapinozpizza.in/order/pushraj-chauraha-ayodhya"
    }
]
```


## Contact

For any inquiries or suggestions, please contact the project maintainer:

- Email: henishpatel9045@gmail.com
This README provides a brief overview of the Deals Scraper project. For detailed documentation and technical information, please refer to the project's source code and documentation files.

Happy scraping!
