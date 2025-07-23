import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "高校数学学習アプリ",
                short_name: "MathApp",
                description: "高校数学を学べるPWAアプリ",
                theme_color: "#2563eb",
                background_color: "#f8fafc",
                display: "standalone",
                icons: [
                    {
                        src: "/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                ],
                screenshots: [
                    {
                        src: "/screenshots/screen1.png",
                        sizes: "1280x720",
                        type: "image/png",
                        form_factor: "wide",
                    },
                    {
                        src: "/screenshots/screen2.png",
                        sizes: "720x1280",
                        type: "image/png",
                        form_factor: "narrow",
                    },
                ],
            },
        }),
    ],
});
