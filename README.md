# 🎭 VTuber Studio v3.0 (Face & Body Tracking)

Aplicație web pentru VTubers, creată în JavaScript pur, HTML5 Canvas și alimentată de **MediaPipe**.

## 🚀 Caracteristici
- **Face & Mouth Tracking**: Detectare facială în timp real și animare a gurii.
- **Body Tracking (MediaPipe Pose 3D)**: Detecție 3D a umerilor, brațelor și încheieturilor folosind o singură cameră web.
- **AI Cut-Off / Segmentare Fundal**: Eliminare fundal real fără ecran verde.
- **Control Măști & Fundaluri**: Încărcare măști PNG și fundaluri cu galerie salvată local (LocalStorage).
- **Control Touch & Zoom**: Calibrare facilă, scalare (0.1x - 20x), rotire și oglindire (Flip H/V).

## 🛠️ Tehnologii Utilizate
- HTML5 / CSS3 / Vanilla JavaScript
- [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh.html)
- [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html)
- [MediaPipe Selfie Segmentation](https://google.github.io/mediapipe/solutions/selfie_segmentation.html)

## 💻 Cum se rulează
1. Deschide fișierul `index.html` în orice browser modern (Chrome, Edge, Firefox, Safari).
2. Permite accesul la camera web.
3. Selectează/Încarcă masca ta PNG și un fundal din panou.
