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
> * Pivotal Tracker

## API End Points
> * POST auth/signup/
> * POST /auth/sigin/
> * GET /accounts/
> * POST /accounts/
> * PATCH /accounts/accountNumber/
> * DELETE /accounts/accountNumber/
> * POST transactions/accountNumber/debit
> * POST transactions/accountNumber/credit
