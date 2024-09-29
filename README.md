# Project Title

#### Node.js CRUD Operations


# Setup

## MongoDB

Setup MongoDB

* Create a Database with name "EC_CITY_DB"


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_URL` - Contains the mongodb URI (Refer the .env_example file)


## Run Locally

Clone the project

```bash
  git clone https://github.com/ryalamanna/EC_NODE_TASK.git
```

Go to the project directory

```bash
  cd EC_NODE_TASK
```

Install dependencies

```bash
  npm install
```

Seed the database

```bash
  node seed.js
```

Start the server

```bash
  npm run start
```