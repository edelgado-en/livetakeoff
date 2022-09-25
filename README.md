# LiveTakeOff

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Quick Features

- React 18
- [React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html) + Fetch-As-You-Render Query Prefetching
- React Router V6
- TailwindCSS
- HeadlessUI
- Heroicons
- Typescript

## Important Notes

- All business logic should be in the backend. The resources should be returned in the form that they are meant to be used.
  For example: Instead of return a numerical value for user access level, return booleans (ie. isTester, isAdmin, etc.). The client does not need to know how to calculate those values.

- Only save state in an RTK slice when you actually need to share states between components. Otherwise just use useState and pass it down via simple props.

- When creating new files, make sure they have the extension .ts or .tsx. Let Typescript use INFERENCE as much as possible; there is no need to add unnecessary types that provide no value. Here is an example of inference where there is no need to add a type.

  `const options = [ { value: 1, label: "Me" }, { value: 2, label: "Super Alejandro" }, { value: 3, label: "Rebeca Castillo" }, { value: 4, label: "Sandra Manager" }, ]`

- Don't add types/interfaces in a standalone file. Add them wherever you are actually using them. If you need to use the type somewhere else (which is not common because of inference) just make it public and export it. Just use interfaces for the most part. Here a quick explanation of the difference between interface and type:

  - Interfaces are basically a way to describe data shapes, for example, an object.

  - Type is a definition of a type of data, for example, a union, primitive, intersection, tuple, or any other type.

- Whenever you are building an actual reusable component like a switch button, put it in the components top level folder, otherwise put it where you are actually using it.

- This project uses headless ui for a component library. You don't have to use it but it is there for your convenience. Headlessui is a set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS. DO NOT add other components libraries like Reactstrap or React-Bootstrap

- This project uses Heroicons, which is built by the same creators of Tailwind. Refers to heroicons.com. Do not use Fontawesome

- When adding new routes to App.js, ensure to use React Lazy to avoid loading unnecessary bundles and increase performance

- We are using Axios as an http client. HttpService.js creates an abstraction where the baseUrl is specified, so that you don't have to add it every time you make an API call. There is no need for you to modify the url with an interceptor because in the same file you can see an interceptor that adds the queue information and the token or whatever else you need. You can customize it based on the incoming url being intercepted.

- We are using React-Toastify to add notifications (for success or error messages when making an API call). It is already configured so you just need to call it like this:

  `import { toast } from 'react-toastify';`

  ...

  `toast.success('Your message here');`

  `toast.error('Your message here');`

- Dont use string literals. Use enums instead.

- We are using RTK thunks to handle async API calls that need to update RTK store. Do not use Sagas. We might switch to react-query later on. Keep in mind that react-query is an abstraction on top of RTK, so it will essentially replace it.

- Do not add css files. If you need to add some css class because you are using some library that doesn't support Tailwind (like in the case of React-Select), then simply add it to the existing App.css file.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
