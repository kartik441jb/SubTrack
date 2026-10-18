import { hasDb, provider } from "../lib/core.js";
export default (req, res) =>
  res.status(200).json({ provider: provider(), storage: hasDb });
