# 🧵✨ Saba – Discover, Celebrate & Wear Tradition

Welcome to **Saba**, a modern web application built with **Next.js** that bridges the gap between tradition and technology.
Our mission is simple — to **empower local artisans** and **connect buyers** to authentic, handmade traditional clothing.

---

## 🌍 What is Saba?

**Saba** is more than an e-commerce platform — it’s a **digital marketplace** for culture, craftsmanship, and creativity.
Whether you’re looking for a beautifully woven dress, handmade accessories, or traditional couples’ clothing, Saba brings it all together.

* 🪡 **For Artisans (Designers):** Showcase, verify, and sell handmade products
* 👗 **For Buyers:** Discover and purchase authentic traditional fashion
* 💬 **For Everyone:** A community celebrating culture and connection

---

## 🧩 Core Concepts

Saba introduces **verified designer accounts** and **secure authentication** to protect both artisans and buyers.

* Designers register with email and password
* Designers verify ownership using a **Cardano wallet** (Nami, Lace, Eternl)
* Buyers shop using traditional authentication
* Payments and future on-chain features are handled separately

---

## 🔐 Cardano Wallet Authentication (Designers)

Saba integrates **Cardano wallet–based authentication** to securely verify designer identities.

### Why Cardano?

* Cryptographically secure identity verification
* No passwords required after wallet linking
* No blockchain fees for authentication
* Wallet ownership proves designer identity

### How It Works (High-Level)

1. Designer registers using email and password
2. Designer connects a Cardano wallet (Nami / Lace / Eternl)
3. Backend generates a secure nonce
4. Wallet signs the nonce
5. Backend verifies the signature (off-chain)
6. Wallet is linked to the designer account

> ⚠️ Authentication is **off-chain** — no Cardano validators or transactions are used for login.

### Supported Wallets

* Nami
* Lace
* Eternl
* Flint

---

## 🛍️ Core Features

### ✨ Product Discovery

* Browse curated traditional clothing
* Category-based filtering
* Rich visual presentation

### 🧺 Smart Shopping Experience

* Cart management
* Favorites
* Order tracking

### 🔒 Secure & Trusted

* Verified designer profiles
* Wallet-authenticated sellers
* Role-based access control (BUYER / DESIGNER / ADMIN)

### 📱 Fully Responsive

* Optimized for mobile, tablet, and desktop

---

## ⚙️ Getting Started (Development)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/saba.git
cd saba
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open 👉 [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```text
📦 saba/
 ┣ 📂 app/                # Next.js App Router & API routes
 ┣ 📂 components/         # Reusable UI components
 ┣ 📂 lib/                # Prisma, auth, utilities
 ┣ 📂 public/             # Static assets
 ┣ 📂 styles/             # Tailwind & global styles
 ┣ 📜 prisma/schema.prisma # Database schema
 ┣ 📜 package.json        # Dependencies & scripts
 ┗ 📜 README.md           # Project documentation
```

---

## 🎨 Design Philosophy

Saba’s design embraces simplicity and cultural elegance.

* 🧵 **Authenticity:** Inspired by local craftsmanship
* 🌈 **Vibrance:** Gentle palettes influenced by traditional patterns
* 💫 **Modern Simplicity:** Clean layouts, smooth animations, readable typography

Tailwind CSS is used for styling, and **Geist** font ensures modern clarity.

---

## 💡 Tech Stack

| Category          | Technology                                        |
| ----------------- | ------------------------------------------------- |
| 🧠 Framework      | Next.js                                           |
| 🎨 Styling        | Tailwind CSS                                      |
| 🔐 Authentication | Email/Password + Cardano Wallet (Designers)       |
| 🗃️ Database      | PostgreSQL (via Prisma)                           |
| 🔗 Blockchain     | Cardano (off-chain auth, on-chain payments later) |
| ☁️ Deployment     | Vercel                                            |

---

## 🚀 Deployment

Deploy easily using **Vercel**, the platform built for Next.js applications.

---

## 🤝 Contributing

We ❤️ contributions!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 🌸 About the Project

Saba is a digital initiative focused on preserving tradition while embracing modern technology.
By combining culture, design, and secure authentication, Saba empowers local artisans to thrive in a digital world.

🧶 *“Woven by hands, powered by code.”*
