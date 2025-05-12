# TC-3202 [IntelCor]

![Project Banner](https://github.com/user-attachments/assets/7eb38b29-aded-479a-b923-1d362f12e843)

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage Instructions](#usage-instructions)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Chagelog](#changelog)
- [Acknowledgments](#acknowledgments)
- [License](#license)

---

## Introduction

IntelCor is a web-based, AI-powered room design assistant that streamlines interior design planning by providing intelligent, automated recommendations tailored to a user's specific room layout and design preferences. The system addresses the challenge of overwhelming design choices by delivering optimized product suggestions and accurate quantity estimates. Users input necessary details, and the system utilizes a machine learning model to select suitable products from a curated dataset.

## Project Overview

IntelCor was developed in response to the difficulties users face when trying to choose the most appropriate design elements for their rooms due to the overwhelming amount of options. Targeted towards homeowners, interior designers, and retailers, the system automatically recommends the best-fitting products and estimates the required quantity based on a 2D floor plan and user inputs. Real-world applications include home renovation planning, professional interior design support, and enhanced retail experiences for hardware or furniture stores through AI integration.

## Objectives

- Develop an AI-powered assistant to address the challenge of selecting interior design elements.
- Implement features for AI-driven personalized product design recommendations.
- Test and validate the system's performance, accuracy, efficiency, and usability.

## Features

- **Room Data Input:** Upload 2D floor plans and enter room details such as size.
- **AI-Powered Recommendations:** Smart suggestions for flooring, tiles, light fixtures, and furniture.
- **Admin Dashboard:** Manage product data and monitor system activity.
- **Quantity Estimation:** Predict the number of items needed based on room size and layout.

## Technologies Used

- **Programming Languages:** Python, JavaScript
- **Frameworks/Libraries:** React.js, FastAPI, TensorFlow/Scikit-learn
- **Databases:** Appwrite
- **Authentication:** Supabase
- **Other Tools:** Git, Visual Studio Code

## Setup and Installation

Step-by-step instructions for setting up the project locally.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thebadsektor/tc3202-3a-4.git
   ```
2. **Install dependencies:**
   - If using `npm`:
   ```bash
   npm install
   ```
   - If using `pip` (for Python projects):
   ```bash
   python -m venv .venv
   source venv/Scripts/activate
   pip install -r requirements.txt
   ```
3. **Configure environment variables (if any)**: Provide instructions for setting up .env files or any other required configurations.
   ```bash
   source venv/Scripts/activate
   ```
4. **Run the project:**
   - For web projects:
   ```bash
   npm run dev
   ```
   - For backend services:
   ```bash
   cd src/
   uvicorn main:app --reload
   ```

**Note:** If your project has external depencies like XAMPP, MySQL, special SDK, or other environemnt setup, create another section for it.

## Usage Instructions

When the Landing Page is loaded, the user will be greeted with a clean and intuitive interface. The landing page provides an overview of the project, its purpose, and the features it offers. Users can easily navigate to the main system by clicking the login or sign up buttons.

![Image](https://github.com/user-attachments/assets/d11e7575-b02a-4126-aaa8-f0eee0c3ecd5)

Upon successful login or sign up, the user will be redirected to the main system. The main system provides a user-friendly interface for interacting with the system. Users can input their room details, such as size, and the system will provide personalized product recommendations based on their preferences.

![Image](https://github.com/user-attachments/assets/1d26f12c-ac34-4220-a352-7fb741729d04)

After all fields are filled, the user can click the "Get Recommendations" button to receive personalized product recommendations based on their input.

## Project Structure

Explain the structure of the project directory. Example:

```bash
.
├── .gitignore
├── .vscode/
│   └── extensions.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public/
│   ├── intelcor_favicon.png
│   ├── intellcor.png
│   ├── login_bg.png
│   ├── no-results.png
│   └── vite.svg
├── README.md
├── src/
│   ├── App.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── Components/
│   │   ├── AdminPage.jsx
│   │   ├── Categories/
│   │   │   ├── CategoryModal.jsx
│   │   │   └── CategoryTableRow.jsx
│   │   ├── CategoriesTable.jsx
│   │   ├── CookiePolicy.jsx
│   │   ├── DashboardTab.jsx
│   │   ├── ForgotPassPage.jsx
│   │   ├── LandingPage/
│   │   │   ├── AboutSection.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── DemoSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Icons.jsx
│   │   │   └── StylesSection.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Products/
│   │   │   ├── ProductModal.jsx
│   │   │   └── ProductTableRow.jsx
│   │   ├── ProductsTab.jsx
│   │   ├── ProductsTable.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── shared/
│   │   │   ├── ConnectionHandler.jsx
│   │   │   ├── DashboardSkeletonLoading.jsx
│   │   │   ├── LogoutConfirmationModal.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PolicyHeader.jsx
│   │   │   ├── SkeletonLoading.jsx
│   │   │   ├── Table/
│   │   │   │   ├── TableHeader.jsx
│   │   │   │   └── TableRow.jsx
│   │   │   └── Toast.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── Styles/
│   │   │   ├── StyleModal.jsx
│   │   │   └── StyleTableRow.jsx
│   │   ├── StylesTable.jsx
│   │   ├── TermsOfService.jsx
│   │   ├── UserPage/
│   │   │   ├── DesignForm.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── StylesCarousel.jsx
│   │   │   └── Toast.jsx
│   │   ├── UserPage.jsx
│   │   ├── Users/
│   │   │   ├── UserModal.jsx
│   │   │   └── UsersTableRow.jsx
│   │   ├── UsersTab.jsx
│   │   └── UsersTable.jsx
│   ├── floorplan_classifier.py
│   ├── index.css
│   ├── main.jsx
│   ├── main.py
│   ├── models/
│   │   ├── attrs/
│   │   │   ├── dataframe.joblib
│   │   │   ├── encoder.joblib
│   │   │   ├── scaler.joblib
│   │   │   └── vectorizer.joblib
│   │   ├── furniture_recommender.h5
│   │   ├── keras_model.h5
│   │   └── labels.txt
│   ├── products_recommender.py
│   └── utils/
│       ├── appwriteConfig.js
│       ├── appwriteService.js
│       ├── connectionHandler.js
│       ├── floorPlanAnalyzer.js
│       ├── navigationControl.js
│       ├── ScrollToTop.jsx
│       └── supabaseClient.js
├── tailwind.config.js
└── vite.config.js
```

## Contributors

List all the team members involved in the project. Include their roles and responsibilities:

- **Dean Martin M. Mabulay:** Full-Stack Lead Developer, Machine Learning Developer
- **Joyce Ann v. Cuala:** UI/UX Designer, Documentarian
- **Dondon R. Esquivel:** Backend Developer, Machine Learning Specialist
- **Leorogel D. Oca:** Backend Developer, Documentarian

## Project Timeline

Outline the project timeline, including milestones or deliverables. Example:

- **Week 1-2 (Feb 3)**: Concept Paper Proposal
- **Week 3-4 (Feb 25)**: Consultation
- **Week 5-6 (March 10)**: Plan user journey and refinement.
- **Week 7 (March 12)**: Research
- **Week 8 (March 18)**: Repository Preperation & Research
- **Week 9-11 (March 25)**: End-to-End Web App Development and Machine Learning Integration
- **Week 13-14 (April 14)**: Initial Project Presentation (Replacement for Initial Defense)
- **Week 15-17 (April 24)**: Front-end Development, Fine-tuning, and Documentation
- **Week 18-20 (May 13)**: Final Project Presentation

## Changelog

### [Version 1.0.0] - 2025-04-13

- Initial release of the project.
- Added basic functionality for product recommendations.
- Implemented machine learning model for product selection.

### [Version 1.1.0] - 2025-05-08

- Improved user interface for Laanding Page.
- Enhanced floor plan analysis for product suggestions.
- Updated project documentation with setup instructions.

### [Version 1.2.0] - 2025-05-12

- Added Gemini 2.0 Flash API for Products Quantity and Approxiamate Size Recommendation.
- Added front-end elements to improve UI/UX consistency.

## Acknowledgments

We are grateful for the guidance of our professors, Mr. Gerald Villaran, Ms. Mary Grace Guillermo, Mr. James Geuvarra, and Ms. Joville Avila. We also acknowledge obtaining datasets from various online platforms, including IKEA andAmazon, which were used for this project.

This project was built from [Original Project Name](https://github.com/username/original-repo), created by [Contributors](#contributors). You can view the original repository [here](https://github.com/thebadsektor/tc3202-3a-4).

## License

This project uses the MIT License. Refer to the [LICENSE](https://github.com/thebadsektor/tc3202-3a-4/blob/main/LICENSE) file for more details.
