# European university search engine app

This search engine was created as part of the [Information Processing and Retrieval class (Processamento e Recuperação de Informação)](https://sigarra.up.pt/feup/pt/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=486244) at [the Faculty of Engineering, University of Porto (FEUP - Faculdade de Engenharia da Universidade do Porto)](https://sigarra.up.pt/feup/pt/web_page.inicial).

## How to run

It is necessary to complete all steps defined in [Run the app](#run-the-app) and [Run the necessary services](#run-the-necessary-services).

### Run the app

- Install NodeJS (20.9.0 or higher)
- Install [pnpm](https://pnpm.io/) by running `npm i -g pnpm` in the terminal
- Position into the `app/` directory
- In the terminal run `pnpm i` to install all dependancies
- In the terminal run `pnpm run dev` in development mode
  - Alternatively for the full website experience run `pnpm run build`, after it's finished run `pnpm start`
- Open `localhost:3000`, or whichever url was provided in the terminal, in your browser to view the app

### Run the necessary services

- Install Docker
- Positions into the `milestone_2/` directory
- Run `startup.sh` script and follow it's instructions

## Usage

The easies way to start using the app is to open it and start searching as if you were using the Google search engine.
