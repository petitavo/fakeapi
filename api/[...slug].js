import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    const filePath = path.join(process.cwd(), "db.json");
    const raw = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(raw);

    const { slug = [] } = req.query;

    if (slug.length === 0) {
        return res.status(200).json(db);
    }

    const [collection, id] = slug;

    if (!db[collection]) {
        return res.status(404).json({ error: "Colección no encontrada" });
    }

    if (!id) {
        return res.status(200).json(db[collection]);
    }

    const item = db[collection].find((obj) => String(obj.id) === String(id));
    if (!item) {
        return res.status(404).json({ error: "Elemento no encontrado" });
    }

    return res.status(200).json(item);
}
