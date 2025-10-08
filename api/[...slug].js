import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    try {
        // Leer base de datos
        const filePath = path.join(process.cwd(), "db.json");
        const raw = await fs.readFile(filePath, "utf8");
        const db = JSON.parse(raw);

        // Extraer segmentos de la ruta correctamente (para Vercel)
        const slug = Array.isArray(req.query.slug)
            ? req.query.slug
            : req.query.slug
                ? [req.query.slug]
                : [];

        const [collection, id] = slug;

        // Si no hay colección, devuelve todo el JSON
        if (!collection) {
            return res.status(200).json(db);
        }

        // Verificar si la colección existe
        if (!db[collection]) {
            return res.status(404).json({
                error: "Colección no encontrada",
                disponibles: Object.keys(db),
            });
        }

        // Si solo se pide la colección (ej: /api/users)
        if (!id) {
            return res.status(200).json(db[collection]);
        }

        // Si se pide un ID específico (ej: /api/users/1)
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
