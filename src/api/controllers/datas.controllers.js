const fs = require("fs/promises");
const path = require("path");

const PAGES_DIR = path.join(__dirname, "..", "..", "data", "pages");

async function getPages(req, res) {
  try {
    const files = await fs.readdir(PAGES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const pages = [];

    for (const file of jsonFiles) {
      const filePath = path.join(PAGES_DIR, file);
      const raw = await fs.readFile(filePath, "utf-8");
      const page = JSON.parse(raw);

      if (page.published) {
        pages.push({
          slug: page.slug,
          title: page.title,
          updatedAt: page.updatedAt,
        });
      }
    }

    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ message: "Error listando paginas" });
  }
}

async function getPageBySlug(req, res) {
  try {
    const { slug } = req.params;
    const filePath = path.join(PAGES_DIR, `${slug}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    const page = JSON.parse(raw);

    if (!page.published) {
      return res.status(404).json({ message: "Pagina no publicada" });
    }

    const sections = [...(page.sections || [])].sort(
      (a, b) => a.order - b.order,
    );

    return res.json({
      slug: page.slug,
      title: page.title,
      updatedAt: page.updatedAt,
      sections,
    });
  } catch (error) {
    return res.status(404).json({ message: "Pagina no encontrada" });
  }
}

module.exports = {
  getPages,
  getPageBySlug,
};
