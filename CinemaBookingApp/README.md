
# Cinema Booking App 🎬

An easy-to-use mobile app for browsing movies, selecting showtimes, and booking cinema seats. The app ensures a **first-come, first-served** system for locking seats, giving users a fair and smooth booking experience.

---

## 1.0 Description

The Cinema Booking App allows users to:

- Browse movies and showtimes  
- Choose their preferred cinema (e.g., Mid Valley, KLCC, One Utama)  
- Pick available seats with a real-time **seat-locking feature**  
- Confirm bookings quickly and securely  

The app is built with **React Native**, using **Redux Toolkit (RTK)** for state management and the **Atomic Design Pattern** for UI components.  

---

## 2.0 Features

- Browse movies and showtimes  
- Select cinema location  
- Real-time seat selection and locking  
- Confirm bookings  
- Food & beverage menu for pre-ordering  
- User profile and membership points  

---

## 3.0 Prerequisites

Before running the project, make sure you have:

1. Node.js (v16+ recommended) – https://nodejs.org/  
2. Yarn (optional, recommended) – npm install -g yarn  
3. React Native CLI – npm install -g react-native-cli  
4. Android Studio (for Android) or Xcode (for iOS)  
5. Git – https://git-scm.com/  

---

## 4.0 Getting Started

**4.1 Clone the Repository**  

git clone https://github.com/<username>/<repository-name>.git  
cd <repository-name>  

**4.2 Install Dependencies**  

npm install  
or  
yarn install  

**4.3 Install iOS Pods (if using iOS)**  

cd ios  
pod install  
cd ..  

---

## 5.0 Running the App

**5.1 Start Metro Bundler**  

npx react-native start  

**5.2 Run on Android**  

Make sure an emulator is running or a device is connected:  

npx react-native run-android  

**5.3 Run on iOS**  

Make sure a simulator is running or a device is connected:  

npx react-native run-ios  

---

## 6.0 Troubleshooting

- Pods error (iOS): cd ios, then pod install --repo-update, then cd ..  
- Metro bundler not refreshing: npx react-native start --reset-cache  
- Ensure Android SDK and Xcode command-line tools are correctly set.  

---

## 7.0 Notes

- Update `.env` (if exists) with your API keys or environment variables.  
- Assets like images and fonts are stored in the `assets` folder.  
- State management is handled with Redux Toolkit, UI uses Atomic Design Pattern.  
