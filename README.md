SGV

---

Sgv is A simple CLI for scaffolding Vue.js(v2) projects(ts).

# Getting Started

```sh
npm i -g sgv-cli
sgv init <project-name>
cd <project-name>
npm i
npm run dev
```

# Features

- [Build and Remove Page](#build-and-remove-page)
- [Build and Remove Component](#build-and-remove-component)
- [Build Service](#build-service)
- [Build Method Of Service](#build-method-of-service)

## Build and Remove Page

If you want add new page

```sh
sgv build -p <page-name>
```

If you want remove existing page

```sh
sgv remove -p [page name]
```

## Build and Remove Component

If you want add new component

```sh
sgv build -c <component-name>
```

If you want remove existing component

```sh
sgv remove -c <component-name>
```

## Build Service

```sh
sgv build -s <service-name>
```

## Build Method Of Service

```sh
sgv build -s <service-name> -f <method-name>
```

# help

```sh
sgv --help
```
