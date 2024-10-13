# Profit or Loss Tracker

![Static Badge](https://img.shields.io/badge/Tauri-2.0-%2324C8D8?logo=tauri)
![Static Badge](https://img.shields.io/badge/Svelte-4.2.7-%23FF3E00?logo=svelte)
![Static Badge](https://img.shields.io/badge/TailwindCSS-3.4-%2306B6D4?logo=tailwindcss)

## What is This Application?

This is an extremely niche app for Joey of the Joey Does Tech YouTube channel. This would serve as a pseudo "asset tracker" for his popular series "Profit or Loss"

> Note: This application does utilize the Iconify and Google Fonts API. If you are not connected to the internet, the font will be set to your system font and icons will not display. The app will still function, but it just won't be as pretty.

## How to Use This App

- Grab the .exe file below

### [JDTInstaller](installers)

- Click on the .exe file to go to the file.
- Click on the three dots on the right side of the screen.
  ![installer](installscreen.png)
- Click download.

## Code Signing and Windows Installer Warnings

- When you install this app it will say that SmartScreen is protecting your computer. That is because the code is not signed.

  - _Why don't you just sign your code?_
    - That is a $270/year fee that I do not want to spend on such a pet project.
  - _Does that mean this software is not safe?_
    - No, it just means that I have not gotten the code signature.
  - _What is a code signature?_
    - Code signatures are what verifies a piece of software is developed by the person who is distributing it.
    - This really matters if you do not download this from the source. This GitHub repository should be the only place you ever download this application from.

- **Do not use any .exe or .msi file that is not downloaded directly from this repository or [built locally](#building-the-app-locally)**

- You can ignore the warnings given by Windows as long as you are using a safe installer downloaded directly from this repo.

## Building the App Locally

> This is not a required step! This is only if you want to avoid the installer warnings. You may download the installer directly by following the instructions located **[here](#jdtinstaller)**!

- [Make sure you meet the prerquisites to build Tauri applications](https://v2.tauri.app/start/prerequisites/)
- Create a directory on your computer
- From the command line enter the directory where you want the project to live and enter the following command
  - `git clone https://github.com/AKCodeWorks/profit-loss-jdt.git`
- After the repo is cloned, enter `npm install`
- Once dependencies are installed enter `npm run tauri build`
- When that is complete it will tell you where the executables are located, you can run them from there to install the application.

## Contributing to the Project

Feel free to submit a detailed pull request if you want to contribute to the project. If you do not include details as to why you are submitting the pull request it will be automatically rejected.

This application was made simple by design. External APIs such as the eBay API and/or other selling platform APIs were not requested to be included. All PRs involving any external API will be automatically rejected.

## Support Joey Below

- [YouTube](https://www.youtube.com/c/JoeyDoesTech)
- [Twitch](https://twitch.tv/joeydoestech)
- [eBay Store](https://ebay.co.uk/str/joeydoestech)
- [Instagram](https://www.instagram.com/joeydoestech)
- [Website](https://www.joeydoestech.com)

## Support the Developer Here

<a href="https://buymeacoffee.com/akcoding916" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>
