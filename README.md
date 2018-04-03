# carrier-tracking-customer
Coureon Tracking App

## Installation

### Node version Manager (nvm) usage is recommended

GitHub Repository: https://github.com/creationix/nvm

Install NVM on Ubuntu: http://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-for-node-js-on-ubuntu-14-04-lts/


```
$ nvm install stable
$ npm install
```

If you already have an existing node_modules directory, delete it prior to the new installation.
```
$ nvm install stable
$ rm -R node_modules
$ npm cache clean
$ npm install
```

Maybe a rebuild of node-sass is needed:

```
$ npm rebuild node-sass
```

## Usage

```
$ ENV=staging npm start dev
```

### Hints

**do not work in the /public folder, change only files in /assets**

**gulp** will optimize the files and move them to /public

### CSS Coding Conventions and Guidelines
All variables and mixins must use the ***hyphen-case*** (with hyphens as separators).

```
.area {
  &-panel { ... }
}
```

#### BEM (Block, Element, Modifier) naming convention for CSS classes
We use the [BEM](http://getbem.com/introduction/) approach to write css.

##### Example Block

```
.block {
  &__element { ... }
  &--modifier { ... }
}
```

##### Example Element
```
.header {
  &__logo { ... }
}
```

##### Example Modifier
```
  .button button--large button--success { ... }
```

## Info
This repository is based on [Frontend Starter](https://github.com/project-a/frontend-starter) by Project A Ventures.
