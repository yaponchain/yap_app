# YAP ON CHAIN - LEND & BORROW

## Description

This project is a Meteor application that utilizes various technologies and libraries to provide a robust and scalable platform. The application is structured into different modules to facilitate maintenance and scalability.

## Project Structure

The project structure is as follows:

```
.env
.gitignore
.meteor/
package.json
client/
imports/
private/
public/
server/
```

### Main Directories

- **client/**: Contains client-side files such as HTML, CSS, and JavaScript.
- **imports/**: Contains imported modules, including APIs, initialization, and UI.
- **server/**: Contains server-side files, including the main entry point.
- **public/**: Contains public files such as fonts and images.
- **private/**: Contains private files that are not accessible to the client.

## Technologies Used

- **Meteor**: The main framework used to build the application.
- **MongoDB**: NoSQL database used to store data.
- **Blaze**: Template library used to render the UI.
- **React**: Used in some parts of the application for reactive components.
- **FlowRouter**: Used for client-side routing.
- **Less**: CSS preprocessor used for styling.
- **Mocha**: Testing framework used for unit and integration tests.
- **Axios**: Used to make HTTP requests.

## Architecture

The project architecture is based on a modular structure, where each module is responsible for a specific functionality. Below are some of the main modules and their responsibilities:

### API Modules

- **collections**: Manages MongoDB collections.
- **monad**: Contains methods related to integration with the Monad API.
- **terms**: Manages the terms and conditions of the application.
- **users**: Manages the users of the application.

### Initialization

- **startup/both**: Contains code that runs on both the client and the server.
- **startup/client**: Contains code that runs only on the client.
- **startup/server**: Contains code that runs only on the server.

### UI

- **templates**: Contains HTML and JavaScript templates for the user interface.
- **components**: Contains reusable UI components.

## Setup and Execution

### Prerequisites

- Node.js 22.14.0
- MeteorJS 3.1.2

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yaponchain/yap_app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd yap_app
   ```
3. Install the dependencies:
   ```sh
   meteor npm install
   ```

### Running the Application

To start the application, run the following command:
```sh
meteor
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Environment variables are configured in the .env file. Make sure to set the following variables:

- `MONAD_URL`: URL of the Monad API at Blockvision.
- `MONAD_KEY`: API key for authentication with the Monad API at Blockvision.

## Testing

To run the tests, use the following command:
```sh
meteor npm test
```

## Contribution

This project is owned by YAP ON CHAIN, designed and developed by NAD members for Monad evm/accathon.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.