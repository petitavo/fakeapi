import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    try {
        const filePath = path.join(process.cwd(), "db.json");
        const raw = await fs.readFile(filePath, "utf8");
        const db = JSON.parse(raw);

        // Extraer correctamente el path después de /api/
        const slug = req.query.slug || [];
        const [collection, id] = slug;

        if (!collection) {
            // Si no hay colección (solo /api), devuelve todo el db.json
            return res.status(200).json(db);
        }

        if (!db[collection]) {
            return res.status(404).json({
                error: "Colección no encontrada",
                disponibles: Object.keys(db),
            });
        }

        if (!id) {
            // Si solo piden /api/users -> devuelve toda la colección
            return res.status(200).json(db[collection]);
        }

        // Si piden /api/users/1 -> devuelve el elemento con ese ID
        const item = db[collection].find((obj) => String(obj.id) === String(id));

        if (!item) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        return res.status(200).json(item);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
