import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    const filePath = path.join(process.cwd(), "db.json");
    const raw = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(raw);

    const { slug = [] } = req.query; // ejemplo: /api/batches/1 -> ['batches','1']

    // Si no hay nada después de /api → devuelve todo el JSON
    if (slug.length === 0) {
        return res.status(200).json(db);
    }

    const [collection, id] = slug;

    // Si la colección no existe
    if (!db[collection]) {
        return res.status(404).json({ error: "Colección no encontrada" });
    }

    // Si no se pide ID → devuelve toda la colección
    if (!id) {
        return res.status(200).json(db[collection]);
    }

    // Si se pide por ID → devuelve ese elemento
    const item = db[collection].find((obj) => String(obj.id) === String(id));
    if (!item) {
        return res.status(404).json({ error: "Elemento no encontrado" });
    }

    return res.status(200).json(item);
}
