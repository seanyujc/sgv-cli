SGV
--------------

SGV(Smart Grand Visual) is a scaffolding of Vue projects(typescript).

# Getting Started

```sh
npm i -g sgv-cli
sgv init <project name>
cd <project name>
npm i
npm run dev
```

# Features

- [Getting Started](#getting-started)
- [Features](#features)
  - [Initialize a project](#initialize-a-project)
  - [Build and Remove Page](#build-and-remove-page)
  - [Build and Remove Component](#build-and-remove-component)
  - [Build Service](#build-service)
  - [Build Function Of Service](#build-function-of-service)
- [help](#help)

## Initialize a project

```
sgv init <project name>
```

In this process, you can choose PC or mobile  

## Build and Remove Page

If you want add new page  

```sh
sgv build -p <page name>
```

If you want remove existing page.(todo)  

```sh
sgv remove -p [page name]
```

## Build and Remove Component

If you want add new component

```sh
sgv build -c <component name>
```

If you want remove existing component.(todo)  

```sh
sgv remove -c <component name>
```

## Build Service

```sh
sgv build -s <service name>
```

## Build Function Of Service

```sh
sgv build -s <service name> -f <function name>
```
Step1:
```sh
? What request methods will you use in service user? (Use arrow keys)
❯ GET 
  POST 
  DELETE 
  PUT 

```
Step2:
```
? Do you want to provide a new path? (/logout) 
```
If there are multiple modules:
```
? Which module does this path belong to? (Use arrow keys)
❯ api 
  user
```
If there is more than one host.
```
? Which host should this function access? (Use arrow keys)
❯ default 
  user
```
Step3:
```
? Do you want to add some parameters of this function? (y/N) 
```
If choose Yes:
```
? Please enter parameter name: userName
? Please choose a valid parameter type: 
  1) string
  2) number
  3) any
  Answer: 1
```
If you want to continue adding, please type yes.
```
? Please enter a valid parameter type: StringKeyword
? Do you want to continue adding? (y/N) 
```
# help

```sh
sgv --help
```
