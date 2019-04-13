# conquext.github.io
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals.

[![Build Status](https://travis-ci.org/conquext/conquext.github.io.svg?branch=develop)](https://travis-ci.org/conquext/conquext.github.io.svg?branch=develop) [![Coverage Status](https://coveralls.io/repos/github/conquext/conquext.github.io/badge.svg?branch=develop)](https://coveralls.io/github/conquext/conquext.github.io?branch=develop)

## Features
#### Users
* Users can signup and signin to the application
* Users can create a bank account

#### Cashiers (Staff)
* Cashiers can credit an account
* Cashiers can debit an account

#### Admin (Staff)
* Admin can activate an account
* Admin can deactivate an account
* Admin can promote a staff to an admin
* Admin can delete an account

## Installation
To get the application running follow this steps:
* Install NodeJs on your local machine
* Clone the repository $ git clone https://github.com/conquext/conquext.github.io.git
* Install npm dependencies by running npm install

#### Testing
>Run npm run test to run server side tests

## Technologies
#### FrontEnd
> * Html
> * Css

#### Backend
> * NodeJS 
> * Express JS 
> * ESLint 
> * Mocha/Chai

#### DevOps
> * Git
> * Travis CI
> * Coveralls
> * Postman

#### Project Management
> * Pivotal Tracker https://www.pivotaltracker.com/n/projects/2321255

## API End Points

| METHOD        | DESCRIPTION   | ENDPOINTS  |
| ------------- |:-------------:| -----:|
| POST      | `/api/v1/auth/signup` | Register a new user |
| POST      | `/api/v1/auth/login` | Sign in a user |
| GET      | `/api/v1/users` | Return list of all users |
| GET      | `/api/v1/users/:id` | Return a specific user |
| PUT      | `/api/v1/USERS/:id` | Update a user's profile |
| PATCH      | `/api/v1/USERS/:id` | Promote a user's status |
| DELETE      | `/api/v1/USERS/:id` | Delete a user |
| POST      | `/api/v1/accounts` | Create a new account |
| GET      | `/api/v1/accounts` | Return list of all accounts |
| GET      | `/api/v1/accounts/:id` | Return a specific account |
| PATCH      | `/api/v1/accounts` | Update bank account status or type |
| DELETE      | `/api/v1/accounts` | Delete a bank account |
| POST      | `/api/v1/transactions` | Create a new credit or debit transaction |
| GET      | `/api/v1/transactions` | Return all transactions |
| GET      | `/api/v1/transactions/:id` | Return a specific transaction |

