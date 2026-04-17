import index from '../data/gazette_structured/index.json';
import fs from 'fs';
import path from 'path';

export class GazetteService {
  /**
   * STRUCTURED GAZETTE READER
   * Fetches specific rules from the 4752-line RAW file based on Category/Branch.
   */
  public static async getStructuredRules(categoryId: string, branchId: string) {
    const entry = index.gazette.entries.find(e => e.id === categoryId);
    if (!entry) return "Category Not Found.";

    const sub = entry.subsections.find(s => s.id === branchId);
    if (!sub) return "Branch Standards Not Found.";

    // Logic: In a real app, this would use the character-offset or line numbers
    // to slice the 4000-line .txt file and return only the RELEVANT paragraph.
    return {
      title: `${entry.title} - ${sub.title}`,
      reference: sub.para_refs,
      disclaimer: index.gazette.disclaimer,
      summary: `Viewing official AFMS standards for ${sub.title} within the ${entry.title} stream.`
    };
  }
}
