# TODO List for Chemical Visualizer Fixes

## 1. Fix Profile Page User Details
- Modify ProfilePage.js to display user details from auth context instead of API call
- Remove API fetch and use auth.username, etc. directly

## 2. Fix Line Graph in Charts
- Update Charts.js to accept 'summary' and 'rawData' props
- Prepare chartData from rawData (e.g., labels: Equipment Name, values: Flowrate)
- Ensure both bar and line charts render correctly

## 3. Make ChemSight Logo Clickable
- Update Header.js to make the logo and title clickable, redirect to '/'

## 4. Test Changes
- Run the app and verify profile shows details, charts display line graph, logo redirects to dashboard
