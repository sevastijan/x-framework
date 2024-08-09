
# X Framework for Triggre

---
The X Framework library combines the Factory design pattern with the Observer pattern. The Factory pattern is used to dynamically create instances of widgets based on their paths, while the Observer pattern allows for real-time monitoring and reaction to events during the widget lifecycle.

## Table of contents

1. [Structure](#Structure)
2. [Setup](#setup)
3. [How to use](#how-to-use)
    - [Init](#init)
    - [Destroy](#destroy)
    - [Events](#events)
    - [Widgets](#widgets)
4. [Create new widgets](#create-new-widgets)

---

## Structure

```

├── /src
│   ├── /core
│   │   ├── WidgetCore.ts
│   │   ├── WidgetManager.ts
│   │   └── types.ts  
│   ├── /exceptions
│   │   ├── WidgetDestroyedError.ts
│   │   ├── WidgetInitializationException.ts
│   │   └── WidgetInstanceNotFoundException.ts   
│   ├── /factories
│   │   ├── IWidgetFactory.ts
│   │   └── WidgetFactory.ts
│   ├── /observers
│   │   ├── IObserver.ts
│   │   └── Observer.ts     
│   ├── /widgets
│   │   ├── IWidget.ts
│   │   ├── Widget.ts        
│   │   ├── a.ts       
│   │   ├── b.ts       
│   │   └── c.ts          
│   └── index.ts             
│
├── /dist
│   └── widget-library.js    
│
├── /browserTester
│   └── index.html              
│
├── package.json             
├── tsconfig.json
├── README.md                    
└── webpack.config.js        
```

## Setup

### Step 1: Install dependencies

To install dependencies run in terminal

```bash 
npm install
```

### Step 2: Build framework

To compile project run in terminal

```bash 
npm run build
```

Script `build` will run webpack and generate `widget-library.js` in directory `dist`.

## How to use

### Init

To init widgets use method `init()` from class `X`

```typescript
const x = new X.default();

x.init(document.getElementById('root'), (error) => {
    if (error) {
        console.error('Initialization failed', error);
    } else {
        console.log('All widgets initialized successfully');
    }
});
```

### Destroy

To destroy elements use method `destroy()` from class `X`

```typescript
x.destroy(document.getElementById('root'));
```

The `destroy()` method deletes the widget instances and their containers, but does not delete the DOM element itself, so you can reinitialize the widgets in the future.

### Events

You can add your own observers to react to widget initialization and destruction events.

Below is a list of available events that you can listen to:

- `init_success`: Triggered when a widget is successfully initialized.
- `init_error`: Triggered when an error occurs during the initialization of a widget.
- `init_complete`: Triggered when the initialization process for all widgets is complete.
- `destroy_complete`: Triggered when all widgets within the target element are destroyed.

#### Example:

```typescript
class TestObserver extends Observer {
    update(event, data) {
        if (event === 'init_success') {
            console.log(`Widget ${data.widgetPath} initialized successfully`);
        }
    }
}

const x = new X();

x.addObserver(new TestObserver());
```

### Widgets

Widgets are classes that inherit from the base class `Widget`. Each widget implements the `init()`, `destroy()`, and can also use the `beforeInit()` and `afterInit()` methods.

## Create new widgets

Creating a new widget requires creating a class that inherits from `Widget` and implements the required methods.

#### Example:

```typescript
import Widget from "./Widget";

class MyWidget extends Widget {
    async init(target: Element, done: (err?: Error) => void) {
        await super.init(target, done);
        target.insertAdjacentHTML('afterbegin', '<div>My Custom Widget Content</div>');
        done();
    }

    destroy() {
        if (this.container) {
            this.container.remove();
        }
        super.destroy();
    }
}

export default MyWidget;
```