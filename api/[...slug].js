import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    try {
        const filePath = path.join(process.cwd(), "db.json");
        console.log("Ruta del JSON:", filePath);

        const raw = await fs.readFile(filePath, "utf8");
        const db = JSON.parse(raw);

        const urlParts = req.url.split("/api/")[1]?.split("/").filter(Boolean) || [];
        console.log("Ruta solicitada:", urlParts);

        if (urlParts.length === 0) {
            return res.status(200).json(db);
        }

        const [collection, id] = urlParts;
        console.log("Colección pedida:", collection);

        if (!db[collection]) {
            return res.status(404).json({
                error: "Colección no encontrada",
                disponibles: Object.keys(db), // 👈 muestra qué claves tiene el JSON realmente
            });
        }

        if (!id) {
            return res.status(200).json(db[collection]);
        }

        const item = db[collection].find((obj) => String(obj.id) === String(id));
        if (!item) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        return res.status(200).json(item);
    } catch (error) {
        console.error("Error en handler:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
