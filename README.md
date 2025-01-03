## About
The app displays airline ticket search results and offers real-time filtering and sorting options.
It utilizes JSON data for a predefined ticket search from Moscow to London and back on a specific date. 

## Features
- Search results are displayed in sets of 2 items. User can increase the number by 2 at each button click;
- User can sort flights by price (ascending/descending order) or by travel time;
- User can filter flights by transfer count, price range, and airline;
- Price range inputs displays (as placeholders) the minimum and maximum prices for flights compatible with active filters.
- Users can select an airline from a list that only displays airlines compatible with active filters.
- If the selected airline becomes incompatible after applying new filters, it will be deselected.
- The app displayes the message if the data in loading, if no flights are available after filtering, or when the error occurs.
- If there are no flights after filtering the app shows an according message.
- Responsive design.

## Technologies
- TypeScript, React, React Router, CSS, HTML, BEM.
- Built with Webpack

## How to run locally

`npm start` - starts the app in development mode using Webpack DevServer. The application will be accessible at http://localhost:3000 by default.

`npm run build:dev` - builds the app in development mode and outputs the files to the `build` folder.

`npm run build:prod` - builds the app in production mode and outputs the optimized files to the `build` folder.
