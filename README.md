# 🎵 RevPlay — Music Streaming Web App

A full-stack music streaming application built with **Spring Boot** (backend) and **Angular 17** (frontend). Artists can upload songs and listeners can stream them in real time — just like Spotify.

![RevPlay](https://img.shields.io/badge/Status-Active-brightgreen) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green) ![Angular](https://img.shields.io/badge/Angular-17-red) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📸 Screenshots

| Listener Home | Artist Upload | Music Player |
|---|---|---|
| Songs grid with trending & latest | Drag & drop upload with cover art | Fixed bottom player bar |

---

## ✨ Features

### 🎧 Listener
- Browse **Trending** and **Recently Added** songs
- **Search** songs by title or genre
- **Play / Pause / Skip / Repeat / Shuffle** with a fully functional bottom player bar
- Seek bar with real-time progress
- Add songs to **Favorites**
- Create and manage **Playlists**

### 🎤 Artist
- **Upload songs** (MP3, WAV, FLAC, OGG) with drag & drop
- Auto-detects song duration from the audio file
- Upload **cover art** with live preview
- Organise songs into **Albums**
- View **Analytics** — play counts, top songs, weekly stats
- **Dashboard** with quick actions

### 🔒 Auth
- JWT-based authentication
- Role-based access — `LISTENER` and `ARTIST`
- Register / Login with role selection

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Frontend** | Angular 17 (Standalone Components, Signals) |
| **Database** | MySQL 8 |
| **Auth** | JWT (JSON Web Tokens) |
| **Styling** | SCSS, CSS Variables |
| **File Storage** | Local filesystem (`uploads/`) |

---

## 📁 Project Structure

```
revplay/
├── backend/                        # Spring Boot application
│   └── src/main/java/com/revplay/
│       ├── config/                 # SecurityConfig, WebConfig
│       ├── controller/             # REST API controllers
│       ├── dto/                    # Data Transfer Objects
│       ├── entity/                 # JPA Entities
│       ├── repository/             # Spring Data repositories
│       ├── security/               # JWT filter, utils
│       └── service/                # Business logic
│
└── frontend/                       # Angular 17 application
    └── src/app/
        ├── core/
        │   ├── models/             # TypeScript interfaces
        │   ├── services/           # song.service, auth.service
        │   ├── guards/             # Auth route guard
        │   └── interceptors/       # JWT interceptor
        ├── features/
        │   ├── landing/            # Landing page
        │   ├── auth/               # Login / Register
        │   ├── listener/           # Home, Search, Favorites, Playlists
        │   └── artist/             # Dashboard, Upload, Albums, Analytics
        └── shared/
            └── components/
                ├── player/         # Bottom music player bar
                └── song-card/      # Song card component
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **Angular CLI** — `npm install -g @angular/cli`
- **MySQL 8+**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/revplay.git
cd revplay
```

---

### 2. Set up the Database

Open MySQL and run:

```sql
CREATE DATABASE revplay_db;
```

Or import the provided schema:

```bash
mysql -u root -p revplay_db < revplay_database.sql
```

---

### 3. Configure the Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Change these to match your MySQL setup
spring.datasource.username=root
spring.datasource.password=your_password

# Base URL (keep as-is for local development)
app.base-url=http://localhost:8080
```

---

### 4. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at **http://localhost:8080**

> An `uploads/` folder is created automatically when the first song is uploaded.

---

### 5. Run the Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend starts at **http://localhost:4200**

---

## 🔑 Demo Accounts

After importing `revplay_database.sql`:

| Role | Email | Password |
|------|-------|----------|
| Listener | `listener@demo.com` | `password123` |
| Artist | `artist@demo.com` | `password123` |

Or register a new account and choose your role on the Register page.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Songs (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/songs/public/all` | Get all songs |
| GET | `/api/songs/public/trending` | Get trending songs |
| GET | `/api/songs/public/latest` | Get recently added songs |
| GET | `/api/songs/public/search?q=` | Search songs by title |

### Songs (Artist only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/songs/artist/upload` | Upload a new song |
| GET | `/api/songs/artist/my-songs` | Get artist's own songs |
| POST | `/api/songs/{id}/play` | Increment play count |

### Playlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists/my` | Get user's playlists |
| POST | `/api/playlists` | Create a playlist |
| DELETE | `/api/playlists/{id}` | Delete a playlist |

---

## 🗄️ Database Schema

```
users          → id, username, email, password, role, displayName
songs          → id, title, genre, duration, audioUrl, coverImageUrl, playCount, artist_id, album_id
albums         → id, title, coverImageUrl, description, artist_id
playlists      → id, name, description, privacy, owner_id
playlist_songs → playlist_id, song_id  (join table)
favorites      → id, user_id, song_id
```

---

## 🎵 How to Upload & Play a Song

1. **Register** as an **Artist**
2. Go to **Upload Song**
3. Drag & drop your `.mp3` file — title and duration are auto-filled
4. Optionally add cover art and select a genre
5. Click **Upload Song**
6. **Switch to Listener account** — the song appears on the Home page
7. Click the song card to play it in the bottom player bar

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `server.port` | `8080` | Backend port |
| `spring.datasource.url` | `localhost:3306/revplay_db` | MySQL URL |
| `app.base-url` | `http://localhost:8080` | Used to build audio file URLs |
| `app.jwt.expiration` | `86400000` | JWT expiry in ms (24 hours) |
| `spring.servlet.multipart.max-file-size` | `100MB` | Max upload size |

---

## 🐛 Troubleshooting

**Songs not showing on Home page**
- Make sure the backend is running on port 8080
- Check the browser console for CORS or 401 errors
- Verify you're logged in as a Listener

**Audio not playing (404 error)**
- Delete old songs from the database and re-upload them
- Older uploads may have incorrect URL paths stored

**Cover image not showing**
- The image falls back to a 🎵 icon automatically if the URL is broken
- Re-upload the song with a new cover image

**Port already in use**
```bash
# Kill process on port 8080
npx kill-port 8080
```

---

## 📦 Build for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/revplay-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
ng build --configuration production
```
Compiled files will be in `frontend/dist/`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add some feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aarya**
- Built with ❤️ using Spring Boot + Angular

---

> ⭐ If you found this project helpful, please give it a star on GitHub!
