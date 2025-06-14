// lib/fuzzySearch.ts

import { searchableItems } from "./searchData";
import nlp from "compromise";
import Fuse from 'fuse.js';
const options: Fuse.IFuseOptions<{ name: string }> = {
    keys: ["name"],
    threshold: 0.4, // Controls strictness: 0 = exact, 1 = very loose
};

const fuse = new Fuse(searchableItems, options);

export const searchCategory = (input: string) => {
    // Normalize input using Compromise (optional)
    const normalized = nlp(input).normalize({ contractions: true }).out("text");
    const results = fuse.search(normalized);

    return results.map((res) => res.item);
};
